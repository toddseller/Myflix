# Tasks

Each task is test-first: write the test, run it and see it fail for the right reason, then write the smallest code that passes and run the whole suite (`yarn test` in `frontend/client`, on Node 24 from `.nvmrc`).

## 1. A short row keeps its place

- [x] 1.1 In `inBlocks`, give a grid with fewer items than `columns` a `--row-width` of `n × tile + (n − 1) × COLUMN_GAP` px on its block, and none otherwise; verify `UserPage` tests that 1 show gets 200px, 3 movies get 586px, and a grid of at least one full row gets no `--row-width`
- [x] 1.2 Make both grids' block padding `max(0px, calc((100% - var(--row-width, 1560px)) / 2))`; verify `yarn build` succeeds

## 2. The search starts and ends explicitly

- [x] 2.1 Change `SearchBox` to call `onSearch` on submit and `onClose` when its toggle closes it, whatever the result count, and drop its own result clearing; verify `SearchBox` tests that closing calls `onClose` with 0, 1 and many results, that opening doesn't, and that a submit calls `onSearch`
- [x] 2.2 Replace `UserPage.onClick` with `openSearch` (results panel open, counts refreshed) and `endSearch` (`closeSearch`, counts refreshed), passed to `SearchBox` and to `NewMediaPreview`; verify `UserPage` tests that closing the box after one result closes the panel and unpins the grid, that a second search keeps the panel open, and that adding a movie closes it

## 3. In the browser

- [x] 3.1 On a production build at the full 3360px window: filter the TV shows to "Nocturne", open its drawer, and check the poster stays centred with the pointer under it; repeat with a filter leaving 3 movies; check a full grid's last row is unchanged; then at 390px check a short filter wraps as before
- [x] 3.2 At the full window: search, close the box with one result and with none, and check the panel closes and the grid scrolls; run a second search while results show and check they appear

## Workflow follow-up

- Run `ponytail:ponytail-review` on the uncommitted diff and fix the findings you choose, test-first.
- Commit the code, then archive this change with spec sync as a second commit, `Archive keep-centered`, on the same branch, before opening the PR. A fix found after that goes on top as a new commit.
- After merging, deploy to onyx: rehearse the `linux/amd64` build, tag the live image as `myflix-nginx:before-keep-centered`, copy `frontend` and `docker-compose.yml` with `git archive`, and run `docker compose up -d --build` in `~/myflix`.
