# Design

## Context

- **The enlarge:** `.movie-preview.open img` and `.show-preview.open img` get `translateY(-10px) scale(1.115)` from the top centre (`DetailDrawer/index.scss`), copied from MMDb's `drawer.css`. The image's top ends 10px above its tile.
- **Tiles:** each grid tile has `content-visibility: auto`. The open tile already switches to `visible`, because content-visibility clips an element's content to its box.
- **Blocks:** each 420-tile block (`.grid-block`, from `grid-performance`) also has `content-visibility: auto`, and nothing switches it off. Blocks span the page's width, so only the top is affected: on myflix.stream the open "Nocturne" image's top was at 130px and its block's at 140px, so 10px were cut off. Setting the block to `visible` in the browser showed the whole poster.

## Goals / Non-Goals

**Goals:**
- MMDb's enlarged poster, uncut, without giving up the block skipping that keeps large collections smooth.

**Non-Goals:**
- Changing the enlarge itself (its size, lift or timing).

## Decisions

### The block holding the open poster doesn't clip
```scss
.grid-block:has(> .open) { content-visibility: visible; }
```
Placed beside the open tile's own `visible` rule, with the same reason.
- **Speed:** a block is only skipped while off screen, and the block with the open poster is on screen, so nothing that was skipped stops being skipped. Its tiles keep their own `content-visibility: auto`, so tiles far from the screen inside it are still skipped one by one.
- **Closing:** the poster loses `.open` as its drawer starts closing, but its image takes .3s to shrink back. Switching the tile and block back to `auto` at that moment clips the shrinking image to the tile's box, so the frame snaps back before the artwork does. So the switch back is held until the shrink ends: `transition: content-visibility 0s .3s allow-discrete` on the tile and block, and `transition: none` on the open ones so opening switches at once. `content-visibility` animates as a discrete value, so a zero-length transition after a .3s delay flips it exactly when the image's transform transition ends. In a browser without discrete transitions it flips at once, as today.
- **Alternative: drop the 10px lift.** Rejected: it moves away from MMDb's look.
- **Alternative: give each block top padding of 10px.** Rejected: it changes the gaps between blocks, which the `detail-drawer` spec requires to look the same however tiles are grouped.
- **Alternative: `overflow-clip-margin: 10px` on blocks.** Not chosen: it ties the blocks to the size of the lift, and whether browsers apply it to the clipping that content-visibility adds is unverified here.

### Tests
There's no unit test, since jsdom applies no stylesheets and draws nothing. The check is in the browser, at the full 3360px window: the open poster's top against its block's top, and the poster's picture by eye.

## Risks / Trade-offs

- [`:has()` needs Chrome 105, Safari 15.4 or Firefox 121.] → All current browsers have it. In an older one, the poster stays clipped as it is today.
- [The .3s hold must match the image's transform transition, which is also .3s.] → Both live in `DetailDrawer/index.scss`, a few lines apart.

## Migration Plan

Deploy to onyx as before, tagging `myflix-nginx:before-poster-unclipped` for a rollback.
