# Design

## Context

Measured in the exploration, on a production build (`vite build`, then `vite preview --port 3000`, since MMDb only accepts that origin), in a focused 1500x950 window with all 4,527 movies:

| Measurement | Result |
|---|---|
| Drawer frames today | 33 to 117ms medians across open, swap, move and close, worst near the top of the grid |
| React's render | 27ms on open, 11ms on close, once per action |
| Where slow frames go | Chrome's long-animation-frame timing puts almost all of each slow frame in the render phase (style, layout, paint), with almost no script |
| Grid layout alone | A tile height change relayouts all 4,527 tiles in about 2.5ms |
| Tile count | Filtered to 1,332 tiles, everything runs at 16.7ms |
| Static copy, flat grid | 33ms median, 167ms worst |
| Static copy, per-tile `content-visibility: auto` | 17ms median, 68ms worst |
| Static copy, blocks of whole rows each with `content-visibility: auto` | 16.7ms median, 17 to 33ms worst |
| Real app, per-tile containment only | 33 to 99ms medians |

The real app costs more than its static copy, so the drawer itself adds something the copy doesn't have.

Structure today: `UserPage` renders `.movies-list` / `.shows-list` as one grid (`repeat(auto-fit, 174px)` / `200px`, `.5rem 2rem` gaps, max 1560px, centred). Its children are the tiles and the drawers, which code finds as direct children (`:scope > [id]`, `:scope > .info`, `:scope > .open`).

## Goals / Non-Goals

**Goals:**
- MMDb's "stays smooth in large collections" bar, measured in the app, with the page looking exactly as before.

**Non-Goals:**
- JS virtualization: off-screen tiles would leave the page and break the drawer's placement by real positions.
- React render cost: it's small and happens once per action.

## Decisions

### Stage 1: per-tile containment
`content-visibility: auto` with `contain-intrinsic-size: 174px 303px` (movies) and `200px 260px` (shows) on the tiles, and `content-visibility: visible` on the open tile.
- **Selectors:** written as `.movies-list .movie-preview` and `.shows-list .show-preview`, so the search panel's result cards (which reuse those class names) are unaffected.
- **Sizes:** they are the tiles' fixed CSS sizes, so a skipped tile is exactly as big as a drawn one and the scrollbar doesn't jump.

### Stage 2: blocks of 420 tiles
`UserPage` renders the tiles in blocks of 420, as `<div className="grid-block">` children of the list. Each block gets `content-visibility: auto` with an intrinsic height worked out from its tile count.
- **Whole rows:** the list's width is capped at 1560px, which fits at most 7 movie columns (`(1560 + 32) / (174 + 32)`) or 6 show columns. 420 is the least common multiple of 1 to 7, so every block but the last holds whole rows at any width. A turned phone needs no re-grouping, and the drawer's row is always inside one block.
- **Full width:** `content-visibility` clips a block to its own box, and the drawer reaches out to the window's edges. So the list has no `max-width`, and each block spans the page, keeping its tiles to the middle 1560px with `padding-inline: max(0px, calc((100% - 1560px) / 2))`. A block that was only the grid's width cut the drawer off on any window wider than 1560px; this was caught after the first PR push. The pinned grid (search mode) gets `width: 100%` too, so pinning doesn't move the tiles.
- **Grid rules:** the list itself becomes a single column (`minmax(0, 1fr)`) holding the blocks, with the same `.5rem` gap between blocks as between rows. An `auto` column would keep the width of a block's previous column count, so in the browser a turned phone or a narrowed window left blocks wider than the screen. Each block repeats today's grid rules.
- **The last block:** when it follows other blocks, it uses `auto-fill` instead of `auto-fit`, so a final row shorter than the columns lines up under the rows above instead of centring. With one block (fewer than 420 tiles), `auto-fit` stays, so short filtered lists look as they do today.
- **Finding things:** code finds tiles, drawers and the open tile anywhere in the list rather than among its direct children:
  - `UserPage.toggleDrawer` and `followWidth` change `:scope > [id]` and `:scope > .info` to descendant queries.
  - `reveal` already looks in the drawer's parent, which becomes its block, where the open tile also is.
  - `rowEnd` walks siblings, and the walk ends naturally at the block's end, which is also a row's end.
- **Drawers:** each block renders the drawers after its own tiles' row ends, using the same `drawersAfter`.
- **Intrinsic height:** a block's `contain-intrinsic-height` (height only; a single-value `contain-intrinsic-size` sets the width too, which in the browser made skipped blocks 18,652px wide and 90 columns across) is `auto <rows × row height>`, from its tile count and the column count. The column counts (movies and shows) are the one input this needs. They come from the page's width without its scrollbar (`document.documentElement.clientWidth`), since the grid doesn't get the scrollbar's space, worked out the way the CSS does. `UserPage` keeps them in state and updates them only when a resize changes one, so dragging a window's edge doesn't re-render thousands of tiles on every step. The keyword `auto` makes the browser remember a block's real height once it has been drawn, so an estimate that's slightly off corrects itself rather than making the scrollbar jump repeatedly.

### Stage 3: only if stages 1 and 2 miss the bar
Use the same long-animation-frame breakdown to find what the real drawer adds over the static copy. Candidates from the exploration:
- the drawer's content (the large poster, and episode lists) laid out on every frame while it eases;
- the glide's smooth scroll running at the same time as the easing.

Fixes would follow from what's found, for example `contain: content` on the drawer's content, or starting the glide after the easing. The design and tasks are updated before any of that is built.

### Measuring
The acceptance check is the exploration's measurement, run in the app:
- **Setup:** production build on port 3000, Chrome in front at 1500x950, idle frames confirmed at about 16.7ms before starting.
- **Actions:** for rows 5, 300 and 600, time open, same-row swap, move-row and close.
- **What's recorded:** every frame from the list's first DOM change to 600ms later, as the median and the worst.
- **Long scroll:** a jump from the top to the middle of the grid, recording the longest frame.

The numbers from each stage go into the PR.

### Tests
- **Unit tests (jsdom):** block grouping (420 per block, the last block's `auto-fill` class only when there are several), and that the drawer, the glide and a turned phone still work across a block boundary. These use the existing `UserPage` test harness with enough movies for two blocks.
- **Browser:** the frame budget, and that the page looks unchanged.

## Risks / Trade-offs

- [Find in page searches skipped tiles' text, and scrolling to a found title draws its block first.] → That's `content-visibility: auto`'s normal behaviour. Skipped content stays findable and accessible.
- [A block's estimated height may be off before it's first drawn.] → It is computed from the same sizes the CSS uses, and `auto` keeps the real height after the first draw.
- [Stage 3 is open-ended.] → It only starts if stages 1 and 2 miss the bar, and the design and tasks are updated with what's found first.
- [Rendering blocks changes `UserPage`'s render structure, which the drawer code depends on.] → Every drawer behaviour already has tests. They must pass unchanged at stage 2, plus new tests across a block boundary.

## Measurements

Production build, Chrome in front at 1500x950, 4,527 movies, idle frames 16.7ms. Each cell is the median / worst frame in milliseconds during the 600ms after the drawer change; the bar is a median under 25ms.

### Baseline (before this change)

| Row | Open | Swap | Move | Close |
|---|---|---|---|---|
| 5 | 133.2 / 133.4 | 33.3 / 100 | 133.3 / 134.2 | 66.7 / 117.3 |
| 300 | 99.9 / 116.6 | 66.6 / 116.8 | 99.3 / 133.4 | 66.8 / 100.1 |
| 600 | 33.3 / 99.9 | 33.3 / 66.7 | 66.7 / 99.6 | 16.8 / 83.4 |

Long jump from the top to the middle: worst frame 233ms.

### Stage 1: per-tile containment

| Row | Open | Swap | Move | Close |
|---|---|---|---|---|
| 5 | 34.1 / 66.8 | 16.7 / 82.6 | 50.5 / 100 | 50 / 100 |
| 300 | 33.4 / 50.1 | 33.3 / 66.7 | 50 / 84.1 | 33.3 / 83.4 |
| 600 | 17.6 / 50.9 | 16.7 / 65.9 | 66.6 / 133.4 | 33.2 / 83.4 |

Long jump: worst frame 67ms (from 233ms). About half the baseline's cost, but most medians are still over 25ms, so stage 2 follows.

### Stage 2: blocks of 420 tiles

| Row | Open | Swap | Move | Close |
|---|---|---|---|---|
| 5 | 16.7 / 33.3 | 16.7 / 66.3 | 16.7 / 100 | 16.6 / 17.5 |
| 300 | 16.7 / 33.5 | 16.7 / 33.5 | 16.7 / 49.7 | 16.7 / 66.6 |
| 600 | 16.7 / 66.8 | 16.7 / 33.2 | 16.7 / 49.8 | 16.7 / 33.5 |

Every median is at the screen's 16.7ms refresh: the bar is met, so stage 3 isn't needed.

- **Long jumps from a fresh load into never-drawn parts of the grid:** worst frames of 34 to 67ms, with no freeze.
- **Scroll height:** a constant 201,349px before and after the jumps. Every skipped block is its estimated 18,652px at 1500px and 65,302px at 390px, so the scrollbar doesn't jump.
- **Look at 1500px and 390px:** rows step 311px inside a block and across a block boundary alike, and the columns line up between blocks. The last row (5 posters at 1500px, 1 at 390px) starts under the first column.

### Acceptance (final build)

| Row | Open | Swap | Move | Close |
|---|---|---|---|---|
| 5 | 16.7 / 18.7 | 16.7 / 33.4 | 16.7 / 18.7 | 16.7 / 83.2 |
| 300 | 16.7 / 83.3 | 16.7 / 50 | 16.7 / 83.2 | 16.7 / 100.7 |
| 600 | 16.7 / 83.3 | 16.7 / 33.4 | 16.7 / 100 | 16.7 / 83.4 |

Every median is under 25ms. The worst single frame in each action is the one where React renders the change.

Drawer behaviour, checked at the boundary between the first two blocks:
- **Opening:** opens in its own block after its row's end, and glides into view.
- **Swap:** keeps the same element.
- **Moving across the block boundary:** lands in the new block and holds the clicked poster at exactly the same height while the old drawer closes.
- **Turned phone:** a 390x844 frame turned to 926x428 and back gives 2, 4, then 2 a row, with the same drawer after its row's end and no sideways scroll. A height-only change leaves it alone.
- **Search:** clicking a poster while 44 search results showed closed and cleared them. The search cards are unaffected by the containment.
