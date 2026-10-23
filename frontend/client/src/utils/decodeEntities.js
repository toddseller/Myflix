// DOMParser documents are inert (no scripts run, no images load), so this decodes entities without executing markup.
export const decodeEntities = text => new DOMParser().parseFromString(text || '', 'text/html').documentElement.textContent
