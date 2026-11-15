# Tasks

Each task is test-first: write the test, run it and see it fail for the right reason, make it pass, then run the whole suite (`yarn test` in `frontend/client`, on Node 24 from `.nvmrc`).

## 1. Naming a season

- [x] 1.1 Add `utils/seasons.test.js` covering `isSpecials` (0 and "0" are specials; 1, "1" are not) and `seasonName` ("Specials" for 0 or "0", "Season 3" for 3). Add `utils/seasons.js` to pass it, and verify the suite passes.

## 2. The drawer

- [x] 2.1 In `DetailDrawer/ShowDetails.test.jsx`, add a test that a show with seasons 0, 1 and 2 shows buttons "1", "2", "Specials" in that order, and that clicking "Specials" marks it and shows season 0's plot. Verify it fails on the button order and label. Then change the sort and `SeasonLine`'s label in `ShowDetails.jsx`, and verify the suite passes.
- [x] 2.2 Add a test that the same show with no active season opens on season 1, with its button marked. Verify it passes after 2.1; the sort change should already cover it. If it doesn't, fix the default-season pick.
- [x] 2.3 Add tests for the counts. Seasons 1 to 14 plus a season 0 read "14 seasons, N episodes", with the specials' episodes included, and "14 seasons" under the title. Season 3 plus a season 0 reads "1 season, N episodes" and "Season 3", including after picking Specials. A show with only season 0 reads "Specials, N episodes" and "Specials". Verify they fail on the counts, then count from the regular seasons in `ShowDetails.jsx`, and verify the suite passes.

## 3. The tile and search results

- [x] 3.1 In `ShowPreview/index.test.jsx`, add a test that a show with `seasonCount` "0" and `seasonNumbers` "" reads "Specials", that a stale `seasonCount` "0" with `seasonNumbers` "1" reads "Season 1", and that `seasonCount` "14" reads "14 Seasons". Verify the specials test fails, add the branch in `ShowPreview/index.jsx`, and verify the suite passes.
- [x] 3.2 In the `search results` block of `UserPage/index.test.jsx`, add a test that show results with `season: 1` and `season: 0` read "Season 1" and "Specials". Verify it fails, use `seasonName` in `NewMediaPreview/index.jsx`, and verify the suite passes.

## 4. In the browser

- [x] 4.1 On a production build in the full 3360px window, open MythBusters. Verify the season line ends with "Specials", the counts leave it out, clicking it shows the specials' episodes, and the line's arrows and active-season placement still behave with the wider button (screenshot it). Search for MythBusters on the TV Shows tab and verify a stored season 0 reads "Specials".

## Workflow follow-up

- Run `ponytail:ponytail-review` in a fresh subagent on the uncommitted diff, report its findings, and fix the ones you choose, test-first.
- Commit the code, then archive this change with spec sync as a second commit, `Archive show-specials-season`, on the same branch, before opening the PR. A fix found after that goes on top as a new commit.
- After merging, publish a release tagged `vYYYY.MM.DD.N` to deploy it, and check myflix.stream.
