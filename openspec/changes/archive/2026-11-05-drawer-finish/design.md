# Design

## Context

- `UserPage` keeps `{ drawer, closing }` state and renders each tile as a connected `MoviePreview` or `ShowPreview` (`div.movie-preview` / `div.show-preview` holding an `img`, a `.truncate` title and, for shows, a `.seasons` line). Tiles have no transforms or transitions today, and nothing clips them.
- `MovieDetails` and `ShowDetails` render the drawer's poster as a plain `img` with `width: 340px` / `447px` and `max-width: 100%`, so its box has no height until the image loads.
- `ShowDetails` renders the season buttons straight inside `.season-row`, which scrolls sideways with no arrows, and keeps the picked season in local state. A season switch re-renders the same elements, so the row's scroll position already survives it.
- `Episode` shows "more" whenever a plot exists. The plot is cut short by CSS: `nowrap` and an ellipsis from 1200px up, and a 3-line clamp below.
- `utils/motion.js` already knows whether reduced motion is asked for (`reduced()`, not exported yet).
- MMDb's versions: `drawer.css` and `movies.css` for the open poster, pointer and poster box; `drawer.js` `placehold()` for the placeholder; `season-row.js` and `scroll-arrows.js` for the season line; `credits.js` `fitToggles()` for "more".

## Goals / Non-Goals

**Goals:**
- MMDb's behaviour for the requirements in this change's delta spec, in React, in Myflix's colours.

**Non-Goals:**
- MMDb's fading of the season arrows: they show and hide at once. The spec doesn't ask for a fade, and it would need a fade helper Myflix doesn't have.
- Anything that scrolls the page (that is `drawer-scroll`).

## Decisions

### The open tile is told by prop, and draws its own pointer
`UserPage` passes `open={ drawer?.id === item.id }` to each tile. The closing drawer's tile gets `false`, so it shrinks back while its drawer closes. The tile adds an `open` class and always renders an empty `.pointer` element, so the pointer can fade in like MMDb's. Only the tile whose prop changes re-renders, since the tiles are connected components.

The styles are MMDb's, adjusted to Myflix's tile sizes:
- The image gets `transform: translateY(-10px) scale(1.115)` from its top centre, eased over .3s.
- A movie's title fades to `opacity: 0`; a show's title fades too, while its seasons line stays in place. MMDb leaves a show's title showing under the poster's edge, but Myflix's title sits closer under its image, so the enlarged poster would leave only a sliver of it.
- The drawer's open top margin shrinks so the pointer sits as far under the poster as MMDb's: Myflix's tiles leave about 20px more below the title, plus an 8px row gap, that MMDb's don't.
- The pointer is a 15px square turned 45 degrees, in the drawer's `#090909` with a faint top and left edge, fading in after .15s.

The rules live once in `DetailDrawer/index.scss` for both tiles, and the drawer's colour variables move from `.info` up to `.user-page`, so the pointer can use the drawer's `--surface` and `--faint`. A transform doesn't change layout, so the neighbours stay put. The pointer's exact offset depends on Myflix's tile heights (303px for movies) and the drawer's 20px top margin, so it is set in the browser.
- Alternative: an `open` class added from `UserPage` through the DOM, as MMDb does. Rejected: in React the class would be lost on the tile's next render.

### The poster box is CSS only
The drawer's poster `img` gets `display: block`, `aspect-ratio: 2 / 3` (movie) or `1` (show) and `object-fit: contain`, keeping its current widths. The box then has its full height before the image arrives, and a poster of another shape shows whole and centred.

### One `Poster` component holds the placeholder
A small `Poster({ src, placeholder, alt })` renders the `img` with the placeholder as its CSS background (`url(${ JSON.stringify(placeholder) })`, quoted so a stored URL can't end the value early). It drops the background on `load`.
- It is keyed by `src`, so a new image starts with its placeholder again.
- With no `src` it gets no placeholder, as in MMDb: an image that never loads would keep showing someone else's picture.

Placeholders:
- **Movies:** the grid tile's poster, `movie.poster`, since the tile and the drawer use the same field.
- **Shows:** the grid tile's `show.poster` when the drawer opens on a show. After a season switch it's the previous season's poster, held in `ShowDetails` state next to the picked season. A season with no poster gets none, so its box shows the background colour.

### The season line scrolls inside its row, with two arrow buttons
`.season-row` becomes a positioned wrapper holding:
- `.season-line`: the buttons, `overflow-x: auto` with its scrollbar hidden, and `scroll-padding-inline: 34px` so a focused button clears the arrows.
- Two `<button type="button">` arrows labelled "Earlier seasons" and "Later seasons", with Font Awesome chevrons.

`ShowDetails` keeps `{ left, right }` arrow visibility in state, recomputed from the line's `scrollLeft`, `clientWidth` and `scrollWidth`:
- on the line's `scroll` event, which covers arrows, swipes, trackpads and Tab;
- on window `resize`;
- right after placing the line.

An arrow click calls `scrollBy({ left: ±clientWidth, behavior })`, with `behavior` set to `'auto'` when `reduced()` is true and `'smooth'` otherwise.

`UserPage` mounts `ShowDetails` with `key={ show.id }`, so each show starts fresh: on its active season, with the grid poster as its placeholder, even when the drawer swaps back to a show it showed before. Placing the line follows MMDb's `placeSeasons`. In a `useLayoutEffect` that runs once on mount, so before the drawer paints, set `scrollLeft` to `min(max(0, active.offsetLeft + active.offsetWidth + 34 - clientWidth), scrollWidth - clientWidth)`. A season switch doesn't remount, so the line stays put. A same-row swap to another show mounts a new `ShowDetails`, so it's placed afresh.

### "More" only when the plot is cut
Each `Episode` measures its plot in a `useLayoutEffect`, and again on window `resize`: a plot is cut if `scrollWidth > clientWidth || scrollHeight > clientHeight`. A whole plot (after "more") is never re-measured, so "less" stays. The resize listener is one per episode. A season's episodes are a few dozen at most, and a shared listener would add plumbing for no gain.

### Tests
jsdom has no layout, so the tests stub `offsetLeft`, `offsetWidth`, `clientWidth`, `scrollWidth`, `scrollHeight` and `clientHeight`, as `UserPage`'s tests already stub `offsetTop`. A test can't check that the poster really grows, or where the pointer lands, so those are checked in the browser.

## Risks / Trade-offs

- [The enlarged poster may crowd its neighbour on a phone, where rows hold two tiles.] → Check at 390px in the browser. If it overlaps, reduce the scale below 768px. That would be a CSS detail; the spec doesn't change.
- [The pointer must meet the drawer's faint top edge without a visible seam.] → Set the offset and edge colours in the browser against the real drawer.
- [Episodes measured before fonts load could miss a cut plot.] → The resize re-measure won't catch a late font. If that happens, re-measure once on `document.fonts.ready`.
- [The tiles' tests (`ShowPreview/index.test.jsx`) render without the new prop.] → `open` defaults to false, so existing tests are unaffected.

## Open Questions

- The pointer's exact offset and the scale on phones are settled in the browser, as above. Neither changes the specs or the tasks.
