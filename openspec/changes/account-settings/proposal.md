# Proposal

## Why

There is no way to sign out of Myflix: the only sign-out happens when MMDb refuses an expired token, so today it means deleting `myflixUser` from the browser's storage by hand. There's also no way to change your avatar. MMDb's `avatar-upload` change adds `POST /api/v2/avatar`, which stores an uploaded avatar under `avatars/` in the `myflix-stream` bucket and saves its URL on the user.

## What Changes

- **The avatar in the header becomes an account menu** with My collection (`/browse`), Settings (`/settings`) and Sign out. It's a real button that says whether the menu is open, works by keyboard, and closes on a click outside, on Escape, or after choosing an entry. While it's open, Escape closes it and doesn't also dismiss search results.
- **Signing out:**
  - tells MMDb (`/deauthenticate`), without waiting on or depending on its answer;
  - clears the stored sign-in from both storages;
  - forgets the collection, search results and filters held in the page's memory;
  - goes to the home page, signed out.
- **A settings page at `/settings`**, behind the same signed-out check as `/browse`. It shows your avatar and lets you choose a JPEG or PNG, preview it and save it.
  - **A save** uploads the file to MMDb, then the header's avatar changes at once, and the stored sign-in keeps the new URL across reloads.
  - **A refused or failed upload** shows MMDb's message, and the avatar stays as it was.

Out of scope: changing name, email or password; removing an avatar; resizing or cropping.

Depends on: MMDb's `avatar-upload` being released, with its IAM step done.

## Capabilities

### New Capabilities
- `user-account`: the account menu, signing out, and the settings page with its avatar upload.

### Modified Capabilities
- `collection-urls`: the header's avatar no longer links to `/browse` itself; the menu's My collection does.

## Impact

- `frontend/client/src/components/header/UserNav.jsx`: becomes the account menu.
- New: a settings page component, its route, and actions to sign out and to upload the avatar.
- `frontend/client/src/reducers/authReducer.js`: `LOGOUT` clears the avatar too; a new action sets the avatar.
- `frontend/client/src/store/configureStore.js`: `LOGOUT` resets the collection, search and filter state.
- `frontend/client/src/routers/router.jsx`: `/settings`, sharing the signed-in check.
- Styles for the menu and the page; tests for each.
- No new dependencies.
