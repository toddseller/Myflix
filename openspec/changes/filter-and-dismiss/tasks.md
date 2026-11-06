# Tasks

Each task is test-first: write the test, run it and see it fail for the right reason, then write the smallest code that passes and run the whole suite (`yarn test` in `frontend/client`, on Node 24 from `.nvmrc`).

## 1. Loading means loading

- [x] 1.1 Set `isLoading` false once `startFetchMovies` and `startFetchShows` have both settled, and show the loading page on `isLoading` alone; verify `UserPage` tests that the loading page shows before the lists arrive and goes after, that a filter matching no show keeps the page and the search box's text, and that a failed shows request still ends loading
- [x] 1.2 Remove `toggleIsLoading`, `SearchBox`'s `isLoading` prop and call, and `componentDidMount`'s stray `return`; verify a `UserPage` test that opening and closing the search box, then typing a filter matching nothing, keeps the page, and update the `SearchBox` tests and the '5' comment

## 2. Dismissing the results

- [x] 2.1 Render a "Dismiss search results" button in the panel while a search is open, calling `closeSearch`; verify `UserPage` tests that it's absent without a search, and that clicking it closes the panel, clears the results, unpins the grid and keeps the search box's text and the filtered grid
- [x] 2.2 Dismiss on Escape while a search is open, with the listener added and removed alongside the resize listener; verify tests that Escape dismisses, that Escape with no search changes nothing, and that results arriving after a dismiss during "Searching…" don't reopen the panel
- [x] 2.3 Style the button at the panel's top right with `faXmark`, muted and brightening on hover and focus; verify `yarn build` succeeds

## 3. In the browser

- [x] 3.1 On a production build at the full 3360px window: type a filter matching no show on both tabs and check the page stays with an empty grid; open and close the search box and repeat; search, dismiss by button and by Escape, and check the panel closes with the grid still filtered and scrollable; then at 390px check the button's place and the panel's dismissal

## 4. Opening a drawer keeps the results

- [x] 4.1 Stop `toggleDrawer` closing the search results, and update `closeSearch`'s comment; verify the two `UserPage` tests that a movie or show poster click closes the results, rewritten first to expect the results, the pinned grid and the search text kept with the drawer open, fail and then pass
- [x] 4.2 In the browser at the full window: search "nocturne" on TV Shows, open the "Nocturne" drawer, and check the results stay above with the drawer under the poster; then search a long filter, open a drawer below the screen, dismiss, and check the page scrolls to it

## Workflow follow-up

- Run `ponytail:ponytail-review` on the uncommitted diff and fix the findings you choose, test-first.
- Commit the code, then archive this change with spec sync as a second commit, `Archive filter-and-dismiss`, on the same branch, before opening the PR. A fix found after that goes on top as a new commit.
- After merging, publish a release tagged `vYYYY.MM.DD.N` to deploy it, and check myflix.stream.
