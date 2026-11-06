# Tasks

Each task is test-first: write the test, run it and see it fail for the right reason, then write the smallest code that passes and run the whole suite (`yarn test` in `frontend/client`, on Node 24 from `.nvmrc`).

## 1. Ranking

- [x] 1.1 Add `rankShowResults(results, myShows, text)` returning the results stably grouped: the collection's seasons, then exact title matches, then the rest; verify unit tests for the "nocturne" case, an exact title outside the collection, order kept within each group, and no promotion when nothing matches
- [x] 1.2 Apply it to `newShows` in `UserPage`'s `mapStateToProps` with `state.shows` and `state.filters.text`; verify a `UserPage` test that the panel renders a collection show's season first

## 2. One scrolling row

- [x] 2.1 Extract `SeasonLine`'s arrows into a `ScrollRow({ className, label, place, children })` component, with `place(line)` run before the first measure, and rebuild `SeasonLine` on it; verify the existing season-line tests pass unchanged, plus `ScrollRow` tests for a row that fits (no arrows), one at its start, middle and end, and its button names from `label`
- [x] 2.2 Render the search panel's cards (movies, shows, episodes and the "all episodes" card) inside a `ScrollRow` labelled "results", leaving the spinner outside; verify `UserPage` tests that results and a season's episodes are inside the row and get "Earlier results" and "Later results" arrows when they overflow
- [x] 2.3 Style the results row (scrolling line, hidden scrollbar, arrows with a gradient from the page's black, centring kept for few results) and share the arrow styles with the season line; verify `yarn build` succeeds

## 3. In the browser

- [x] 3.1 On a production build, check that the "nocturne" TV search shows "Nocturne" season 1 first; that a long row scrolls to its last card by arrow, trackpad and (in a 390px frame) swipe; that a season's episodes scroll the same way; that few results stay centred without arrows; and that the drawer's season line still works

## Workflow follow-up

- Run `ponytail:ponytail-review` on the uncommitted diff and fix the findings you choose, test-first.
- Commit the code, then archive this change with spec sync as a second commit, `Archive search-results`, on the same branch, before opening the PR. A fix found after that goes on top as a new commit.
- After merging, deploy to onyx: rehearse the `linux/amd64` build, tag the live image as a rollback, copy `frontend` and `docker-compose.yml` with `git archive`, and run `docker compose up -d --build` in `~/myflix`.
