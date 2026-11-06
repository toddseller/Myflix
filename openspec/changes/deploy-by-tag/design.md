# Design

## Context

**MMDb's system, which this copies** (in `~/Development/DBC/Phase-2/MMDb`, spec `deploy-on-tag`):
- **`.github/workflows/deploy.yml`:**
  - runs on `v*` tags, in a `production` environment that only admits those tags;
  - one deploy at a time (`concurrency: production`, not cancelled);
  - checks the tag format, that the commit is on `master`, and that its `test` check passed, waiting up to 45 × 20s while it runs;
  - installs cloudflared `2026.10.3` from its release `.deb`;
  - SSHes with `ProxyCommand='cloudflared access ssh --hostname %h'` and strict host key checking, with secrets `DEPLOY_SSH_KEY`, `DEPLOY_KNOWN_HOSTS`, `DEPLOY_SSH_TARGET`, `CF_ACCESS_CLIENT_ID` and `CF_ACCESS_CLIENT_SECRET`;
  - sends `deploy $TAG`.
- **`bin/deploy`:**
  - takes the request from `SSH_ORIGINAL_COMMAND`, which `authorized_keys`' `command=` forces;
  - refuses a bad tag, a dirty checkout, a branch other than `master`, a tag not on `origin/master`, a moved tag (fetch without `+`) or a tag behind the server;
  - fast-forwards, migrates, then restarts or rebuilds;
  - curls the site until it answers 200, up to 10 times 3s apart;
  - calls `main "$@"` last, so bash has read the whole script before the merge rewrites it.
- **Tests:** `spec/deploy_script_spec.rb` runs the real script against throwaway git repos, with `docker` and `curl` replaced by recorders on `PATH`.
- **Things learned there:**
  - a `v*` tag pushed over SSH is refused by the tag ruleset, so releases are published in GitHub's web UI;
  - a deploy runs the `bin/deploy` the server had before it;
  - `docker compose exec` over SSH needs `< /dev/null`.

**Myflix today:**
- **CI:** one workflow, `test.yml`, with a single job `test` that runs `yarn test` and `yarn build`. The ruleset "Master Requires Test" requires that check.
- **The repo:** public, `master`, no tags.
- **The image:** `frontend/Dockerfile` builds the client in `node:24-slim` and copies `build/` into `nginx:alpine`. Compose builds it as `myflix-nginx` on port 7666, which `myflix-tunnel` serves as myflix.stream.
- **onyx:**
  - `~/myflix` has a `.git` at `e6144dd`, with 92 changes from `git archive` copies, and `origin` is `git@github.com:toddseller/Myflix.git`;
  - images `myflix-nginx:before-*` (six of them) are rollbacks kept by hand;
  - `authorized_keys` has your key and MMDb's forced deploy key.

## Goals / Non-Goals

**Goals:**
- MMDb's guarantees for Myflix: only tested `master` commits, only forward, single-purpose access, a failed health check fails the run.
- A rollback that needs no rebuild.

**Non-Goals:**
- Sharing MMDb's hostname, token or key.
- Deploying on every merge.
- Zero-downtime swaps: recreating the nginx container takes about a second.

## Decisions

### `bin/deploy`: MMDb's script without migrations, always rebuilding
- **Kept from MMDb:**
  - the request parsing and its refusals;
  - the fetch without `+`;
  - the fast-forward;
  - the health check with `DEPLOY_HEALTH_URL`, `DEPLOY_HEALTH_TRIES` and `DEPLOY_HEALTH_INTERVAL` overrides;
  - `main "$@"` last.
- **Dropped:** migrations, and the choice between restarting and rebuilding. The site is baked into the image, so every deploy runs `docker compose up -d --build`.
- **Added:** before building, `docker tag myflix-nginx:latest myflix-nginx:previous`, when there is a `latest` and the server moved to a new commit. A redeploy leaves it alone: the running image is then the release being retried, and tagging it would replace the good release before it. A tag replaces the previous one of that name, so exactly one rollback is kept, and the old one stays on disk only as a dangling image. The six hand-made `before-*` images are left alone, unless you ask to remove them.
- **Alternative: build in CI and push to a registry.** Rejected: it would need a registry and its credentials. onyx builds the image in about a minute, as now.

### Tests drive the real script, as MMDb's do
- **File:** `frontend/client/test/deploy.test.js`, in Vitest's `node` environment (a `@vitest-environment node` comment), so `yarn test` and the `test` check run it.
- **Setup per test:**
  - make a temp bare `origin`, a seed clone that commits and tags, and a `server` clone;
  - put stand-in `docker` and `curl` on `PATH`, which log their arguments, with curl answering a status set by the test;
  - run `server/bin/deploy`, with `SSH_ORIGINAL_COMMAND` where the case needs it.
- **Cases:** taken from the spec:
  - malformed or extra words, no git or docker run;
  - a dirty checkout, and not on `master`;
  - a tag that isn't on `master`, a missing tag, a tag behind the server, and a moved tag;
  - a fast-forward, and a redeploy;
  - `previous` tagged before the build;
  - health 200, and health failing;
  - the request taken from SSH.
- **Alternative: a bats or shell test.** Rejected: it would add a test runner. Node's `child_process` and `fs` do it inside the suite the project already runs.

### `test.yml`: the image and the workflows checked in the required job
The `test` job gets two steps, both run from the repo root: `docker build ./frontend`, and actionlint (`rhysd/actionlint:1.7.7` in Docker). They're steps rather than separate jobs: the ruleset and the deploy's gate both look at the single `test` check, so anything outside it wouldn't block a merge or a deploy.

### `deploy.yml`: MMDb's workflow with Myflix's names
- **The same:** triggers, environment, concurrency, gate, cloudflared version and SSH options as MMDb.
- **Secret names:** the same five, so the walkthrough matches MMDb's setup. The values differ.
- **`DEPLOY_SSH_TARGET`:** `onyx@ssh-deploy.myflix.stream`, kept as a secret like MMDb's.

### Cloudflare, the server key and GitHub
Each of these is a walkthrough step that you carry out. I check each one where I can.
1. **Cloudflare route:** on `myflix-tunnel`, a published application route `ssh-deploy.myflix.stream` to `ssh://192.168.40.63:22`.
2. **Access application:** a self-hosted application for that hostname, with a Service Auth policy allowing one new service token, `myflix-deploy`.
3. **The deploy key:**
   - you generate it on your Mac (`ssh-keygen -t ed25519 -N '' -C myflix-deploy -f ~/.ssh/myflix-deploy`);
   - you append its public key to onyx's `authorized_keys`, as `command="/home/onyx/myflix/bin/deploy",no-pty,no-port-forwarding,no-agent-forwarding,no-X11-forwarding,no-user-rc <public key>`;
   - the private key only goes into GitHub.
4. **Known hosts:** I build the `DEPLOY_KNOWN_HOSTS` value from `ssh-keyscan` on the LAN, with the host name replaced by `ssh-deploy.myflix.stream`. It contains public keys only.
5. **GitHub:**
   - a `production` environment limited to tags matching `v*`;
   - the five secrets, which you paste;
   - a tag ruleset on `refs/tags/v*` that restricts creation, update and deletion, with you as the only bypass, like MMDb's.

### Server cutover
- **When:** after the code is merged, and before the first release, so the server has `bin/deploy` when the first tag arrives.
- **Steps:**
  1. Move `~/myflix` to `~/myflix-before-deploy-by-tag`.
  2. Clone `https://github.com/toddseller/Myflix.git` into `~/myflix`. The same folder name keeps compose's project name, so the container and image names stay the same.
  3. Tag the running image as `myflix-nginx:previous`, since the first release will likely be a redeploy of the cloned commit, which keeps none. Then run `docker compose up -d --build` and check myflix.stream.
- **Rollback:** move the old folder back and bring it up.

## Risks / Trade-offs

- [The first release runs whichever `bin/deploy` the clone has, and later fixes to `bin/deploy` only apply from the deploy after them (MMDb's lesson).] → The cutover clones the merged `master`, so the first deploy already runs this change's script. A release that changes `bin/deploy` and depends on it is deployed twice.
- [The build happens on the live server, so a failed build leaves the old container running but fails the deploy.] → `up -d --build` builds before it replaces the container. The `test` check has already built the same Dockerfile.
- [`myflix-nginx:previous` is the image before the last deploy, so two bad deploys in a row lose the good one.] → It is still on disk as a dangling image, and older releases can be redeployed from a tag after a revert on `master`.
- [A public repo's workflow could leak secrets.] → Secrets live only in the `production` environment, which only `v*` tags can use, and only the owner can create those tags.

## Migration Plan

1. Merge the change, after its unit tests and the `test` check pass.
2. Cutover on onyx (above). I run it once you say yes.
3. The walkthrough: Cloudflare route, Access app and token, key, known hosts, GitHub environment, secrets and ruleset.
4. First release: you publish `v2026.11.<day>` in GitHub's web UI, and we watch the run and check myflix.stream.
5. If it fails: fix it and redeploy the same tag, or roll back with `myflix-nginx:previous`. The manual `git archive` deploy still works throughout.
