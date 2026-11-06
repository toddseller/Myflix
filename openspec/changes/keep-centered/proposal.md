# Proposal

## Why

Filtering the TV shows to "Nocturne" shows its poster centred, but opening its drawer throws the poster to the left of the screen, about 580px away on a 1560px grid. Separately, the search box ends a search by flipping a switch, and it only flips it when there is more than one result. Closing the box after a search with one result, or none, leaves the results panel open and the grid pinned so the page can't scroll. Both leave a lone result somewhere other than where the user expects it.

## What Changes

- A row with fewer posters than fit across the grid keeps its posters where they are when a drawer opens under it: one poster stays centred, a few stay side by side in the middle. Rows that fill the grid, and a short last row under full ones, are unchanged.
- Closing the search box always ends the search: the results panel closes, its results clear and the grid can scroll again, whether the search found many results, one or none.
- Submitting a search always shows its results, including a second search while the first one's results are still showing. Today the second submit flips the panel closed.
- Adding a movie or a season's episodes from the results ends the search as it does now, without relying on the switch.

Out of scope: the loading spinner that replaces the page when typed text matches none of the collection's shows. It comes from the same flip-a-switch pattern on `isLoading`, but changes what the page shows rather than where results sit.

## Capabilities

### New Capabilities

None.

### Modified Capabilities
- `detail-drawer`: adds that a short row keeps its posters in place when a drawer opens under it.
- `media-search`: adds that closing the search box ends the search, and that each search shows its results.

## Impact

- `frontend/client/src/components/UserPage/index.jsx`: a short row's width for its block; explicit start and end of a search in place of the toggle.
- `frontend/client/src/components/MoviePreview/index.scss` and `ShowPreview/index.scss`: the block's padding uses that width.
- `frontend/client/src/components/searchbox/SearchBox.jsx`: reports a search and a close instead of toggling.
- No new dependencies. No backend changes.
