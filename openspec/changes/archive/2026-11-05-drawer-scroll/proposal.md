# Proposal

## Why

The drawer looks finished, but it doesn't keep its place on the page. A drawer opened near the bottom of the screen opens out of sight, a drawer moving to another row lets the clicked poster jump as the old drawer closes above it, a turned phone leaves the drawer under a row that no longer exists, and a drawer opened while search results show can run off a grid that can't scroll. MMDb handles all of these; this change brings that behaviour to Myflix and completes slice 2 of the drawer.

## What Changes

- The page glides just far enough to bring an opening drawer into view, keeping its poster's row clear of the pinned tabs bar and the drawer's bottom clear of the pinned count bar. It does the same when the drawer swaps to another poster in its row, or when a season switch makes it taller. Only opening may glide the page up. A drawer already in view leaves the page still, and so does reading partway down a tall drawer.
- When the drawer moves to another row, the clicked poster holds its place on screen while the old drawer closes, and then the new drawer glides into view.
- Growth inside the drawer from "more" or "less" never moves the page.
- When the window's width changes, as when a phone turns, the open drawer moves to sit under its poster's new row without closing or reopening. A change in height alone leaves it where it is.
- With reduced motion asked for, the page moves at once rather than gliding.
- Clicking a grid poster while search results show closes and clears the results, so the grid can scroll to the drawer again. The search box keeps its text.
- Ported from MMDb's `drawer.js` (`reveal`, `holdStill`, and its resize handling).

Out of scope: virtualizing large grids, owner edit, and keeping the drawer open while episodes are added.

## Capabilities

### New Capabilities

None.

### Modified Capabilities
- `detail-drawer`: adds requirements for gliding the drawer into view, holding the clicked poster still, leaving the page still for growth inside the drawer, following a turned phone, and closing the search results when a poster is clicked.

## Impact

- `frontend/client/src/utils/motion.js`: the glide (`reveal`) and the hold (`holdStill`); `easeHeight` returns the height it eases to.
- `frontend/client/src/components/UserPage/index.jsx`: calls them when a drawer opens, swaps or moves; re-places the drawer on a width change; closes the search results on a poster click; keys drawers so a moved drawer keeps its element.
- `frontend/client/src/components/DetailDrawer/ShowDetails.jsx`: glides after a season switch.
- No new dependencies. No backend changes.
