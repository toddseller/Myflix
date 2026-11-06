# Proposal

## Why

Searching for "nocturne" to add an episode of a show already in the collection returned 69 seasons across 10 shows, sorted by year by MMDb, so the collection's own "Nocturne" came last. The results panel is one row of cards with no scrolling of its own, and since the drawer's full-width change clipped the page sideways (`overflow-x: clip`), the 55 cards past the screen's edge can't be reached at all. The show was found but impossible to pick.

## What Changes

- A show search's results put the seasons of shows already in the collection first, then exact title matches, then the rest in MMDb's order. MMDb and its sort are unchanged; Myflix reorders what it receives.
- The search results row scrolls sideways inside itself, by swipe, trackpad or "Earlier results" and "Later results" arrows that appear only when there is more to see, as in MMDb. This covers movie results, show results and a season's episodes, which share the panel.
- The season line's arrows and the results row's arrows come from one shared piece, instead of two copies of the same logic.
- The page keeps its sideways clip, which the full-width drawer needs; the panel no longer depends on the page scrolling.

Out of scope: changing MMDb's ranking (its own site would benefit, but that is a change in that repo), reordering movie results, and the existing search-box issues (the spinner when no show matches the typed text, and the toggle with exactly one result).

## Capabilities

### New Capabilities
- `media-search`: how the search panel shows the titles found to add: their order, and reaching every result.

### Modified Capabilities

None.

## Impact

- `frontend/client/src/components/UserPage/index.jsx`: ranks show results; renders the panel's cards inside the scrolling row.
- A shared scrolling-row component with arrows, used by the results panel and by `ShowDetails`' season line.
- `frontend/client/src/components/UserPage/index.scss` (panel) and `DetailDrawer/index.scss` (season line) styles.
- No new dependencies. No backend changes.
