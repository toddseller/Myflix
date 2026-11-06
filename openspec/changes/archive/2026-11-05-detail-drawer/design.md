# Design

## Context

- `UserPage` renders the grid as `.movies-list` or `.shows-list`, both already CSS grids (`repeat(auto-fit, 174px)` and `200px`, max 1560px wide, centred). Each tile is a `MoviePreview` or `ShowPreview` whose image calls `onClick(id)`.
- `startFetchMovie(id)` and `startFetchShow(id)` already call `GET /api/v2/movies/:id` (the movie with its `ratings`) and `GET /api/v2/shows/:id` (the show with `seasons`, each with `episodes`). They dispatch `FETCH_MOVIE` and `FETCH_SHOW`, then log to the console.
- Those reducers replace the list entry with the fetched record. A show's list entry carries `seasonNumbers` and `seasonCount`, which `/shows/:id` does not return, so today a fetched show's tile label turns into "Season undefined".
- The seasons and episodes in `/shows/:id` come in no guaranteed order. MMDb orders seasons by `season` and episodes by `tv_episode`, and opens on the season with `is_active`.
- MMDb's drawer (`public/js/mmdb/drawer.js`, `public/css/drawer.css`) inserts a `.info` element after the row's last tile, as a full-width grid item that eases with `grid-template-rows: 0fr` to `1fr`. Its movie and show markup lives in `app/views/partials/_info.erb` and `_show_info.erb`, styled by `modals.css`, `movies.css` and `responsive.css` (breakpoints at 767px and 1199px, plus `max-height: 500px` for a phone held sideways).
- jsdom does no layout, so `offsetTop` is always 0 in tests; MMDb's unit tests stub it per tile.

## Goals / Non-Goals

**Goals:**
- Match MMDb's drawer behavior and layout for the requirements in this change's spec, in React, using the existing Redux data path, in Myflix's colours.

**Non-Goals:**
- MMDb's movie play links to the NAS, the owner's ratings form (stars here are read-only), and the owner's edit buttons.
- Animation tests in jsdom; motion is checked in a real browser.

## Decisions

### Placement: measure the rendered tiles at click time
On a click, `UserPage` finds the clicked tile among the list's children and walks forward while the next visible tile has the same `offsetTop`, as MMDb's `rowEnd` does. The id of the last tile in that row goes into state, and the render inserts the drawer right after that tile, with `grid-column: 1 / -1`. `rowEnd` is a small pure function over DOM elements, so it can be unit tested with stubbed `offsetTop`.
- Alternative: compute the column count from the grid's width. Rejected: it breaks with gaps, `auto-fit` and partial rows, which MMDb already ran into.

### State: local to `UserPage`, the record from Redux
`UserPage` keeps `{ open: { id, rowEnd }, closing: { id, rowEnd } | null }` in component state. The drawer reads the full record from `state.movies[id]` or `state.shows[id]`. Which item is open is view state for one page, so it doesn't need to be in the store.

### Opening waits for the details; the last click wins
The thunks return the fetched record (and stop logging it). The click handler bumps a request counter, awaits the thunk, and opens only if its counter is still the latest. A rejected request is caught and leaves the grid unchanged. Clicking the open poster closes it without fetching.

### Reducers merge instead of replace
`FETCH_MOVIE` and `FETCH_SHOW` become `{ ...state[id], ...payload }`, so the list entry's own fields (`seasonNumbers`, `seasonCount`, `isnew`) survive and the tile is unchanged. Since the movie and show reducers would then be the same, they stay as they are, with one line changed each.

### Motion: MMDb's CSS, with a timeout fallback for removal
- Opening: the drawer mounts closed and then gets `.open` on the next frame, which runs the `0fr` to `1fr` transition.
- Closing: the drawer moves to `closing`, loses `.open`, and is removed on its `transitionend`, or after 450ms when no transition runs (reduced motion), as in MMDb's `afterTransition`.
- Same-row swap: same React key (the row-end id), so the element stays. Before the content changes, the wrapper's height is pinned to its current pixels. After render it is set to the new `scrollHeight`, and cleared once the height transition ends. Season switches reuse the same easing.
- Another row: the old drawer goes to `closing` under its own key while the new one opens, so both briefly exist.
- Reduced motion: the CSS `prefers-reduced-motion` block sets `transition: none`.
- Alternative: an animation library. Rejected: no new dependency for two transitions.

### The list closing the drawer
In `componentDidUpdate`, a change to the filter text or the selected media clears `open` and `closing` at once. This matches MMDb, where a filter redraws the list and takes the drawer with it. It also avoids keeping a stale row end when the rows shift.

### Components and styles
- `DetailDrawer` handles the open, closing and swap motion around its children.
- `MovieDetails` and `ShowDetails` render the markup ported from `_info.erb` and `_show_info.erb`. Bootstrap's `col-lg-*` columns become CSS grid columns, since Myflix has no Bootstrap.
- Rating and HD badges are the MMDb inline SVGs, in a map keyed by rating.
- Styles are ported from `drawer.css` (the `.info` rules and reduced motion), plus the `#meta-data` and show rules from `modals.css`, `movies.css` and `responsive.css` with Myflix's colours in place of MMDb's dark palette: white text, `rgba(255,255,255,.7)` muted text, `#e50914` accent, `#333333` dividers, and a `#090909` panel. The panel is barely lighter than the black page, so its top and bottom edges are a faint white line rather than MMDb's black. The colours are variables on `.info`. They live in a new `components/DetailDrawer/index.scss`.
- Rules for the open poster, the pointer and the season arrows are left out.
- Credits split on MMDb's pattern, `/(?<!,),(?!\sJr\.)/`, then trim each name.
- Stars are `Math.round(average of ratings[].stars)`, 0 when there are none.
- Titles go through the existing `decodeEntities` and render as React text.

## Risks / Trade-offs

- [The drawer stays put if the window is resized while it is open, so a turned phone can leave it under the wrong row.] → Out of scope (slice 2); closing and reopening places it correctly.
- [A drawer moving rows can shift the clicked poster on screen, since this change holds nothing still.] → Out of scope (slice 2).
- [Large grids render every tile, so the drawer's animation may drop frames in a collection of thousands.] → Out of scope (slice 3); the animation is on one grid row, the same layout cost as filtering today.
- [jsdom can't check easing or placement by layout.] → Unit tests cover `rowEnd`, state transitions and content. Easing, placement at real widths and the phone layout are checked in the running app afterwards.
- [The drawer reaches the window's edges with `margin-inline: calc(50% - 50vw)`, which relies on the grid being centred in the window and counts a visible scrollbar in `100vw`.] → The grid is centred in every mode (the list's auto margins, its centred columns, and the fixed search mode's `left: 50%`). `overflow-x: clip` on `UserPage`'s root keeps the scrollbar's width from scrolling the page sideways.
- [Ported CSS can collide with Myflix's global rules, such as `hr:nth-of-type(2)` in `UserPage/index.scss`.] → Scope the drawer's rules under `.info` and check `hr` styling in the browser.
