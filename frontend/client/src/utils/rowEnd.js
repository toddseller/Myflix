// Rows come from where tiles sit, so the drawer lands right at any width and with any filter.
export const rowEnd = tile => {
  let end = tile
  while (end.nextElementSibling?.offsetTop === tile.offsetTop) end = end.nextElementSibling
  return end
}
