# Proposal

## Why

Typing a filter that matches none of the collection's shows replaces the whole page with the loading spinner, on either tab. The search box goes with it, so the text can't be cleared, and only a reload brings the page back. The page decides it is loading from the *filtered* show list, and its `isLoading` flag is flipped by every open and close of the search box rather than set when the lists arrive.

Separately, the search results panel has no control of its own to dismiss it. The only ways out are a grid poster, or the magnifier icon, which also closes the box and clears the text. That text is also the grid's filter, so giving up on a search costs the filter too.

## What Changes

- The loading page shows only until the collection's movies and shows have loaded. After that, a filter that matches nothing shows an empty grid, with the tabs, search box and count bar still there. The search box no longer touches the loading state.
- The results panel gets a dismiss button (×) at its top right, shown while results or the "Searching our database…" spinner are on screen. Escape does the same while the panel is open. Dismissing closes the panel, clears its results and unpins the grid, and leaves the search box open with its text, so the grid stays filtered.
- Clicking a grid poster while results show opens its drawer and keeps the results, instead of closing them. The search text is also the filter, so the results and the grid usually show the same few titles, and comparing them is the point. With a long filter, a drawer below the screen is reached by dismissing the results first, which unpins the grid.
- The magnifier icon keeps working as now: it closes the box, clears the text and the filter, and ends any search.

Out of scope: a "no results" message for an empty grid, and what the page shows when the collection fails to load or the session has expired (the existing signed-out `/browse/:id` problem). With this change a failed load shows an empty grid instead of an endless spinner.

## Capabilities

### New Capabilities

None.

### Modified Capabilities
- `media-search`: adds that typing a filter never replaces the page, that opening a drawer keeps the search results, and that the results panel can be dismissed by its button or Escape while keeping the filter.
- `detail-drawer`: removes "Clicking a poster closes the search results".

## Impact

- `frontend/client/src/components/UserPage/index.jsx`: loading set once both lists arrive; the dismiss button and Escape handling; `toggleIsLoading` removed.
- `frontend/client/src/components/searchbox/SearchBox.jsx`: its `isLoading` prop removed.
- `frontend/client/src/components/UserPage/index.scss`: the dismiss button's place and colours.
- Tests for both components. No new dependencies; `faXmark` comes from the installed Font Awesome icon set.
