# Tasks

Each task is test-first: write the test, run it and see it fail for the right reason, then write the smallest code that passes and run the whole suite (`yarn test` in `frontend/client`, on Node 24 from `.nvmrc`).

## 1. The open poster

- [x] 1.1 Give `MoviePreview` and `ShowPreview` an `open` prop that adds an `open` class, and an always-rendered `.pointer`; pass `open={ drawer?.id === item.id }` from `UserPage`; verify tests that the clicked tile gets `open`, a closing drawer's tile loses it, and tiles without the prop render as before
- [x] 1.2 Port MMDb's open-poster styles (scaled, lifted image; faded text; the pointer in `#090909` with a faint edge; reduced motion) into `DetailDrawer/index.scss`, once for both tiles, with the drawer's colour variables moved up to `.user-page` so the pointer can share them; verify `yarn build` succeeds

## 2. The drawer's poster

- [x] 2.1 Give the drawer's poster a fixed box (`display: block`, `aspect-ratio` 2:3 for movies and 1 for shows, `object-fit: contain`) in `DetailDrawer/index.scss`; verify `yarn build` succeeds
- [x] 2.2 Add `Poster({ src, placeholder, alt })`, which shows the placeholder as a quoted CSS background until the image loads, and none without a `src`; verify tests for the background before `load`, its removal after, no placeholder without a `src`, and a URL containing `")` staying inside the value
- [x] 2.3 Use `Poster` in `MovieDetails` and `ShowDetails`: the grid poster on opening, and the previous season's poster after a season switch (none for a season with no poster); verify tests for opening a movie, opening a show, switching seasons, and a season with no poster

## 3. The season line

- [x] 3.1 Wrap the season buttons in a scrolling `.season-line` with "Earlier seasons" and "Later seasons" arrow buttons, shown from the line's scroll position on `scroll` and window `resize`; verify tests with stubbed widths for a line that fits (no arrows), at its start (right only), in the middle (both) and at its end (left only)
- [x] 3.2 Scroll the line by its visible width on an arrow click, gliding unless reduced motion is asked for (export `reduced()` from `utils/motion.js`); verify tests for `scrollBy` with `smooth` and with `auto`
- [x] 3.3 Place the line before paint when the drawer opens on a show or swaps to another, so the shown season clears the right arrow, and leave it alone on a season switch; verify tests for active season 48 of 48, active season 3 of 48, a switch keeping `scrollLeft`, and (in `UserPage`, which keys `ShowDetails` by show) a show reopening on its active season after the drawer showed another
- [x] 3.4 Port the season line and arrow styles from MMDb's `movies.css` (gradient arrows in `#090909`, `scroll-padding-inline: 34px`, hidden scrollbar); verify `yarn build` succeeds

## 4. "More" only when needed

- [x] 4.1 Measure each episode's plot on mount and window `resize`, showing "more" only when it is cut short, and keep "less" on a whole plot; verify tests with stubbed sizes for a plot that fits, a cut plot, a window narrowing until a plot is cut, and the more/less cycle still working

## 5. In the browser

- [x] 5.1 In the running app, check against MMDb:
  - the open poster at 1500px and 390px (neighbours unmoved, no crowding on a phone), and the pointer meeting the drawer edge with no seam;
  - the poster box not moving the details as images load, including a portrait show poster;
  - the grid poster and previous season showing while images load, using a slowed network;
  - a long show's season line with its arrows, swipe, and placement on the active season;
  - "more" appearing only on cut plots, including after narrowing the window.

## Workflow follow-up

- Run `ponytail:ponytail-review` on the uncommitted diff and fix the findings you choose, test-first.
- Commit the code, then archive this change with spec sync as a second commit, `Archive drawer-finish`, on the same branch, before opening the PR.
