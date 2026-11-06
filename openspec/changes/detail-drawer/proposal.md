# Proposal

## Why

Clicking a movie or show in the Myflix collection fetches its details from MMDb and then only writes them to the browser console, so there is no way to see a title's details. MMDb shows them in a drawer that opens under the clicked poster's row; Myflix should do the same so both apps work alike.

## What Changes

- Clicking a poster in the Movies or TV Shows grid opens a full-width drawer directly under that poster's row, with the title's details.
- One drawer at a time: clicking the open poster closes it, another poster in the same row replaces its content in place, and a poster in another row closes the old drawer while the new one opens.
- The drawer eases open, closed and between heights, and appears without animating when the system asks for reduced motion.
- Movie details: poster, title, runtime, year, genre, rating and HD badges, average stars with the rating count, plot, cast and crew, and studio.
- Show details: the active season's poster and plot, show title, season and episode counts, genre, year, rating and HD badges, a button per season, and that season's episodes. Choosing a season shows it without another request.
- The drawer spans the window from edge to edge, as in MMDb, and its content fits the window: on a phone the poster sits above the details, and on a wide window the details keep their desktop width, centred.
- Changing the filter text or switching between Movies and TV Shows closes an open drawer.
- The layout and motion are ported from MMDb's drawer (its `drawer.css` rules and its movie and show markup), in Myflix's colours: white text, Myflix red (`#e50914`) for the active season and "more", and a `#090909` panel with a faint white edge against the black page.
- The `console.log` calls on the click path are removed.
- Fetching a title's details no longer wipes its grid tile's season label.

Out of scope, for later changes: the enlarged open poster and its pointer, gliding the page to bring the drawer into view and holding the clicked poster still when the drawer moves rows, a placeholder poster while loading, re-placing the drawer when a phone is turned, season-line arrows, virtualizing large grids, owner edit, and keeping the drawer open while episodes are added. No backend changes.

## Capabilities

### New Capabilities
- `detail-drawer`: how a movie's or show's details open, switch and close in a drawer under its poster in the collection grid, and what the drawer shows.

### Modified Capabilities

None. Myflix has no specs yet.

## Impact

- `frontend/client/src/components/UserPage/index.jsx`: click handling and drawer placement replace the console logs.
- New drawer components and styles under `frontend/client/src/components/`.
- `frontend/client/src/actions/userMovie.js`, `userShow.js`: remove `console.log`; return the fetched record.
- `frontend/client/src/reducers/userShowReducer.js`, `userMovieReducer.js`: merge fetched details into the list entry instead of replacing it.
- Uses the existing MMDb endpoints `GET /api/v2/movies/:id` and `GET /api/v2/shows/:id`. No new dependencies.
