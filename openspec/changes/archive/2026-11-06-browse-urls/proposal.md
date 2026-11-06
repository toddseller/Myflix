# Proposal

## Why

- **Signed out:** opening `/browse/<id>` while signed out shows the collection page with nothing in it. Until the last release it was a spinner that never ended. The page tries to load the collection with a stored sign-in that isn't there, and nothing on the way checks for one.
- **The id in the address:** it does nothing. Sign-in and the header's avatar link put the user's id there, but the page never reads it, and MMDb's API returns whichever collection the sign-in token belongs to. So `/browse/1`, `/browse/999` and `/browse/banana` all show your own collection.
- **The tab:** it lives only in the page's memory, so a reload or a bookmark always lands on Movies.

MMDb moved its collections to `/u/<handle>` and `/u/<handle>/shows` because they are public and the address must say whose collection it is. Myflix only ever shows the signed-in person's own collection, so the address needs no id or handle, only which tab.

## What Changes

- The collection lives at `/browse` (Movies) and `/browse/shows` (TV Shows). Switching tabs changes the address, so a reload or bookmark keeps the tab, and the browser's Back button returns to the previous tab.
- Signing in, and the header's avatar link, go to `/browse`.
- Any other `/browse/...` address, such as an old `/browse/<id>` bookmark, redirects to `/browse`.
- Opening any `/browse` address while signed out goes to the sign-in page instead of the collection page.

Out of scope: handles or public, shareable collection addresses (Myflix has no way to show someone else's collection), and coming back to the collection after signing in from a redirect.

## Capabilities

### New Capabilities
- `collection-urls`: how the signed-in user's collection is addressed: its movie and TV show addresses, old addresses, and what a signed-out visitor gets.

### Modified Capabilities

None.

## Impact

- `frontend/client/src/routers/router.jsx`: the `/browse` route, with a loader that checks the sign-in and the address, and a small wrapper that hands `UserPage` the tab from the address and a way to change it.
- `frontend/client/src/components/UserPage/index.jsx`: the tab comes from the address; the tabs change the address.
- `frontend/client/src/actions/auth.js` and `frontend/client/src/components/header/UserNav.jsx`: link to `/browse`.
- Tests for the router, sign-in and the page. No new dependencies; `react-router-dom` 7 already provides loaders and redirects.
