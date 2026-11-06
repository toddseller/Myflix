# Design

## Context

**The jump.**
- **Block styles:** each grid block is `grid-template-columns: repeat(auto-fit, <tile>px)` with `justify-content: center`. Its padding, `max(0px, calc((100% - 1560px) / 2))`, keeps the tiles to the middle 1560px. These rules are in `MoviePreview/index.scss` and `ShowPreview/index.scss`.
- **Collapsing:** `auto-fit` makes every column that fits and then collapses the empty ones. One poster leaves one column, which is centred.
- **The drawer:** it is a grid item with `grid-column: 1 / -1` (`DetailDrawer/index.scss`). It occupies every column, so none collapse, and the block goes back to its full column count. The poster lands in the first column.
- **The drawer's width:** `margin-inline: calc(50% - 50vw)` resolves against the columns the drawer spans. Those are centred in the page, so the drawer reaches the window's edges whatever their width.
- **Column count:** `UserPage` already keeps it in state per grid (`countColumns`), updated on resize only when it changes. `inBlocks` sets each block's `--block-height` inline.
- **A short row:** a grid shorter than one row is always a single block, and it is never `grid-block--last` (that needs `start > 0`).

**The search switch.**
- **Two switches:** `UserPage.onClick` flips `isSearching`. The search box's submit calls it, and so does its close, but only with more than one result. `NewMediaPreview` also calls it after adding a movie or a season's episodes.
- **What it drives:** `isSearching` sets the panel's `--active` class and the grid's `fixed` class.
- **Clearing:** `closeSearch` already sets `isSearching: false` and clears the results for the current tab. Poster clicks use it.

## Goals / Non-Goals

**Goals:**
- No new measuring. A short row's width comes from numbers `inBlocks` already has.

**Non-Goals:**
- The search box's own open state and animation, and the `isLoading` switch (see the proposal's out of scope).

## Decisions

### A short row narrows its block to its posters' width
For a grid with fewer items than `columns`, `inBlocks` adds `--row-width: n × tile + (n − 1) × COLUMN_GAP` px to the block's inline style. Both stylesheets' block padding becomes `max(0px, calc((100% - var(--row-width, 1560px)) / 2))`.

The content box is then exactly n columns wide, so `auto-fit` makes n columns, and the drawer's `1 / -1` spans just them. The posters don't move, and the drawer's margin still reaches both window edges from their centre.
- **Narrow windows:** if the window is narrower than `--row-width`, the padding is 0 and `auto-fit` wraps as it does now. Nothing overflows even if `countColumns`' estimate is off by one.
- **Alternative: `repeat(n, <tile>px)` for short blocks.** Rejected: fixed columns overflow instead of wrapping when the estimate is wrong near a breakpoint.
- **Alternative: span only the used columns from the drawer.** CSS has no "occupied columns" line, so it would need measuring.

### The search starts and ends explicitly
- **`UserPage.onClick` (the switch) goes.** In its place:
  - `openSearch`: sets `isSearching: true` and refreshes counts. The search box's submit calls it.
  - `endSearch`: calls `closeSearch`, then refreshes counts. The search box's close calls it, and so does `NewMediaPreview` after adding.
- **`SearchBox`:** its toggle calls `onClose` only when it is closing (`isOpen` was true), with no result count check. Its submit calls `onSearch`. It drops its own result clearing, which `closeSearch` does. A show search also clears a season's episodes from the last search: the panel shows episodes ahead of show results, and with the panel staying open for a second search they would hide its results.
- **Poster clicks** keep calling `closeSearch` without refreshing counts, as now.
- **Alternative: keep the switch and fix the guard.** Rejected: any count-based guard misfires for some count, and a second submit would still flip the panel closed.

## Risks / Trade-offs

- [`countColumns` estimates from the page width; a short block might be marked short when the browser actually fits one fewer column.] → With `--row-width` wider than the space, the padding goes to 0 and the posters wrap as they would anyway.
- [The open poster is enlarged with a transform, wider than its column.] → Transforms don't change layout, and it already overhangs its neighbours today.
- [Renaming `SearchBox`'s `onClick` prop.] → It has one caller, `UserPage`, plus its own tests, which change with it.

## Migration Plan

Deploy to onyx as before: rehearse the image build locally, tag `myflix-nginx:before-keep-centered`, copy `master`, and rebuild. Roll back by retagging that image.
