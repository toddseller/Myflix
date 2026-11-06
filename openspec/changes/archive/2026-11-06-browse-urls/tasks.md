# Tasks

Each task is test-first: write the test, run it and see it fail for the right reason, then write the smallest code that passes and run the whole suite (`yarn test` in `frontend/client`, on Node 24 from `.nvmrc`).

## 1. The route

- [x] 1.1 Replace `/browse/:id` with `/browse/*` and a loader that sends a visitor with no stored sign-in to `/login`, and any splat other than `''` or `shows` to `/browse`; verify `AppRouter` tests that signed out `/browse/shows` ends at `/login` without a `/movies` request, and that `/browse/1` and `/browse/banana/2` end at `/browse`

## 2. The address owns the tab

- [x] 2.1 Add `BrowsePage`, which hands `UserPage` the tab from the address and an `onSelectMedia` that navigates, and have `UserPage` follow the `media` prop into the store and change tabs through `onSelectMedia`; verify `AppRouter` tests that `/browse/shows` opens on TV Shows, that choosing TV Shows at `/browse` moves to `/browse/shows` without fetching `/movies` again, and that going back returns to `/browse` on Movies

## 3. Links

- [x] 3.1 Make sign-in go to `/browse` and the header's avatar link to `/browse`; verify the sign-in test ends at `/browse` and a `UserNav` test that the avatar links there

## 4. In the browser

- [x] 4.1 On a production build at the full 3360px window: reload on `/browse/shows`, switch tabs and use Back and Forward, open an old `/browse/<id>` address, and, in a private window with no sign-in, open `/browse/shows` and check it goes to the sign-in page

## Workflow follow-up

- Run `ponytail:ponytail-review` on the uncommitted diff and fix the findings you choose, test-first.
- Commit the code, then archive this change with spec sync as a second commit, `Archive browse-urls`, on the same branch, before opening the PR. A fix found after that goes on top as a new commit.
- After merging, publish a release tagged `vYYYY.MM.DD.N` to deploy it, and check myflix.stream.
