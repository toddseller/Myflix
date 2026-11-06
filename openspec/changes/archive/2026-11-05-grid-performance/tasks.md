# Tasks

Each code task is test-first: write the test, run it and see it fail for the right reason, then write the smallest code that passes and run the whole suite (`yarn test` in `frontend/client`, on Node 24 from `.nvmrc`). Measurements use the method in `design.md`: production build on port 3000, Chrome in front at 1500x950, idle frames about 16.7ms.

## 1. Baseline

- [x] 1.1 Measure the current build (open, swap, move, close at rows 5, 300, 600, and a long jump) and record the medians and worst frames in this change's `design.md`; verify the numbers are written down

## 2. Stage 1: per-tile containment

- [x] 2.1 Add `content-visibility: auto` and the tiles' intrinsic sizes to `.movies-list .movie-preview` and `.shows-list .show-preview`, with `content-visibility: visible` on the open tile; verify `yarn build` succeeds and the search panel's result cards are unaffected
- [x] 2.2 Measure again and record the results; if every median is under 25ms and the long jump doesn't freeze, mark 3.1 to 4.1 as not needed (with that reason) and go to group 5

## 3. Stage 2: blocks of 420 tiles

- [x] 3.1 Render the tiles in `.grid-block` blocks of 420, with the last block marked when it follows others, and drawers rendered within their block; verify `UserPage` tests that 845 movies give blocks of 420, 420 and 5, only the last of several blocks is marked, and fewer than 420 give one unmarked block
- [x] 3.2 Find tiles, drawers and the open tile anywhere in the list (`toggleDrawer`, `followWidth`, `reveal`); verify the existing drawer, glide and turned-phone tests pass unchanged (one checked the drawer was the list's last child, which now reads as the drawer following the last tile and ending its row), plus new tests that open, swap and re-place a drawer in the second block
- [x] 3.3 Style the list as a single column of blocks with a `.5rem` gap, each block repeating the grid rules (`auto-fill` for a marked last block), with `content-visibility: auto` and an intrinsic height from its tile count; verify `yarn build` succeeds
- [x] 3.4 Measure again and record the results; check in the browser that rows, gaps and the last row at 1500px and 390px look as before; if every median is under 25ms, mark 4.1 as not needed

## 4. Stage 3: the drawer's own cost

- [x] 4.1 Not needed: stage 2 brought every median to 16.7ms (see `design.md`). Break down the remaining slow frames with long-animation-frame timing, update `design.md` with the cause and its fix, then add tasks for that fix before building it; verify the design names the cause, backed by a measurement

## 5. Acceptance

- [x] 5.1 With the final build, confirm every recorded median is under 25ms, the long jump doesn't freeze, the drawer behaves as before (open, swap, move rows, glide, hold, turned phone, search closing), and the scrollbar doesn't jump while scrolling; verify the final numbers are in `design.md`

## Workflow follow-up

- Run `ponytail:ponytail-review` on the uncommitted diff and fix the findings you choose, test-first.
- Commit the code, then archive this change with spec sync as a second commit, `Archive grid-performance`, on the same branch, before opening the PR with the measurements from each stage.
