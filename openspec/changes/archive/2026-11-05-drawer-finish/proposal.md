# Proposal

## Why

The detail drawer works, but it still lacks MMDb's finishing touches: nothing on the grid shows which poster is open, the drawer's poster box jumps as its image loads, a show with many seasons wraps its season buttons, and every episode offers "more" even when its plot already fits. This change brings the drawer's look up to MMDb's. Its scroll behaviour comes in a following change, `drawer-scroll`.

## What Changes

- The open poster is enlarged, lifted, and points into the drawer, as in MMDb, without moving its neighbours. Its title (and a show's season line) fades out while it is open.
- The drawer's poster box takes its full size before the image arrives: 2:3 for a movie, square for a show, so nothing in the drawer moves when it loads. A show poster of another shape fits whole inside the square.
- Until its own image loads, the drawer's poster shows the image the user was just looking at: the clicked grid poster, or the previous season's poster after a season switch.
- A show's season buttons stay on one line that scrolls sideways, with "Earlier seasons" and "Later seasons" arrows that appear only when seasons are hidden. The line opens with the active season in view, and keeps its place when the user switches seasons.
- **Changed:** an episode offers "more" only when its plot is cut short at the current window width.
- Ported from MMDb's `drawer.css`, `movies.css`, `season-row.js`, `scroll-arrows.js` and `credits.js`, in Myflix's colours.

Out of scope, for `drawer-scroll`: gliding the drawer into view, holding the clicked poster still when the drawer moves rows, keeping the page still when the drawer grows, and re-placing the drawer when a phone turns. Also still out of scope: virtualizing large grids, owner edit, and keeping the drawer open while episodes are added.

## Capabilities

### New Capabilities

None.

### Modified Capabilities
- `detail-drawer`: adds requirements for the open poster's marking, the poster box and its placeholder, and the season line; changes when an episode offers "more".

## Impact

- `frontend/client/src/components/MoviePreview` and `ShowPreview`: an `open` state and the pointer.
- `frontend/client/src/components/UserPage/index.jsx`: tells the open tile it is open, and passes the grid poster to the drawer.
- `frontend/client/src/components/DetailDrawer/`: the poster box and placeholder, the season line and its arrows, and "more" only when needed; styles in `index.scss`.
- No new dependencies (the arrows use the installed Font Awesome chevrons). No backend changes.
