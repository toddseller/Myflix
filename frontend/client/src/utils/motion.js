// The longest drawer transition (.35s) plus slack, for when no transitionend arrives.
const DRAWER_MS = 450

export const reduced = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

// Runs done once, when el's transition on property ends, or after DRAWER_MS if none runs. Returns a cancel.
export const afterTransition = (el, property, done) => {
  if (reduced()) {
    done()
    return () => {}
  }
  const onEnd = event => { if (event.target === el && event.propertyName === property) finish() }
  const cancel = () => {
    el.removeEventListener('transitionend', onEnd)
    clearTimeout(timer)
  }
  const finish = () => {
    cancel()
    done()
  }
  el.addEventListener('transitionend', onEnd)
  const timer = setTimeout(finish, DRAWER_MS)
  return cancel
}

// update must change the DOM before it returns (flushSync), so the new height can be read straight after.
// Returns that height, which the content is still easing towards, for reveal to aim at.
export const easeHeight = (wrapper, update) => {
  if (!wrapper) return update()
  const from = wrapper.offsetHeight
  wrapper.style.height = `${ from }px`
  update()
  const to = wrapper.scrollHeight
  if (to === from || reduced()) {
    wrapper.style.height = ''
    return to
  }
  void wrapper.offsetHeight
  wrapper.style.height = `${ to }px`
  afterTransition(wrapper, 'height', () => { wrapper.style.height = '' })
  return to
}

// .info.open's margin-top in DetailDrawer/index.scss (-.5rem), which a drawer still easing open has yet to reach.
const OPEN_MARGIN = -8

// Glides the page just far enough that the drawer's bottom, once eased, clears the pinned count bar, never taking
// its poster under the pinned tabs bar. Only a drawer being opened may glide up to its poster: anything else could
// pull someone reading partway down a tall drawer back to the top.
export const reveal = (drawer, { up = false, height } = {}) => {
  // The drawer may have gone, as when the list redraws during a hold.
  const tile = drawer.parentElement?.querySelector(':scope > .open')
  if (!tile) return
  const wrapper = drawer.querySelector('.info-wrapper')
  const margin = parseFloat(getComputedStyle(drawer).marginTop) || 0
  const bottom = wrapper.getBoundingClientRect().top + (height ?? wrapper.scrollHeight) + OPEN_MARGIN - margin
  const top = tile.getBoundingClientRect().top - (document.querySelector('.mf-tabs--default')?.getBoundingClientRect().bottom ?? 0)
  const floor = document.querySelector('.movie-count')?.getBoundingClientRect().top ?? window.innerHeight
  const by = top < 0 ? (up ? top : 0) : Math.max(0, Math.min(bottom - floor, top))
  if (by) window.scrollBy({ top: by, behavior: reduced() ? 'auto' : 'smooth' })
}

// A drawer closing above the clicked row pulls the row up as it shrinks; scrolling by the same amount each frame
// keeps the poster still until the drawer has closed.
export const holdStill = (tile, top, done) => {
  const until = Date.now() + DRAWER_MS
  const step = () => {
    const moved = tile.getBoundingClientRect().top - top
    if (moved) window.scrollBy(0, moved)
    if (Date.now() < until) requestAnimationFrame(step)
    else done()
  }
  requestAnimationFrame(step)
}
