# Design

## Context

- The page scrolls the window. Two bars are pinned over it:
  - **Top:** the header (`.header-wrapper`, 108px). The Movies/TV Shows tabs (`.mf-tabs--default`, `top: 83px`, 40px) end at 123px.
  - **Bottom:** the count bar (`.movie-count`, 25px).
- `UserPage.toggleDrawer` fetches the details, finds the row's last tile with `rowEnd`, and sets `{ drawer, closing }`. A same-row swap runs through `easeHeight`, which pins the content's height, renders with `flushSync`, then eases to the new height. Drawers are keyed `drawer-${ rowEnd }`, so a drawer moved to another row would be a new element.
- `ShowDetails` switches seasons through the same `easeHeight`.
- The open drawer's top margin is `-.5rem` (closed: `0`), and its content eases over .35s.
- While search results show, `UserPage`'s `isSearching` state gives the grid the `fixed` class, so the window can't scroll it. The search box clears results through `clearSearchNewMovies`, `clearSearchNewShows` and `clearSearchNewEpisodes`.
- MMDb's `drawer.js` has the same behaviour as `reveal()`, `holdStill()` and a width-only resize handler; this design follows them.

## Goals / Non-Goals

**Goals:**
- MMDb's scroll behaviour for the requirements in this change's delta spec.

**Non-Goals:**
- Changing the search box itself (its open input and typed text), or its existing quirk of only reporting a close when there is more than one result.
- End-to-end browser tests. MMDb uses Playwright for these; adding it to Myflix would be a new dependency.

## Decisions

### `reveal(drawer, { up, height })` in `utils/motion.js`
It glides the window so the drawer's eased bottom clears the count bar, without taking its poster under the tabs bar. Everything is measured at call time, so the maths follows the page if either bar changes:
- **Tabs bar:** the bottom of `.mf-tabs--default`.
- **Count bar:** the top of `.movie-count`, falling back to the window's height.
- **Poster:** the open tile, the `.open` child of the drawer's list.
- **Drawer's bottom once eased:** the content's top, plus `height` (or its `scrollHeight` when no height is given), plus the open margin it has yet to reach.

The distance, as in MMDb: if the poster is above the tabs bar, scroll up to it only when `up`, else not at all. Otherwise scroll by `max(0, min(drawerBottom - countBarTop, posterTop - tabsBottom))`, which never takes the poster past the tabs bar. The scroll uses `window.scrollBy({ top, behavior })`, with `'auto'` under reduced motion and `'smooth'` otherwise.
- Alternative: `element.scrollIntoView`. Rejected: it can't keep the poster's row clear of the tabs bar while aiming at the drawer's bottom.

### `holdStill(tile, top, done)` in `utils/motion.js`
For the transition's length (450ms, as `afterTransition` uses), each animation frame scrolls the window by however far the tile has moved from `top`. When the time is up, it calls `done`. A drawer closing above the row would otherwise pull the clicked poster up as it shrinks.

### Who calls them
- **New drawer (no drawer open):** `toggleDrawer` calls `reveal(drawer, { up: true })` after the `flushSync` render.
- **Same-row swap:** `easeHeight` now returns the height it eases to, and `toggleDrawer` passes it as `reveal(drawer, { height })`.
- **Another row:** record the clicked tile's top before the render, then call `holdStill(tile, top, () => reveal(newDrawer, { up: true }))`. Gliding during the hold would fight it, so the glide waits.
- **Season switch:** `ShowDetails.pick` calls `reveal(drawer, { height })` with the height `easeHeight` returns.
- **"more"/"less":** no call, which is how they leave the page still.

### Drawers keep their element when they move
Each drawer object gets a serial number when it is created (`{ id, rowEnd, n }`), and its key becomes `drawer-${ n }`:
- **Same-row swap:** keeps `n`, so the same element swaps its content, as now.
- **Open drawer closing:** keeps its object, so its element runs the close animation, as now.
- **Width change:** changes `rowEnd` but keeps `n`, so React moves the same element to the new row instead of remounting it, and it doesn't play its opening animation again.

The current `rowEnd` key would remount the drawer on a move, and the "closing at the same row" special case in `toggleDrawer` exists only because of it. With serial keys, that special case can go.

### Following a turned phone
`UserPage` listens for window `resize` and acts only when `innerWidth` differs from the last width it saw, so a phone's address bar (height only) does nothing. With a drawer open:
1. Hide every `.info` in the list for the measurement (`display: none`), since the drawer's own grid row would otherwise end the poster's row early.
2. Measure `rowEnd` of the open tile. `rowEnd` now steps over drawer elements: a hidden drawer still sits in the list between tiles, and its own `offsetTop` would otherwise end the walk mid-row.
3. Restore the drawers, and set the open drawer's `rowEnd` with its `n` unchanged.

A closing drawer is dropped at once, since it's on its way out anyway.

### Closing the search results
At the start of `toggleDrawer`, if `isSearching` is on, `UserPage` sets it to false and dispatches the clear action for the current tab:
- **Movies:** `clearSearchNewMovies`.
- **TV Shows:** `clearSearchNewShows` and `clearSearchNewEpisodes`.

The grid loses its `fixed` class, so the window can scroll it again before the drawer glides. The filter text is untouched, since changing it would close the drawer being opened.

### Tests
jsdom does no layout or scrolling, so the tests stub what they need, as MMDb's `drawer.test.js` does:
- `getBoundingClientRect` for the tile, the drawer's content and the two bars;
- `window.scrollBy` as a spy;
- `requestAnimationFrame` and `performance.now` or fake timers for `holdStill`.

`reveal`'s scenarios are unit tests in `utils/motion.test.js`. The calls from `UserPage` and `ShowDetails`, search closing and the resize handling are tested through rendered components, using the `offsetTop` stub the `UserPage` tests already have. The real glide, the hold, and a turned phone are checked in the browser.

## Risks / Trade-offs

- [`holdStill` measures one tile per frame for 450ms while thousands of tiles sit in the grid.] → One `getBoundingClientRect` per frame forces a layout, but the closing drawer is the only change in it. If frames drop in the browser check, virtualization (slice 3) is the answer, not this change.
- [A glide and the drawer's own easing run at the same time, so the target is the drawer's *eased* height, not its current one.] → `reveal` takes that height (`scrollHeight`, or the height `easeHeight` returns), as MMDb does.
- [Users who scroll during a hold fight it for up to 450ms.] → Same as MMDb. The hold is short and stops on its own.
- [The search box's own toggle doesn't report a close when there is exactly one result.] → Existing, and outside this change. Poster clicks clear `isSearching` directly, so they aren't affected.
