# Proposal

## Why

Measured on a production build with the window in front, the drawer's animations in the 4,527-movie grid run at a median of 33 to 117ms a frame, against MMDb's bar of under 25ms. React isn't the cost: its render takes 11 to 27ms once per action. The time goes to the browser's render phase, which grows with how many tiles exist rather than how many are on screen. A grid of 1,332 tiles already runs at 60 frames a second. This change brings the large grid to MMDb's bar. It is slice 3 of the drawer.

## What Changes

- Tiles far from the screen are skipped by the browser (`content-visibility: auto`), keeping their exact size so nothing on the page moves. The open tile is exempt, since its enlarged poster and pointer draw outside its box.
- The grid's tiles are grouped into blocks of 420 tiles. 420 is a multiple of every possible column count (1 to 7), so a block always ends on a full row at any width. Each block is skipped as a unit when far from the screen. The page looks exactly as before.
- If those two don't meet the bar, the extra cost the real drawer adds (its content easing open, or the page's glide running alongside) is found and removed.
- The work is staged: each step is measured in the app, and the change stops at the first step that meets the bar.

Out of scope: JS virtualization (which would remove off-screen tiles from the page and undo the drawer's measured placement), and the existing problems listed in the last PR.

## Capabilities

### New Capabilities

None.

### Modified Capabilities
- `detail-drawer`: adds requirements that the drawer stays smooth in a large collection and that scrolling the grid doesn't freeze, and that the grid looks the same however its tiles are grouped.

## Impact

- `frontend/client/src/components/UserPage/index.jsx`: renders tiles in blocks; finds tiles and drawers anywhere in the list rather than as its direct children.
- `frontend/client/src/utils/motion.js`: `reveal` finds the open tile within the drawer's block (already its parent).
- `frontend/client/src/components/MoviePreview/index.scss`, `ShowPreview/index.scss` or `DetailDrawer/index.scss`: the containment and block styles.
- No new dependencies. No backend changes.
