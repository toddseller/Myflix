# Tasks

Each task is test-first: write the test, run it and see it fail for the right reason, then write the smallest code that passes and run the whole suite (`yarn test` in `frontend/client`).

## 1. Data path

- [x] 1.1 Make `FETCH_MOVIE` and `FETCH_SHOW` merge into the existing entry; verify a test in `reducers/collectionReducers.test.js` shows a fetched show keeps `seasonNumbers` and `seasonCount`
- [x] 1.2 Make `startFetchMovie` and `startFetchShow` return the fetched record and drop their `console.log`; verify a test with a stubbed `mmdb.get` gets the record back and nothing is logged

## 2. Row placement

- [x] 2.1 Add `rowEnd(tile)`, which returns the last tile sharing the tile's `offsetTop` (Myflix's filter removes tiles rather than hiding them, so there are none to skip); verify unit tests with stubbed `offsetTop` cover a middle row, the last partial row, and a drawer after the row ending it

## 3. Drawer in the grid

- [x] 3.1 Replace `fetchMovieData` and `fetchShowData` in `UserPage` with a toggle that fetches, then opens the drawer after the row's last tile; verify a `renderWithStore` test shows the drawer after the right tile, and no drawer when the request rejects
- [x] 3.2 Open only the latest click; verify a test where A resolves after B shows B's drawer
- [x] 3.3 Clicking the open poster closes it; a poster in the same row swaps content under the same element; a poster in another row leaves one drawer once the old one is removed; verify tests for all three, with `transitionend` fired or the 450ms fallback reached using fake timers
- [x] 3.4 Close the drawer at once when the filter text or the selected media changes; verify tests for typing a filter and switching tabs
- [x] 3.5 Add `DetailDrawer` motion (mount closed then `.open`, pinned-height swap) and port the `.info` and reduced-motion rules from MMDb's `drawer.css` into `components/DetailDrawer/index.scss`; verify a test that the drawer gets `.open` after a frame and loses it on close

## 4. Movie details

- [x] 4.1 Add `MovieDetails` with poster, title, runtime, year, genre, rating badge (MMDb SVGs) and 4K or HD badge; verify tests for a PG-13 1080p movie, a 4K movie and an unknown rating showing no badge
- [x] 4.2 Add read-only stars and the rating count line; verify tests for 4 and 5 stars (5 marked, "Based on 2 User Ratings"), one rating and none
- [x] 4.3 Add plot, cast and crew by role with singular and plural headings, the Jr. split rule and the studio; verify tests for two directors, "Robert Downey, Jr.", and a movie missing producer and studio
- [x] 4.4 Decode entities and render text only; verify a test with `Fast &amp; Furious <b>X</b>` as the title

## 5. Show details

- [x] 5.1 Add `ShowDetails` opening on the active season (or the lowest season), with title, "Season N" or "N seasons", genre, year, rating and HD badges, season plot and poster, and the counts line; verify tests for "2 seasons, 1 episode", a single season 3, and a 4-season show active on 2
- [x] 5.2 Add season buttons in season order with the shown one marked, switching seasons in local state; verify a test that clicking season 2 shows its plot and episodes and makes no request
- [x] 5.3 List the episodes in `tv_episode` order with number, air date, title, runtime and a cut-short plot with "more"; verify tests for episodes arriving 3, 1, 2, for "more" showing the whole plot, and for no "more" without a plot

## 6. Look and layout

- [x] 6.1 Port the `#meta-data` and show rules from MMDb's `modals.css`, `movies.css` and `responsive.css` (in Myflix's colours, 767px and 1199px breakpoints), with Bootstrap columns as CSS grid, scoped under `.info`; verify `yarn build` succeeds
- [x] 6.2 In the running app, check against MMDb: placement at 1500px, a filtered list and the last row; open, swap, move and close easing; reduced motion; the phone at 390px with no sideways scroll; a 2560px window keeping desktop width with the drawer's background reaching both window edges; no sideways scroll with scrollbars set to always show; `hr` styling unaffected; the panel's edges visible against the black page and the colours matching the rest of Myflix

## Workflow follow-up

- Run `ponytail:ponytail-review` on the uncommitted diff and fix the findings you choose, test-first.
- Commit the code, then archive this change with spec sync as a second commit, `Archive detail-drawer`, on the same branch, before opening the PR.
