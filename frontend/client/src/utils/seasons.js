// TMDB numbers a show's specials as season 0; the number arrives as a number or a string.
export const isSpecials = season => Number(season) === 0

export const seasonName = season => isSpecials(season) ? 'Specials' : `Season ${ season }`
