# Design

## Context

- **Header:** `Header.jsx` renders `UserNav` when `state.auth.isSignedIn`. `UserNav` is the avatar image inside a `<Link to="/browse">`, styled by `.user-nav` and `.avatar` in `styles/header.css`.
- **Signing in:**
  - the sign-in is stored as `myflixUser` (`{ token, user: { id, firstName, userName, avatar } }`) in `localStorage` (remember me) or `sessionStorage`;
  - `authReducer` reads it once, when the module loads, for its starting state;
  - `LOGIN` sets `isSignedIn`, `userId`, `firstName`, `userName` and `avatar`. `LOGOUT` clears all but `avatar`.
- **Signing out today:** `apis/sessionExpiry.js` clears both storages, dispatches `LOGOUT` and goes to `/login` on any 401. Nothing else signs out, and `LOGOUT` leaves the collection, search results and filter in the store.
- **The API:** `apis/mmdb.js` is an axios instance on `https://mmdb.online/api/v2`. Actions set `Authorization: bearer <token>` per request from the stored sign-in. MMDb's CORS allows `/api/v2/*` from myflix.stream and localhost:3000.
- **MMDb's `avatar-upload`:**
  - `POST /api/v2/avatar` with multipart field `avatar` answers `{ avatar: url }`;
  - a bad file gives 422 `{ error }`, storage trouble 502 `{ error }`, and a bad token 401.
- **Routing:** `router.jsx` has `browseLoader`, which redirects to `/login` without a stored sign-in, plus the `/browse` path checks.
- **Escape:** `UserPage` listens for `keydown` on `document` and dismisses search results on Escape while they show.

## Goals / Non-Goals

**Goals:**
- Sign-out that leaves nothing of the user in the page or the browser's storage.
- An avatar change that shows everywhere at once and survives a reload.

**Non-Goals:**
- Other account fields.
- Revoking the token on MMDb's side (it has no revocation list).
- Any image editing.

## Decisions

### The account menu replaces `UserNav`'s link
- **The button:** `UserNav` becomes a function component holding `open` state.
  - The avatar is a `<button aria-haspopup="menu" aria-expanded={open} aria-label="Account menu">`.
  - The menu is a list of real links and one button:
    - `<Link to="/browse">My collection</Link>`;
    - `<Link to="/settings">Settings</Link>`;
    - `<button>Sign out</button>`.
- **Where it renders:** the open menu goes into `document.body` through `createPortal`, `position: fixed` under the avatar at z-index 101. The collection page fixes its tabs (z-index 3) and search box into the header's strip, and its search results sit at z-index 100; the header is a fixed element, so nothing inside it can rise above those, and raising the whole header would hide the tabs and search box under its gradient.
- **Focus:** opening moves focus to the first entry, since the menu is no longer next to the avatar in tab order. Focus moving to anything outside the avatar and menu closes it.
- **Closing:**
  - choosing an entry closes the menu;
  - a window resize closes it, since its position was worked out from the avatar's when it opened;
  - a `pointerdown` listener on `document`, only while the menu is open, closes it when the target is outside the menu;
  - Escape is handled in the menu's own `onKeyDown`. It closes the menu, returns focus to the button, and calls `event.nativeEvent.stopPropagation()`. React handles the event at its root container (for the portal, at `body`), before it reaches `document`, so `UserPage`'s Escape listener never sees it. That's how an open menu wins without the two components knowing about each other.
- **Alternative: a `<details>`/`<summary>` menu.** Rejected: it doesn't close on an outside click or after choosing an entry without the same code anyway.

### Signing out
- **`startLogout()`**, a thunk in `actions/auth.js`:
  1. sends `mmdb.post('/deauthenticate')` with the token, without awaiting it and with errors swallowed, since it only ends MMDb's server-side session cookie;
  2. removes `myflixUser` from both storages;
  3. dispatches `LOGOUT`;
  4. calls `router.navigate('/')`.
- **Forgetting state:** `configureStore`'s root reducer passes `undefined` for every slice except `auth` and `home` on `LOGOUT`, so the collection, search results, filters and counts return to their starting values. `auth` keeps its own `LOGOUT` case, which now also clears `avatar`.
  - **Why `auth` is excluded:** its starting value was read from storage when the module loaded, so resetting it to `undefined` would sign the user back in.
  - **Why `home` is excluded:** it's public, not the user's, and it's fetched only once, in `index.jsx`; `HomePage` maps over its lists, so emptying it would break the page sign-out lands on.
  - **A side benefit:** the 401 interceptor's `LOGOUT` now also forgets the collection.
- **Alternative: reload the page after signing out.** Rejected: slower, and it hides state that should be cleared properly.

### Settings at `/settings`
- **The guard:** `browseLoader`'s signed-in check becomes `requireSignIn`, used by `/settings` alone and by `/browse` before its path check.
- **The page,** `components/Settings`, is a function component. Its state is the chosen `file`, a preview URL from `URL.createObjectURL` (revoked on change and unmount), the `error` message, and a `saving` flag.
  - `<input type="file" accept="image/jpeg,image/png">`, with a visible label "Choose a new avatar".
  - Cancel clears the choice. Save is disabled without a file or while saving.
- **`startUpdateAvatar(file)`**, a thunk:
  1. posts a `FormData` with field `avatar` and the token to `/avatar`;
  2. on success, dispatches `UPDATE_AVATAR` with the URL, and writes it into the stored `myflixUser.user.avatar` of whichever storage holds it.
- **After a save,** the page goes to `/browse` with `useNavigate`. The avatar is the only thing on the page, so staying there left My collection in the account menu as the only way back.
- **Errors:** on a 422 the page shows MMDb's `error.response.data.error`, which is about the file; on anything else, a 502 included, it shows "Your avatar couldn't be saved. Try again.", since MMDb's other messages are about its own storage. A 401 is already handled by the interceptor.
- **Why no size or type check in the browser:** MMDb is the authority. A duplicate check could disagree with it, and the `accept` attribute already steers the picker.

### Tests
- **`UserNav`:**
  - the avatar is a button that opens the menu, with three entries and `aria-expanded`;
  - choosing an entry closes the menu;
  - a click outside closes it;
  - Escape closes it, returns focus, and doesn't reach a `document` listener.
- **Signing out:** a `startLogout` test that both storages are cleared, `/deauthenticate` is called, the store's collection, search and filter are back to empty, `auth` is signed out without an avatar, and the address is `/`. Plus a router test that `/browse` then goes to `/login`.
- **Settings:**
  - `/settings` signed out goes to `/login`;
  - choosing a file previews it, and Cancel restores the avatar;
  - a successful save updates the store and the stored sign-in;
  - a 422 shows MMDb's message, a 502 or network failure shows the general one, and Save is disabled while saving.
- **The browser,** at the full 3360px window: the menu by mouse and keyboard, sign-out, the signed-out redirect, and a real avatar upload once MMDb's endpoint is live.

## Risks / Trade-offs

- [Depends on MMDb's `avatar-upload` being live.] → The menu, sign-out and settings page work without it, and only Save would fail, with the general message. The release order is MMDb first.
- [The token stays valid until it expires after sign-out.] → Same as MMDb's own sign-out. The browser no longer holds it.
- [`createObjectURL` previews leak if not revoked.] → Revoked whenever the choice changes and on unmount.
