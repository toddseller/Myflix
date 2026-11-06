// Rows come from where tiles sit, so the drawer lands right at any width and with any filter.
// Drawers are stepped over: after a turned phone one can sit mid-row, hidden while the row is measured.
export const rowEnd = tile => {
  let end = tile
  for (let next = tile.nextElementSibling; next; next = next.nextElementSibling) {
    if (next.classList.contains('info')) continue
    if (next.offsetTop !== tile.offsetTop) break
    end = next
  }
  return end
}
