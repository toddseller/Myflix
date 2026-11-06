# Tasks

Code tasks are test-first: write the test, run it and see it fail for the right reason, then write the smallest code that passes and run the whole suite (`yarn test` in `frontend/client`, on Node 24 from `.nvmrc`). Tasks marked **(owner)** are done by you, with a walkthrough; I check each where I can.

## 1. The deploy script

- [x] 1.1 Add the `bin/deploy` test harness (`frontend/client/test/deploy.test.js`, node environment): throwaway origin, seed and server repos, stand-in `docker` and `curl`; verify the refusal cases fail against a missing script
- [x] 1.2 Write `bin/deploy` (MMDb's, without migrations, always `docker compose up -d --build`, tagging `myflix-nginx:previous` first, health-checking https://myflix.stream/); verify every case in the spec's "only moves forward", "rebuilds and keeps the previous one" and "succeeds only when the site answers" requirements passes

## 2. The workflows

- [x] 2.1 Add `docker build ./frontend` and actionlint as steps of the `test` job in `test.yml`; verify actionlint passes locally on both workflows and the image builds with `DOCKER_DEFAULT_PLATFORM=linux/amd64`
- [ ] 2.2 Add `.github/workflows/deploy.yml` (MMDb's, with Myflix's names); verify actionlint passes and the gate's tag-format, on-master and check-state logic by running its shell step locally against this repo

## 3. Docs

- [x] 3.1 Add a root `README.md` with how to release, how a deploy runs, how to roll back to `myflix-nginx:previous`, and the manual fallback

## 4. Server cutover (after merging)

- [ ] 4.1 With your go-ahead, move `~/myflix` to `~/myflix-before-deploy-by-tag`, clone the repo over HTTPS into `~/myflix`, tag the running image as `myflix-nginx:previous` (the first release is likely a redeploy of the same commit, which keeps none), run `docker compose up -d --build`, and check myflix.stream serves the merged bundle

## 5. Access and secrets

- [ ] 5.1 **(owner)** Cloudflare: add the route `ssh-deploy.myflix.stream` to `ssh://192.168.40.63:22` on `myflix-tunnel`, and a self-hosted Access application for it with a Service Auth policy and a new service token `myflix-deploy`; I check the hostname answers through Access
- [ ] 5.2 **(owner)** Generate the deploy key on your Mac and add its forced-command line to onyx's `authorized_keys`; I check over the LAN that the key runs only `bin/deploy` and refuses a shell
- [ ] 5.3 Build the `DEPLOY_KNOWN_HOSTS` value from `ssh-keyscan` for `ssh-deploy.myflix.stream`
- [ ] 5.4 **(owner)** GitHub: create the `production` environment limited to `v*` tags, add its five secrets, and add the tag ruleset on `refs/tags/v*` (restrict creation, block update and deletion, owner bypass); I check the environment and ruleset through the API

## 6. First release

- [ ] 6.1 **(owner)** Publish a release tagged `v2026.11.<day>` on `master` in GitHub's web UI; together we watch the Deploy run, then I check myflix.stream serves that commit's bundle and that `myflix-nginx:previous` exists

## Workflow follow-up

- Run `ponytail:ponytail-review` on the uncommitted diff and fix the findings you choose, test-first.
- Commit the code, then archive this change with spec sync as a second commit, `Archive deploy-by-tag`, on the same branch, before opening the PR. Groups 4 to 6 happen after the merge; their outcome is recorded in the archived change in a follow-up commit if needed.
