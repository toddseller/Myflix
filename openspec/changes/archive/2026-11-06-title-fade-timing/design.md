# Design

## Context

The motion is all CSS, in `frontend/client/src/components/DetailDrawer/index.scss`:

- The open poster's `transform` (lift and 1.115 scale, from its top) runs over `.3s ease-in-out`.
- The title (`.movie-preview p`, `.show-preview .truncate`) runs `opacity .2s`, with the default `ease` curve and no delay.

The movie poster's bottom edge moves from about 261px down to about 281px. The title sits at about 263 to 285px, so the poster only reaches it after roughly a third of its growth. By that point the title is already mostly faded (see proposal.md, Why).

## Goals / Non-Goals

**Goals:**
- The opening fade ends when the poster's transform ends.
- On closing, the title doesn't show over the shrinking poster.

**Non-Goals:**
- Changing the poster's growth, the pointer's fade, or the drawer's timing.
- Changing the poster's shrink or the reduced-motion behaviour.

## Decisions

### Delay the fade by .1s rather than holding it until the poster is full size

A .1s delay plus the existing .2s fade ends at .3s, the same moment the transform ends.

The alternative was to fade only after the poster reaches full size (a .3s delay). That was rejected because the title runs a few pixels past the enlarged poster's bottom edge. For an extra .2s that strip would show as a sliver under the grown poster, which is exactly what the fade exists to prevent.

The duration and curve stay as they are. An `ease-in` fade would follow the covering a little more closely, but it isn't needed to fix what's visible.

### A separate delay for each direction

A CSS transition takes its timing from the state being entered. So the `.open` rule's delay governs opening, and the base rule's delay governs closing. The pointer already uses this pattern (`.open > .pointer { transition-delay: .15s }`).

- **Opening:** .1s on `.movie-preview.open p, .show-preview.open .truncate`.
- **Closing:** .15s on the base rule (`.movie-preview p, .show-preview .truncate`).

The closing delay is needed because a title with opacity below 1 is drawn as its own layer. That layer comes after the poster in the page, so the browser draws it on top of the transformed, shrinking poster. In the browser, 80ms into a close the title was drawn over the poster's lower edge. With .15s, the title stays at opacity 0 until the poster covers only about 4px of it, and the poster has left it by about .2s.

The alternative was to keep the poster on top while it shrinks: hold its `z-index` for .3s after closing, as the tile's `content-visibility` already does. That would let the title fade in at once, underneath the poster, but it puts `position: relative` on every poster in the grid. It was rejected as more change than the problem needs.

The reduced-motion block already sets `transition: none` on these elements and outranks both delays, so reduced motion is unaffected.

## Risks / Trade-offs

- **[Risk]** jsdom doesn't run CSS transitions, so no unit test can catch the timing. → It's checked by eye in the browser, opening and closing a movie and a show, which tasks.md lists.
- **[Trade-off]** Both delays are tied to the transform's .3s. → The comments on the rules name that link, so a later change to the poster's duration knows to move the delays with it.
- **[Trade-off]** On closing, the title now comes back about .15s later than before. → That is the point: before, it showed on top of the poster in that time.
