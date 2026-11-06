# Design

## Context

- **Routing:** `routers/router.jsx` uses `createBrowserRouter` (react-router-dom 7). The route `/browse/:id` renders `UserPage`. Nothing reads `:id`.
- **Where `/browse/<id>` comes from:** `actions/auth.js` navigates to `/browse/${user.id}` after sign-in, and `header/UserNav.jsx` links the avatar to `/browse/${user.userId}`.
- **Signing in:** the sign-in is stored as `myflixUser` (token and user) in `localStorage` (remember me) or `sessionStorage`.
  - `startFetchMovies`, `startFetchShows` and `getCounts` read it and throw when it's missing.
  - A 401 from MMDb clears it and goes to `/login` (`apis/sessionExpiry.js`).
- **The tab:** it's `state.filters.media`, either `'movies'` or `'tvShows'`, set by `UserPage.toggleSelectedButton` from the `Tabs`.
  - `SearchBox`, `NewMediaPreview` and the selectors read it.
  - A change of it closes any open drawer (`getDerivedStateFromProps`).
- **nginx:** `frontend/nginx.conf` answers every path with `index.html` (`try_files $uri /index.html`), so `/browse/shows` loads the app on a reload. myflix.stream already answers 200 there.
- **Router tests:** `AppRouter.test.jsx` renders paths through the real `router`. One test expects `/browse/7` after sign-in.

## Goals / Non-Goals

**Goals:**
- The address says which tab, and only that.
- No collection page or request without a stored sign-in.

**Non-Goals:**
- Handles or other users' collections.
- Returning to the requested tab after signing in.
- Checking the stored token's expiry before MMDb does.

## Decisions

### One splat route with a loader
```js
{ path: '/browse/*', loader: browseLoader, element: <BrowsePage /> }
```
- **`browseLoader`** runs before anything renders:
  - no `myflixUser` in either storage: `redirect('/login')`;
  - a splat other than `''` or `'shows'`: `redirect('/browse')`;
  - otherwise `null`.
- **One route for both tabs:** switching between `/browse` and `/browse/shows` keeps the same `UserPage` mounted. Two separate routes would remount it and fetch the collection again.
- **Old bookmarks:** `/browse/:id` needs no route of its own, because the splat catches it and redirects. A loader redirect replaces the history entry, so Back doesn't return to the old address.
- **Alternative: a check inside `UserPage`.** Rejected: the page would mount, and start its requests, before navigating away.

### The address owns the tab; Redux follows it
- **`BrowsePage`:** a small function component in `router.jsx` that maps the splat to `media` (`'shows'` to `'tvShows'`, otherwise `'movies'`), and passes `UserPage` an `onSelectMedia` that navigates to `/browse/shows` or `/browse` with a plain push, so Back returns to the previous tab.
- **`UserPage`:**
  - dispatches `setSelectedMedia(media)` on mount and whenever the `media` prop differs from the store's;
  - `toggleSelectedButton` calls `onSelectMedia` instead of dispatching.
- **Why Redux stays:** everything that reads `state.filters.media` keeps working untouched, and the drawer still closes when the tab changes.
- **Why not import the router in `UserPage`:** `router.jsx` imports `UserPage`, so that would be a cycle. `BrowsePage` gets `useNavigate` instead, which keeps routing in the router file.
- **Alternative: keep the tab in Redux only and sync the address from it.** Rejected: two sources of truth, and Back would need its own handling.

### Links
- `startLogin` navigates to `/browse`.
- `UserNav`'s avatar links to `/browse`, and no longer needs the user id for it.

### Tests
- **`AppRouter.test.jsx`:**
  - `/browse` and `/browse/shows` render the right tab;
  - `/browse/1` and `/browse/banana/2` end at `/browse`;
  - signed out, `/browse/shows` ends at `/login` with no `/movies` request;
  - sign-in ends at `/browse`;
  - choosing TV Shows changes the address without a second `/movies` request;
  - going back returns to `/browse`.
- **`UserNav`:** the avatar links to `/browse`.
- **The browser:** at the full 3360px window, a reload on `/browse/shows`, Back between tabs, an old `/browse/<id>` bookmark, and signed out in a private window.

## Risks / Trade-offs

- [A stored but expired token passes the loader, and the page then gets a 401.] → The existing interceptor clears it and goes to `/login`, as today. The loader only stops the "never signed in" case.
- [The first render on `/browse/shows` could briefly use the store's `'movies'`.] → The loading page shows until the lists arrive, and the store is updated on mount, before then.
