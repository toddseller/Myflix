## REMOVED Requirements

### Requirement: Clicking a poster closes the search results
**Reason**: Myflix's search text is also the grid's filter, so the results and the grid beneath them usually show the same few titles, and opening a drawer to compare them shouldn't throw the results away. The results panel now has its own dismiss button and Escape, which take over unpinning the grid.
**Migration**: Opening a drawer keeps the search results (see `media-search`, "Opening a drawer keeps the search results"). To scroll a pinned grid, dismiss the results with the button or Escape.
