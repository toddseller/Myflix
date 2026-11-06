# Tasks

Each task is test-first: write the test, run it and see it fail for the right reason, then write the smallest code that passes and run the whole suite (`yarn test` in `frontend/client`, on Node 24 from `.nvmrc`).

## 1. The account menu

- [x] 1.1 Turn `UserNav`'s avatar into an "Account menu" button with `aria-expanded`, opening My collection, Settings and Sign out; verify tests that it opens and shows the three entries, that choosing an entry and clicking outside close it, and that Escape closes it, returns focus to the button and doesn't reach a `document` keydown listener
- [x] 1.2 Style the button and menu in `styles/header.css`, aligned under the avatar; verify `yarn build` succeeds

## 2. Signing out

- [x] 2.1 Make `LOGOUT` reset every store slice but `auth` and the public `home`, and clear `avatar` in `auth`; verify reducer tests that the collection, search results, filters and counts return to empty and `auth` keeps no user
- [x] 2.2 Add `startLogout` (fire-and-forget `/deauthenticate`, clear both storages, `LOGOUT`, go to `/`) and wire Sign out to it; verify tests that both storages are cleared, `/deauthenticate` is called and its failure doesn't matter, the address is `/` with Sign In showing, and `/browse` afterwards goes to `/login`

## 3. The settings page

- [x] 3.1 Share the signed-in check as `requireSignIn` and add `/settings` behind it; verify a router test that signed-out `/settings` goes to `/login`
- [x] 3.2 Build the settings page: current avatar, "Choose a new avatar" file input accepting JPEG and PNG, preview, Cancel, and Save disabled without a file or while saving; verify tests for the preview, Cancel restoring the avatar, and the disabled states
- [x] 3.3 Add `startUpdateAvatar` and `UPDATE_AVATAR`: post the file to `/avatar`, then update the store and the stored sign-in; verify tests that a save changes the header's avatar and `myflixUser` in the storage that held it, that a 422 shows MMDb's message and a 502 or network failure the general one, with the avatar unchanged
- [x] 3.4 Style the settings page; verify `yarn build` succeeds

## 4. In the browser

- [x] 4.1 On a production build at the full 3360px window: open and use the menu by mouse and by keyboard; with search results showing, Escape closes only the menu; sign out and check the home page, the storages and `/browse` redirecting to `/login`; open `/settings` signed out
- [x] 4.2 Once MMDb's `avatar-upload` is live: change the avatar to a real PNG, check the header updates, reload, and check its cdn.myflix.stream URL loads

## Workflow follow-up

- Run `ponytail:ponytail-review` on the uncommitted diff and fix the findings you choose, test-first.
- Commit the code, then archive this change with spec sync as a second commit, `Archive account-settings`, on the same branch, before opening the PR. A fix found after that goes on top as a new commit.
- After merging (and after MMDb's release), publish a release tagged `vYYYY.MM.DD.N` to deploy it, and check myflix.stream.
