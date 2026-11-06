# Tasks

This change is one CSS declaration. jsdom applies no stylesheets and runs no transitions, so there's no failing unit test to write first. A browser check before and after the change stands in for one, and the whole suite (`yarn test` in `frontend/client`, on Node 24 from `.nvmrc`) still runs.

## 1. Before the change

- [x] 1.1 On a production build in the full 3360px window, open a movie and a show and step through the opening (for example, sample the title's opacity and the poster's bottom edge every 50ms). Record that the title is mostly gone before the poster reaches it (expected: about 80% faded by .1s, fully gone at .2s).

## 2. The fade ends with the growth

- [x] 2.1 In `DetailDrawer/index.scss`, add `transition-delay: .1s` to the `.movie-preview.open p, .show-preview.open .truncate` rule, with a one-line comment tying it to the poster's .3s transform. Verify `yarn build` succeeds and the suite passes.

## 3. In the browser

- [x] 3.1 Repeat 1.1 on a new build. Verify that for both the movie and the show, the title is still showing as the poster starts to grow and reaches opacity 0 at about .3s, as the poster reaches full size. Verify that a show's seasons line stays.
- [x] 3.2 Close each drawer, and switch from one open poster to another. Verify the title stays hidden until the poster has mostly moved off it, then fades in, and isn't drawn over the shrinking poster (pause the animations partway through and zoom in). With reduced motion emulated, verify the title hides and shows at once.

## Workflow follow-up

- Run `ponytail:ponytail-review` on the uncommitted diff and fix the findings you choose, test-first.
- Commit the code, then archive this change with spec sync as a second commit, `Archive title-fade-timing`, on the same branch, before opening the PR. A fix found after that goes on top as a new commit.
- After merging, publish a release tagged `vYYYY.MM.DD.N` to deploy it, and check myflix.stream.
