# Proposal

## Why

When a drawer opens, its poster in the grid enlarges and lifts 10px, as on MMDb. A poster in the first row of a grid block has the top of that lift cut off: the blocks from `grid-performance` skip their content while off screen (`content-visibility: auto`), which also clips anything drawn outside the block's box. The enlarged poster then looks like its picture zoomed inside a fixed frame. On the filtered "Nocturne", the Apple TV logo ends up against the top edge instead of keeping its margin.

## What Changes

- The block holding the open poster stops clipping, so the enlarged poster shows in full in any row: the grid's top row, a filtered list that fits in one row, and the first row after every 420 tiles.
- Blocks without an open poster keep skipping while off screen, so large collections stay as smooth as now.

## Capabilities

### New Capabilities

None.

### Modified Capabilities
- `detail-drawer`: adds that the enlarged poster is shown in full in every row.

## Impact

- `frontend/client/src/components/DetailDrawer/index.scss`: one rule for the block that holds the open poster.
- No script changes, no new dependencies, no backend changes.
