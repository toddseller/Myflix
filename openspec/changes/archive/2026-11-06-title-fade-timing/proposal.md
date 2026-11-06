# Proposal

## Why

When a poster's drawer opens, the title under the poster fades out before the enlarging poster reaches it. The fade takes .2s with no delay, and its default `ease` curve does most of the fading early. The poster grows over .3s on an ease-in-out curve, so it only reaches the title near the end of its growth. As a result, the title has disappeared before anything covers it, and the reason it fades (it is about to be hidden under the poster) doesn't read on screen.

## What Changes

- On opening, the title's fade starts later, so it ends at the moment the poster finishes enlarging rather than before the poster reaches it. This applies to a movie's title and a show's title. A show's seasons line is still never faded.
- On closing, the title waits until the shrinking poster has mostly moved off it before fading back in. Today it starts fading in at once, and while it's partly faded the browser draws it on top of the still-large poster.
- Reduced motion is unchanged: the title is hidden and shown at once.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `detail-drawer`: the requirement "The open poster is marked without moving its neighbours" now says when the title hides on opening: its fade finishes as the poster finishes enlarging.

## Impact

- `frontend/client/src/components/DetailDrawer/index.scss`: the open tile's title rule gets a transition delay. Nothing else changes, and no JavaScript, API or dependency is affected.
