// The longest drawer transition (.35s) plus slack, for when no transitionend arrives.
const DRAWER_MS = 450

const reduced = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

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
export const easeHeight = (wrapper, update) => {
  if (!wrapper) return update()
  const from = wrapper.offsetHeight
  wrapper.style.height = `${ from }px`
  update()
  const to = wrapper.scrollHeight
  if (to === from || reduced()) {
    wrapper.style.height = ''
    return
  }
  void wrapper.offsetHeight
  wrapper.style.height = `${ to }px`
  afterTransition(wrapper, 'height', () => { wrapper.style.height = '' })
}
