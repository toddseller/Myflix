# Proposal

## Why

Myflix is deployed by hand: copy `frontend` and `docker-compose.yml` to onyx with `git archive | ssh tar`, run `docker compose up -d --build` there, and tag the old image first for a rollback. Every step depends on someone remembering it. The server's `~/myflix` is a git checkout in name only: its `HEAD` is `e6144dd` from the Heroku days, `git status` shows 92 changes from the copies, and its `origin` is an SSH URL the server can't use. MMDb has deployed itself from a version tag since 2026-10-24, with checks that keep untested or rewound code off the server, and Myflix should work the same way.

## What Changes

- Publishing a GitHub release with a `v*` tag on `master` deploys that commit to myflix.stream, once its `test` check has passed. Nothing else starts a deploy.
- A deploy workflow reaches onyx over SSH through Cloudflare Access, at its own hostname (`ssh-deploy.myflix.stream`), with its own service token, and with a key that can only run the deploy script.
- A deploy script on the server moves its checkout forward to the tag (never backwards or sideways), keeps the running image as `myflix-nginx:previous`, rebuilds and restarts the site, and fails unless myflix.stream answers.
- CI also builds the Docker image and lints the workflows, so a broken image or workflow fails on the pull request rather than in a deploy.
- A one-time move of `~/myflix` to a clean HTTPS clone, keeping the old folder as a backup.
- Setup outside the repo, done by the owner with a walkthrough: the Cloudflare route and Access application, the key line in `authorized_keys`, and GitHub's `production` environment, secrets and tag ruleset.

The manual `git archive` deploy stops being the way to deploy, but keeps working for an emergency.

## Capabilities

### New Capabilities
- `deploy-on-tag`: how a tagged Myflix release reaches production: what starts a deploy, which commits may be deployed, how the server is reached, how it moves forward, how success is decided and how a release is rolled back.

### Modified Capabilities

None.

## Impact

- New: `bin/deploy`, `.github/workflows/deploy.yml`, a test for `bin/deploy` (`frontend/client/test/deploy.test.js`), and a deploy section in a new root `README.md`.
- Changed: `.github/workflows/test.yml` (image build and workflow lint inside the existing `test` job, which the master ruleset requires).
- Server: `~/myflix` re-cloned; one new `authorized_keys` line.
- Cloudflare: one route on `myflix-tunnel` and one Access application with a service token.
- GitHub: a `production` environment with five secrets, and a tag ruleset.
- No app code changes, no new runtime dependencies.
