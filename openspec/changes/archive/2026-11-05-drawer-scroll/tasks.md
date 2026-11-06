# Tasks

Each task is test-first: write the test, run it and see it fail for the right reason, then write the smallest code that passes and run the whole suite (`yarn test` in `frontend/client`, on Node 24 from `.nvmrc`).

## 1. The glide and the hold

- [x] 1.1 Add `reveal(drawer, { up, height })` to `utils/motion.js`, measuring the tabs bar, the count bar, the open tile and the drawer's eased bottom; verify unit tests with stubbed rects for a drawer near the bottom (glides down to clear the count bar), one taller than the screen (stops with the row under the tabs bar), one already in view (no scroll), a poster under the tabs bar with `up` (glides up) and without (no scroll), and reduced motion (`behavior: 'auto'`)
- [x] 1.2 Add `holdStill(tile, top, done)`, which scrolls by the tile's movement each frame for 450ms and then calls `done`; verify unit tests with a stubbed frame clock for the tile moving up 100px (scrolls by -100), not moving (no scroll), and `done` running once at the end
- [x] 1.3 Make `easeHeight` return the height it eases to, including when nothing changes; verify the existing easing tests plus checks of the returned height

## 2. Drawers that keep their element

- [x] 2.1 Give each drawer a serial number and key it `drawer-${ n }`, keeping `n` on a same-row swap, and drop the closing-at-the-same-row special case; verify the existing `UserPage` drawer tests still pass unchanged, and a new test that reopening a closing drawer's row gives a fresh drawer

## 3. Calling the glide

- [x] 3.1 Call `reveal` from `UserPage`: `up` for a new drawer, with the eased height for a same-row swap, and after `holdStill` for a move to another row; verify tests with `reveal` and `holdStill` mocked that a new drawer is revealed with `up`, a same-row swap with its eased height and no `up`, and a move holds the clicked tile and then reveals (an already-visible drawer not scrolling is `reveal`'s own unit test)
- [x] 3.2 Call `reveal` with the eased height after a season switch in `ShowDetails`, and not for "more"/"less"; verify tests that a taller season glides the page down, and that "more" never calls `scrollBy`

## 4. Following a turned phone

- [x] 4.1 On a window `resize` that changes `innerWidth`, re-place the open drawer under its tile's new row, measured with the drawers hidden, keeping its element; ignore height-only changes; verify tests with the `offsetTop` stub switched from 3 to 4 tiles a row that the drawer moves after the new row's end and is the same element, and that a height-only resize changes nothing

## 5. Search results

- [x] 5.1 On a poster click while `isSearching` is on, turn it off and clear the tab's search results, leaving the filter text; verify tests that a movie click clears `newMovies`, a show click clears `newShows` and `newEpisodes`, the list loses its `fixed` class, and the drawer still opens

## 6. In the browser

- [x] 6.1 In the running app, check against MMDb:
  - a drawer opened near the bottom glides into view, a tall one stops with its row under the tabs, and one in view doesn't move the page;
  - clicking a poster partly under the tabs glides up;
  - moving rows holds the clicked poster still, above and below;
  - a taller season glides down, and "more" doesn't move the page;
  - a 390x844 frame turned to 926x428 and back keeps the drawer under a full row;
  - clicking a poster while search results show closes them and lets the page scroll;
  - frames stay smooth during the hold in the 4,527-movie grid.

## Workflow follow-up

- Run `ponytail:ponytail-review` on the uncommitted diff and fix the findings you choose, test-first.
- Commit the code, then archive this change with spec sync as a second commit, `Archive drawer-scroll`, on the same branch, before opening the PR.
