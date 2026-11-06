# Design

## Context

- **Loading:** `UserPage` starts with `isLoading: true`, and `render` returns `<LoadingPage />` while `shows.length < 1 && isLoading`.
  - `shows` comes from `FilteredShowsSelector`, so it's the filtered list.
  - Nothing sets `isLoading` false when the lists arrive. Only `toggleIsLoading` changes it, and `SearchBox` calls that (as its `isLoading` prop) on every open and close.
  - `componentDidMount` starts `startFetchMovies()`, `startFetchShows()` and `getCounts()`. The first two return their thunk's promise. It also ends with a stray `return <LoadingPage />`, which does nothing.
- **The panel:** `.new-preview` (position relative) holds either the "Searching our database…" spinner or the `ScrollRow` of results. `isSearching` gives it its `--active` class, and gives the grid its `fixed` class.
- **Closing results:** `closeSearch` sets `isSearching: false` and clears the current tab's results, leaving the search box and its text alone. Grid poster clicks use it.
- **Keys:** nothing in the app handles keys yet.
- **Tests:** a comment in the `UserPage` tests says searches use '5' because the loading page appears "while no show matches".
- **MMDb's dismiss control:** a × at the panel's top right, shown only with the panel, in a muted colour that brightens on hover.

## Goals / Non-Goals

**Goals:**
- `isLoading` means "the collection hasn't arrived yet", and nothing else.
- One more way to close the results, behaving exactly like a poster click.

**Non-Goals:**
- An empty-grid message.
- Error or signed-out pages.
- Changing the magnifier icon's behaviour.

## Decisions

### Loading ends when both lists have arrived
In `componentDidMount`:
```js
Promise.allSettled([this.props.startFetchMovies(), this.props.startFetchShows()])
  .then(() => this.setState({ isLoading: false }))
```
and `render` shows the loading page on `isLoading` alone.
- **Why `allSettled`:** a failed request still ends loading, so the page shows an empty grid instead of spinning forever. Showing an error is out of scope.
- **Removed:** `toggleIsLoading`, `SearchBox`'s `isLoading` prop and its call, and the stray `return` in `componentDidMount`.
- **Alternative: test the unfiltered `state.shows`.** Rejected: a collection with no shows would spin forever, and the check would still mix "loaded" up with "has data".

### Dismissing reuses `closeSearch`
- **The button:** rendered inside `.new-preview` only while `isSearching`.
  - `<button type="button" className="dismiss-results" aria-label="Dismiss search results" onClick={ this.closeSearch }>` with `faXmark` inside.
  - Positioned absolutely at the panel's top right, above the row and its arrows.
  - Coloured `rgba(255,255,255,.7)`, white on hover and keyboard focus.
- **Focus:** the button goes with the panel, so clicking it then moves focus to the search box, which stays open with its text. A keyboard user who pressed the × keeps their place instead of starting again from the top of the page.
- **Escape:** a `keydown` listener on `document`, added in `componentDidMount` and removed in `componentWillUnmount` next to the resize listener. It calls `closeSearch` when the key is `Escape` and `isSearching` is true. Escape inside the search input dismisses too: the box keeps its text either way.
- **Late results:** dismissing while a search runs sets `isSearching` false. Results that arrive afterwards land in the store but don't reopen the panel, which only opens on `openSearch`. The next search clears them before fetching, as now.
- **Alternative: close the box too, like MMDb.** Rejected: the box's text is the grid's filter, so dismissing would undo the filter.

### Opening a drawer keeps the results
- **The code:** `toggleDrawer` drops `if (this.state.isSearching) this.closeSearch()`. The comment on `closeSearch` no longer explains a poster click, and now says what it's used for: the dismiss button and Escape.
- **Why it's safe:** the grid stays pinned, so `reveal`'s glide and the "hold still" step can't move a fixed grid. For a short filtered list the drawer is already on screen. With the results showing and the drawer open on "Nocturne", the layout was checked in the browser: the results sit above, and the drawer opens under the poster.
- **A drawer below the screen:** it stays out of reach until the results are dismissed, which unpins the grid. Chosen over closing the results only in that case, which would make the results stay or go depending on window size and row.
- **Alternative: stop pinning the grid while results show.** Left for later: it changes how the panel sits on the page, which `search-results` just settled.

### Tests
- **`UserPage`, loading:**
  - the loading page shows before the lists arrive and is gone after;
  - typing a filter that matches no show keeps the page and the search box;
  - opening and closing the box doesn't bring the loading page back;
  - a failed shows request still ends loading.
- **`UserPage`, dismissing:**
  - no dismiss button without a search;
  - the button closes the panel, clears the results, unpins the grid and keeps the box's text and the filter;
  - Escape does the same;
  - Escape with no search changes nothing;
  - dismissing during "Searching…" keeps late results from reopening the panel.
- **`SearchBox`:** its loading-related expectation is removed with the prop.
- **Browser:** at the full 3360px window and at 390px.

## Risks / Trade-offs

- [A failed list load now shows an empty grid, which looks like an empty collection.] → Better than an endless spinner. Proper error and signed-out handling is a separate open problem.
- [A global Escape listener could clash with future key handling, such as a drawer closing on Escape.] → It only acts while the results panel is open. If a drawer later uses Escape too, the panel closes first, and it can be revisited then.
