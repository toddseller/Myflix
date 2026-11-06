# Tasks

This change is one CSS rule. jsdom applies no stylesheets, so there's no failing unit test to write first; the browser check before and after the rule stands in for it, and the whole suite (`yarn test` in `frontend/client`, on Node 24 from `.nvmrc`) still runs.

## 1. The block stops clipping

- [x] 1.1 Before the change, on a production build at the full 3360px window, filter the TV shows to "Nocturne", open it, and record the poster's top against its block's top (expected: 10px cut off)
- [x] 1.2 Add `.grid-block:has(> .open) { content-visibility: visible }` beside the open tile's rule in `DetailDrawer/index.scss`; verify `yarn build` succeeds and the suite passes

## 2. In the browser

- [x] 2.1 At the full window, check the open "Nocturne" poster shows in full with the Apple TV logo's margin; then a movie in the grid's first row; then the 421st movie; and that a closed block goes back to `content-visibility: auto`

## 3. Closing

- [x] 3.1 Before the change, at the full window, close an open poster and sample mid-shrink whether a point just outside the tile, still inside the shrinking image, is drawn (expected: cut off)
- [x] 3.2 Hold the tile's and the block's `content-visibility: auto` back until the shrink ends (`transition: content-visibility 0s .3s allow-discrete`, none on opening); verify the same sample shows the poster, opening still switches at once, and both go back to `auto` once the shrink ends

## Workflow follow-up

- Run `ponytail:ponytail-review` on the uncommitted diff and fix the findings you choose.
- Commit the code, then archive this change with spec sync as a second commit, `Archive poster-unclipped`, on the same branch, before opening the PR. A fix found after that goes on top as a new commit.
- After merging, deploy to onyx: rehearse the `linux/amd64` build, tag the live image as `myflix-nginx:before-poster-unclipped`, copy `frontend` and `docker-compose.yml` with `git archive`, and run `docker compose up -d --build` in `~/myflix`.
