# Spec Delta

## Purpose

Defines how a movie's or show's details open, switch and close in a drawer under its poster in the Myflix collection grid, and what the drawer shows, matching MMDb's drawer.

## ADDED Requirements

### Requirement: The drawer opens under the clicked poster's row
Clicking a poster SHALL open its details in a drawer that spans the full width of the grid directly below the row holding that poster, once the details have loaded. The row SHALL be decided by where posters actually sit on the page, so the drawer is placed correctly at any window width and with any filter applied.

#### Scenario: Second row of a filtered list
- **WHEN** a filter hides some movies, and the user clicks the second visible movie of the second row
- **THEN** the drawer appears below the last visible movie of that row and above the first visible movie of the next

#### Scenario: Last, partly filled row
- **WHEN** the user clicks a poster in a last row that holds fewer posters than the others
- **THEN** the drawer appears below that row, at the end of the list

#### Scenario: Details fail to load
- **WHEN** the user clicks a poster and the details request fails
- **THEN** no drawer opens and the grid is unchanged

### Requirement: Only the last poster clicked opens
When the user clicks several posters before the first one's details have loaded, the drawer SHALL open only for the poster clicked last.

#### Scenario: Two quick clicks
- **WHEN** the user clicks movie A and then movie B before A's details arrive
- **THEN** the drawer shows movie B, even if A's details arrive after B's

### Requirement: The drawer eases open and closed to fit its content
The drawer SHALL grow from closed to the height of its content when it opens, and shrink back to closed when it closes, easing in both directions. Content that grows after opening, such as images loading, SHALL make the drawer grow with it.

#### Scenario: Opening
- **WHEN** a drawer opens
- **THEN** it is first shown closed, then grows to its content's height

#### Scenario: Closing by clicking the poster again
- **WHEN** the user clicks the poster of the open drawer
- **THEN** the drawer shrinks closed, and clicking the same poster then opens it again with one click

### Requirement: One drawer at a time
At most one drawer SHALL be open. Clicking another poster in the same row SHALL replace the open drawer's content in place, easing to the new height. Clicking a poster in another row SHALL close the old drawer while the new one opens.

#### Scenario: Same row
- **WHEN** a drawer is open and the user clicks another poster in the same row
- **THEN** the drawer stays open and shows the new poster's details

#### Scenario: Another row
- **WHEN** a drawer is open under row 1 and the user clicks a poster in row 3
- **THEN** the drawer under row 1 closes while one opens under row 3, and afterwards only the drawer under row 3 is on the page

### Requirement: Changing the list closes the drawer
Changing the filter text or switching between Movies and TV Shows SHALL close an open drawer at once.

#### Scenario: Typing a filter
- **WHEN** a drawer is open and the user types in the filter box
- **THEN** no drawer is open in the filtered grid

#### Scenario: Switching tabs
- **WHEN** a movie's drawer is open and the user switches to TV Shows
- **THEN** no drawer is open, and switching back to Movies shows no drawer either

### Requirement: Reduced motion is respected
When the user's system asks for reduced motion, the drawer SHALL open, switch and close without animating.

#### Scenario: Reduced motion
- **WHEN** reduced motion is requested and the user clicks a poster
- **THEN** the drawer appears open at once, and clicking the poster again removes it at once

### Requirement: The drawer's content fits the window
The drawer's content SHALL fit within the window at any width without the page scrolling sideways. Below the phone breakpoint, the poster SHALL sit above the details, no wider than the screen. On a window wider than the desktop layout, the content SHALL keep its desktop width, centred, while the drawer's background spans the window from edge to edge.

#### Scenario: Phone
- **WHEN** a user on a 390px wide window taps a poster
- **THEN** the drawer's poster is above its title, both within the screen, and the page does not scroll sideways

#### Scenario: Wide window
- **WHEN** a user on a 2560px wide window clicks a poster
- **THEN** the drawer's background reaches both edges of the window, and its details are no wider than on a 1500px window and are centred

### Requirement: A movie's drawer shows its details
A movie's drawer SHALL show its poster, title, runtime, year, genre, a badge for its rating (G, PG, PG-13, R, NC-17, NR or UNRATED), a 4K or HD badge when it has one, five stars marking its average user rating rounded to the nearest star, a line giving the number of ratings, its plot, its studio, and its cast and crew. Text SHALL be shown as text, with HTML entities decoded and never as markup.

#### Scenario: Rated movie
- **WHEN** the user opens a PG-13 movie in 1080p with ratings of 4 and 5 stars
- **THEN** the drawer shows the PG-13 badge, the HD badge, 5 stars marked out of 5, and "Based on 2 User Ratings"

#### Scenario: Unrated movie
- **WHEN** the user opens a movie with no ratings
- **THEN** no star is marked and the drawer says "This Movie Has Not Been Rated"

#### Scenario: One rating
- **WHEN** the user opens a movie with a single rating
- **THEN** the drawer says "Based on 1 User Rating"

#### Scenario: Title with markup
- **WHEN** a movie's title is `Fast &amp; Furious <b>X</b>`
- **THEN** the drawer's title reads `Fast & Furious X` as plain text, with no element made from the markup

### Requirement: A movie's cast and crew are listed by role
The drawer SHALL list a movie's actors under STARRING, its directors under DIRECTOR or DIRECTORS, its writers under SCREENWRITER or SCREENWRITERS, and its producers under PRODUCER or PRODUCERS, one name per line, using the plural heading when there is more than one name. A role with no names SHALL be left out, as SHALL the studio when there is none. A comma before "Jr." SHALL NOT split a name.

#### Scenario: Two directors
- **WHEN** a movie's director field is "Joel Coen, Ethan Coen"
- **THEN** the drawer lists both under DIRECTORS

#### Scenario: Name with Jr.
- **WHEN** a movie's actors are "Robert Downey, Jr., Gwyneth Paltrow"
- **THEN** STARRING lists "Robert Downey, Jr." and "Gwyneth Paltrow"

#### Scenario: Missing producer and studio
- **WHEN** a movie has no producer and no studio
- **THEN** the drawer shows no PRODUCER heading and no STUDIO section

### Requirement: A show's drawer shows its active season
A show's drawer SHALL open on the show's active season, or its lowest-numbered season when none is active. It SHALL show that season's poster and plot, the show's title, genre, year, a badge for its rating (TV-G, TV-PG, TV-14, TV-MA or NR), an HD badge when it is in 1080p, its total seasons and episodes, and a button for each season in season order with the shown season marked. Text SHALL be shown as text, with HTML entities decoded.

#### Scenario: Counts
- **WHEN** the user opens a show with 2 seasons and 1 episode in all
- **THEN** the drawer says "2 seasons, 1 episode"

#### Scenario: Single season
- **WHEN** the user opens a show that has only season 3
- **THEN** under the title the drawer says "Season 3"

#### Scenario: Several seasons
- **WHEN** the user opens a show with 4 seasons whose active season is 2
- **THEN** under the title the drawer says "4 seasons", it shows season 2's poster and plot, and the season 2 button is marked

### Requirement: A show's episodes are listed for the shown season
The drawer SHALL list the shown season's episodes in episode-number order, each with its number, air date, title, runtime and plot. A long plot SHALL be cut short with a "more" control that shows the whole plot and then reads "less", which cuts it short again.

#### Scenario: Episode order
- **WHEN** a season's episodes arrive as 3, 1, 2
- **THEN** the drawer lists episodes 1, 2, 3

#### Scenario: Reading a whole plot
- **WHEN** the user clicks "more" under an episode's plot
- **THEN** the whole plot shows, and the control reads "less"

#### Scenario: Cutting a plot short again
- **WHEN** the user clicks "less" under a whole plot
- **THEN** the plot is cut short again, and the control reads "more"

#### Scenario: Episode without a plot
- **WHEN** an episode has no plot
- **THEN** no "more" control shows for it

### Requirement: Choosing a season shows it without reloading
Clicking a season's button SHALL show that season's poster, plot and episodes in the open drawer and mark its button, without another request to MMDb, easing to the new height.

#### Scenario: Switching seasons
- **WHEN** a show's drawer is open on season 1 and the user clicks season 2
- **THEN** the drawer shows season 2's poster, plot and episodes, the season 2 button is marked, and no request is made

### Requirement: The grid tile is unchanged after its details load
Loading a title's details for the drawer SHALL NOT change what its poster tile in the grid shows.

#### Scenario: Show tile label
- **WHEN** the user opens a show whose tile reads "Seasons 1, 2"
- **THEN** the tile still reads "Seasons 1, 2"
