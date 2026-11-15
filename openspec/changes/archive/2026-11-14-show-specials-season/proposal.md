# Proposal

## Why

MMDb now stores a season 0 for a show's specials (MythBusters has one since its move to TMDB), and MMDb itself names it "Specials", lists it last and leaves it out of season counts (its `show-specials-season` change). Myflix reads the raw season rows, so its drawer shows a "0" button first, counts specials as a season, and opens on the specials when no season is active.

## What Changes

- In a show's drawer, season 0's button reads "Specials" and comes after the last regular season.
- The drawer's season counts leave specials out; its episode count still includes their episodes. A show with only specials reads "Specials" where a season is named.
- With no active season, the drawer opens on the first regular season, not the specials.
- A grid tile for a show with only specials reads "Specials". Other tiles need no change: MMDb already leaves season 0 out of the `seasonNumbers` and `seasonCount` it sends.
- In the add-show search results, a stored season 0 reads "Specials" in place of "Season 0".

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `detail-drawer`: a show's specials are named "Specials", placed last, left out of the season counts, and not opened on by default; a tile for a show with only specials reads "Specials".
- `media-search`: a specials season in the show search results is labelled "Specials".

## Impact

- `frontend/client/src/components/DetailDrawer/ShowDetails.jsx` (order, button label, counts, default season), `ShowPreview/index.jsx` (tile caption), `NewMediaPreview/index.jsx` (search result label), and their tests.
- No API or server change. The tile relies on MMDb's change having recomputed the stored `seasonNumbers` and `seasonCount`; until it is deployed, a show with specials keeps its old tile caption.
