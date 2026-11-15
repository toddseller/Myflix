# Design

## Context

See proposal.md for why. Where Myflix names, orders and counts seasons today:

- **Drawer** (`DetailDrawer/ShowDetails.jsx`).
  - Sorts `show.seasons` by `a.season - b.season`, so season 0 comes first.
  - With no active season it opens on `seasons[0]`.
  - `SeasonLine` renders each button's text as the bare number.
  - `#counts` and `#series-count` use `seasons.length`, and `#series-count` reads `Season ${ season.season }` for a one-season show.
- **Tile** (`ShowPreview/index.jsx`). Builds its caption from MMDb's stored `seasonCount` and `seasonNumbers`. MMDb's change now stores those without season 0. For a show with only specials that leaves `seasonCount` "0" and `seasonNumbers` "", which today renders "Season " with nothing after it.
- **Search results** (`NewMediaPreview/index.jsx`). A show result reads `Season ${ media.season }`.
- **The value's type.** `season` is an integer in MMDb's database. The drawer test fixtures pass it as a string (`String(number)`), and the search fixtures pass a number. The arithmetic sort works with either.

## Goals / Non-Goals

**Goals:**
- One place decides whether a season is the specials.
- One place decides what a season is called.

**Non-Goals:**
- Any MMDb or API change.
- Changing the order of search results. They keep MMDb's order (`media-search`).

## Decisions

**A small `utils/seasons.js` with `isSpecials(season)` and `seasonName(season)`.**
- `isSpecials` is `Number(season) === 0`, so it holds whether the API sends a number or a string. A strict `=== 0` would pass one set of fixtures and fail on real data, or the other way round.
- `seasonName` gives "Specials" or "Season N". The drawer's one-season line, the tile and the search result use it.
- The drawer's buttons show the bare number for a regular season, so they use `isSpecials(n) ? 'Specials' : n` rather than `seasonName`.
- Putting the check inline in each of the three components was the alternative. That repeats the `Number(...)` reasoning three times, and nothing ties them together when one changes.

**Specials sort last by sorting on two keys.** The comparator compares `isSpecials` first and then the number: `isSpecials(a.season) - isSpecials(b.season) || a.season - b.season`. The default season then falls out of the sort: `seasons[0]` is the lowest regular season, and it's the specials only when the show has nothing else. That `seasons[0]` line needs no change.

**The drawer counts from `regular = seasons.filter(s => !isSpecials(s.season))`.**
- `#counts` reads `${ plural(regular.length, 'season') }, …`, or `Specials, …` when `regular` is empty.
- `#series-count` reads `plural(regular.length, 'season')` for two or more regular seasons, `seasonName(regular[0].season)` for one, and "Specials" for none. It names the one regular season, not the shown one, so it doesn't turn into "Specials" when the user picks the specials. For a show without specials this is the same as today.
- The episode count keeps summing every season.
- MMDb's model has the same split (`regular_seasons`), so the two apps count the same way.

**The tile adds one branch: an empty `seasonNumbers` reads "Specials".** Every other count already comes from MMDb without specials, so the existing three-way caption stays as it is.
- Keying on `seasonCount` 0 was tried first. The browser check showed four one-season shows (The Regime among them) that MMDb stores with `seasonCount` "0" and `seasonNumbers` "1". That stale count turned them into "Specials".
- MMDb sends empty season numbers only when there are no regular seasons to list, so that is the signal to use. The stale counts are MMDb's to fix.

## Risks / Trade-offs

- [The tile's caption depends on MMDb's stored counts] → If MMDb's migration hasn't run, MythBusters' tile keeps reading "15 Seasons" until it does. The drawer counts locally, so it is right either way.
- [Wider "Specials" button in the season line] → `ScrollRow`'s `placeOnActive` measures the button's real width, so placement still works. Check it in the browser on a long show with specials.
