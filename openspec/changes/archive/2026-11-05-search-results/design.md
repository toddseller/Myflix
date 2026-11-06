# Design

## Context

Found in the exploration, on myflix.stream:

- **The search:** `SearchBox` submits on the TV Shows tab through `startFetchSearchNewShows(query)`, which calls MMDb's `GET /api/v2/add_show?query=` (`Show.get_series`). For "nocturne" it returned 69 rows across 10 shows. Rows from MMDb's own database carry the season's `show_id`; rows from Apple and TMDB don't. MMDb sorts by year, then title, then season, so the collection's "Nocturne" (show id 1525, 2026) came last.
- **The store:** the results land in `state.newShows` (an object keyed by array index), `state.newEpisodes` after a season is picked, and `state.newMovies` for movies. `UserPage` reads them with `Object.values` and renders a `NewMediaPreview` card for each inside `.new-preview`, plus an "all episodes" card when a season has more than one episode.
- **The panel:** `.new-preview` is `display: flex`, 1560px at most, with no overflow handling. The 69 cards made a 15,444px row, and `.user-page { overflow-x: clip }` (from `detail-drawer`) cuts off everything past the window. Only 14 cards were on screen.
- **Centring:** few results get the `centered` class (`justify-content: center`).
- **Existing arrows:** `ShowDetails` has a `SeasonLine` that already does MMDb's arrow behaviour for the season buttons. Its arrows show from the scroll position on `scroll` and `resize`, an arrow click calls `scrollBy` with the visible width (`behavior: auto` under reduced motion), and a mount-time placement scrolls to the active season.
- **What the user typed** is also the grid's filter text (`state.filters.text`), since the search box filters as it's typed.

## Goals / Non-Goals

**Goals:**
- Every search result reachable, the collection's shows first in a show search, and one copy of the arrow logic.

**Non-Goals:**
- MMDb's own sort, movie result order, and episode order.
- Removing `.user-page`'s `overflow-x: clip`, which the full-width drawer needs.

## Decisions

### Ranking happens where `UserPage` reads the results
A small pure function, `rankShowResults(results, myShows, text)`, returns the results stably sorted into three groups:
1. rows whose `show_id` is a key of `state.shows` (the collection);
2. rows whose `title` equals the search text, trimmed and lower-cased;
3. the rest.

`Array.prototype.sort` is stable, so each group keeps MMDb's order. `mapStateToProps` applies it to `newShows` with `state.shows` and `state.filters.text`.
- Alternative: rank in the reducer. Rejected: the reducer doesn't have the collection or the text, and the store would stop holding what MMDb returned.
- Alternative: rank in MMDb. Rejected for this change: it lives in another repo with its own spec and releases.

### One scrolling row with arrows, shared
`SeasonLine`'s arrow logic moves into a `ScrollRow({ className, label, place, children })` component:
- **Structure:** a positioned wrapper holding a scrolling line (`overflow-x: auto`, hidden scrollbar, `scroll-padding-inline` of the arrow width) and two arrow buttons. The buttons are named `Earlier <label>` and `Later <label>`, with Font Awesome chevrons.
- **Arrows:** shown from the line's scroll position on `scroll` and window `resize`. A click scrolls one visible width, gliding unless reduced motion is on.
- **`place(line)`:** optional, called in its mount `useLayoutEffect` *before* it first measures the arrows. `SeasonLine` passes its active-season placement there. Placing must happen before measuring, and a child's layout effect runs before its parent's, so `SeasonLine` can't do it in its own effect.

`SeasonLine` becomes a `ScrollRow` with `label="seasons"`. The results panel wraps its cards in a `ScrollRow` with `label="results"`. The existing season-line tests must pass unchanged, which proves the extraction kept the behaviour.

### The panel's row
`.new-preview` keeps its size, position and transitions. Its cards now sit inside the `ScrollRow`'s line, which is a flex row like before. The "Searching our database..." spinner stays outside the row. With few results, the `centered` class still centres the cards, now by centring the line's content, which only applies while nothing overflows. The arrows take the panel's colours: the gradient from the page's black, since the panel sits on the page rather than in the drawer.

Two more fixes from the browser check, both needed for "every result can be reached":
- **Spinner or row, never both.** The panel renders either the "Searching our database..." spinner or the results row. With both, the empty row filled the panel and pushed the spinner from its centre to the left edge.
- **The panel stays within the page.** In three copies of its rules (`UserPage`, `MoviePreview`, `ShowPreview`), the panel was `width: 100vw` plus `margin-left: 5%`, so it always ran 5% past the right edge, where the page's clip cut off the last card (20px at 390px, 75px at 1500px). The width is now `100%` with `box-sizing: border-box`, and the indent is the same 5% as padding. Centred results drop it, as they dropped the margin. The panel's rules now live only in `UserPage/index.scss`, which renders it; the two tile stylesheets' copies are gone, so a fix can't be undone by a copy it missed. The panel is also centred (`margin-inline: auto`): at its 1560px maximum it sat at the left of wider windows, such as the user's 3360px one, while the header and grid sit in the middle.

### Tests
- **Unit tests for `rankShowResults`:** the "nocturne" case (the collection's row last becomes first), an exact title outside the collection beating looser matches, order kept within each group, and nothing to promote.
- **`UserPage` tests:** the panel renders the ranked order from the store.
- **`ScrollRow` tests,** with stubbed widths as `SeasonLine`'s tests do: arrows hidden when everything fits, only "Later" at the start, both in the middle, only "Earlier" at the end, scroll and resize updates, and the glide versus the jump.
- **Panel tests:** results, and a season's episodes, render inside the scrolling row with "results" arrows.
- **Browser:** the "nocturne" search shows "Nocturne" first, and the row scrolls to its last card at 1500px and 390px.

## Risks / Trade-offs

- [The search text is the grid filter, which the user may change after searching.] → The ranking reads it when the results render, which is right after the search. Exact title matching only reorders, so a changed text at worst changes which group a result falls in.
- [Seasons of a show in MMDb's database but not in this user's collection carry a `show_id` that isn't a key of `state.shows`.] → They aren't promoted to group 1, which is the intent: "already yours" means in this collection.
- [Moving `SeasonLine`'s logic could change the season line's behaviour.] → Its tests stay as they are and must pass.
