# detail-drawer Specification

## Purpose

Defines how a movie's or show's details open, switch and close in a drawer under its poster in the Myflix collection grid, and what the drawer shows, matching MMDb's drawer.

## Requirements

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
The drawer SHALL list the shown season's episodes in episode-number order, each with its number, air date, title, runtime and plot. A plot that does not fit SHALL be cut short with a "more" control that shows the whole plot and then reads "less", which cuts it short again. A plot that fits at the current window width SHALL show no control, and SHALL gain one if the window narrows until it no longer fits.

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

#### Scenario: A plot that fits
- **WHEN** an episode's plot fits on its line at the current window width
- **THEN** no "more" control shows for it

#### Scenario: The window narrows
- **WHEN** an episode's plot fits, and the window then narrows until it is cut short
- **THEN** a "more" control appears for it

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

### Requirement: The open poster is marked without moving its neighbours
The poster whose drawer is open SHALL appear enlarged and lifted, with a pointer below it leading into the drawer, and the other posters SHALL keep their positions. While it is open, a movie's title SHALL be hidden, since the enlarged poster covers it, and a show's title SHALL be hidden while its seasons line stays in place under the enlarged poster. A poster whose drawer is closing SHALL return to its normal size.

#### Scenario: Poster enlarged
- **WHEN** a movie's drawer is open
- **THEN** that poster is shown larger with the pointer under it, its title is hidden, and its neighbours have not moved

#### Scenario: A show's text stays
- **WHEN** a show's drawer is open
- **THEN** its poster is shown larger, its title is hidden, and its seasons line still shows below the poster

#### Scenario: Another poster opened
- **WHEN** a drawer is open and the user clicks another poster
- **THEN** the new poster is enlarged with the pointer, and the first poster is back to its normal size with its title showing

#### Scenario: Reduced motion
- **WHEN** reduced motion is requested and the user clicks a poster
- **THEN** the poster is enlarged at once, without easing

### Requirement: The drawer sits close under the open poster
The pointer SHALL sit as close under the open poster as in MMDb, so the drawer reads as part of the poster's row rather than a separate block below it.

#### Scenario: A movie's drawer
- **WHEN** a movie's drawer is open
- **THEN** the drawer's top edge, where the pointer sits, is no more than about 25px below the enlarged poster

#### Scenario: A show's drawer
- **WHEN** a show's drawer is open
- **THEN** the drawer's top edge sits just below the show's title and seasons, with no empty lines between them

### Requirement: The drawer's poster holds its size while it loads
The drawer's poster SHALL take its full size before its image arrives, so nothing in the drawer moves when it loads. A movie's poster SHALL be 2:3 and a show's square, at the width each has at that window size. A show poster of another shape SHALL fit whole inside the square, centred, without being stretched or cropped.

#### Scenario: Movie on desktop
- **WHEN** a user on a 1500px wide window opens a movie whose poster has not loaded yet
- **THEN** the drawer's poster is already 340x510

#### Scenario: Show on desktop
- **WHEN** a user on a 1500px wide window opens a show whose poster has not loaded yet
- **THEN** the drawer's poster is already 447x447

#### Scenario: Phone
- **WHEN** a user on a 390px wide window opens a movie or a show whose poster has not loaded yet
- **THEN** the title starts below the poster's full 2:3 or square box, and stays there when the poster loads

#### Scenario: A portrait show poster
- **WHEN** a user on a 1500px wide window opens a show whose season poster is 2:3
- **THEN** the poster stays 447x447 and the whole image shows in it, centred

### Requirement: The drawer's poster shows the image already on screen while it loads
Until its own image has loaded, the drawer's poster SHALL show the image the user was just looking at: the grid poster that was clicked when the drawer opens or switches to another title, or the previous season's poster when the user switches seasons. Where there is no such image, the box SHALL show the drawer's background colour. Once the poster has loaded, only the poster SHALL show.

#### Scenario: Opening a drawer
- **WHEN** a user clicks a grid poster and the drawer's poster has not loaded yet
- **THEN** the drawer's poster box shows the grid poster that was clicked

#### Scenario: Another title in the same row
- **WHEN** a drawer is open and the user clicks another poster in the same row before its poster has loaded
- **THEN** the drawer's poster box shows the newly clicked grid poster

#### Scenario: Switching seasons
- **WHEN** the user switches a show's drawer to another season whose poster has not loaded yet
- **THEN** the drawer's poster box shows the previous season's poster until the new one loads

#### Scenario: A season with no poster
- **WHEN** the user switches a show's drawer to a season that has no poster
- **THEN** the drawer's poster box shows the drawer's background colour, not the previous season's poster

#### Scenario: Poster loaded
- **WHEN** the drawer's poster has loaded and is a different shape from its box
- **THEN** no placeholder image shows around it

### Requirement: A show's seasons stay on one line
A show's season buttons SHALL sit on a single line that never wraps. When they don't all fit across the drawer, the line SHALL scroll sideways, including by a finger swipe or trackpad. When they all fit, the line SHALL show no arrows.

#### Scenario: A long-running show
- **WHEN** a user opens a show with 48 seasons in a 1500px wide window
- **THEN** all 48 season buttons are on one line, and the seasons that don't fit are reached by scrolling the line

#### Scenario: A show whose seasons fit
- **WHEN** a user opens a show with 3 seasons
- **THEN** its season buttons are on one line and no arrows show

### Requirement: Arrows scroll the season line
Each arrow SHALL scroll the season line by its visible width, gliding unless the system asks for reduced motion, when it SHALL jump. The left arrow SHALL show only while the line is scrolled past its start, and the right arrow only while seasons are hidden past its end, however the line was scrolled. Each arrow SHALL be a button named for screen readers: "Earlier seasons" and "Later seasons".

#### Scenario: Scrolling from the start
- **WHEN** a show's season line is at its start and more seasons are hidden to the right
- **THEN** only the right arrow shows; clicking it glides the line one visible width and shows the left arrow

#### Scenario: Reaching the end
- **WHEN** the season line is scrolled to its end
- **THEN** the right arrow hides and the left arrow shows

#### Scenario: Swiping the line
- **WHEN** the user scrolls the season line by trackpad or swipe away from its start
- **THEN** the left arrow shows

#### Scenario: Reduced motion
- **WHEN** a user whose system asks for reduced motion clicks an arrow
- **THEN** the line moves one visible width at once, without gliding

### Requirement: The season line opens on the active season
When a show's drawer opens, or an open drawer moves to another show, the season line SHALL already be placed so the shown season is fully in view, clear of the right arrow, with no visible scrolling. A shown season that fits from the start SHALL leave the line at its start.

#### Scenario: Active season at the end
- **WHEN** a user opens a 48-season show whose active season is 48
- **THEN** season 48 is in view at the end of the line, the left arrow shows and the right arrow doesn't

#### Scenario: Active season near the start
- **WHEN** a user opens a 48-season show whose active season is 3
- **THEN** the line is at its start, and only the right arrow shows

#### Scenario: Moving the drawer to another long show
- **WHEN** a show's drawer is open and the user clicks another show in the same row whose active season is its last
- **THEN** the drawer shows that show with its last season in view

### Requirement: The season line stays put when the user switches seasons
When the user switches seasons in a show's drawer, the season line SHALL keep the scroll position it had, so nothing in it moves.

#### Scenario: Switching to a season in the middle
- **WHEN** the season line is scrolled to show seasons 19 to 35 and the user clicks season 20
- **THEN** the drawer shows season 20, and the line still shows seasons 19 to 35

### Requirement: The drawer glides into view
When a drawer opens, swaps to another poster in its row, or grows from a season switch, the page SHALL glide just far enough that the drawer's bottom is above the count bar pinned to the bottom of the screen, without moving the open poster's row under the tabs bar pinned to the top. Only opening a drawer MAY glide the page up.

#### Scenario: A poster near the bottom of the screen
- **WHEN** the user clicks a poster whose row is near the bottom of the screen, and its drawer fits on screen below that row
- **THEN** the page glides until the whole drawer is above the count bar, and the poster stays in view

#### Scenario: A drawer taller than the screen
- **WHEN** the user opens a drawer that, with its row, is taller than the space between the tabs bar and the count bar
- **THEN** the page glides until the poster's row sits just below the tabs bar, with the start of the drawer below it

#### Scenario: A drawer already in view
- **WHEN** the user opens a drawer that already fits entirely on screen
- **THEN** the page does not move

#### Scenario: A poster partly under the tabs bar
- **WHEN** the user clicks a poster that is partly hidden under the tabs bar
- **THEN** the page glides up until the poster's row sits just below the tabs bar

#### Scenario: A season switch makes the drawer taller
- **WHEN** a show's drawer is in view, and switching its season makes it end below the count bar
- **THEN** the page glides down until the drawer's bottom is above the count bar, without moving the show's row under the tabs bar

#### Scenario: Reading partway down a tall drawer
- **WHEN** the user has scrolled partway down a drawer taller than the screen and switches seasons
- **THEN** the page does not glide back up to the poster's row

#### Scenario: Reduced motion
- **WHEN** the user's system asks for reduced motion, and a drawer opens near the bottom of the screen
- **THEN** the page moves to the same place at once, without gliding

### Requirement: The clicked poster holds still when the drawer moves rows
When a drawer is open and the user clicks a poster in another row, the clicked poster SHALL stay where it was on screen while the old drawer closes, as far as the page can scroll. The new drawer SHALL then glide into view.

#### Scenario: The old drawer is above the clicked row
- **WHEN** a drawer is open under row 1 and the user clicks a poster in row 3
- **THEN** the clicked poster does not move on screen while the drawer under row 1 closes, and then the page glides the new drawer into view

#### Scenario: The old drawer is below the clicked row
- **WHEN** a drawer is open under row 3 and the user clicks a poster in row 1
- **THEN** the clicked poster does not move on screen while the drawer under row 3 closes

### Requirement: Growth inside the drawer leaves the page still
Height changes the user makes while reading inside an open drawer, such as expanding or collapsing an episode's plot, SHALL NOT move the page.

#### Scenario: Expanding a plot
- **WHEN** the user clicks "more" on an episode's plot and the drawer grows below the count bar
- **THEN** the page does not move

### Requirement: The drawer follows a turned phone
When the window's width changes while a drawer is open, the drawer SHALL move to directly below the open poster's row as it now falls, so no row is split or left short, without closing and reopening. When only the window's height changes, as when a phone browser's address bar grows or shrinks during a scroll, the drawer SHALL stay where it is.

#### Scenario: Portrait to landscape
- **WHEN** a drawer is open on a 390x844 window and the window turns to 926x428
- **THEN** the open poster's row is full and the drawer sits directly below it

#### Scenario: Landscape to portrait
- **WHEN** a drawer is open on a 926x428 window and the window turns to 390x844
- **THEN** the open poster's row is full and the drawer sits directly below it

#### Scenario: Only the height changes
- **WHEN** a drawer is open and the window's height changes but not its width
- **THEN** the drawer stays where it is

### Requirement: Clicking a poster closes the search results
When search results are showing and the user clicks a poster in the collection grid, the search results SHALL close and be cleared, so the grid can scroll to the drawer again. The text in the search box SHALL stay as it was.

#### Scenario: Opening a drawer while searching
- **WHEN** search results for "dark" are showing and the user clicks a poster in the grid
- **THEN** the search results close, the drawer opens under the poster, and the search box still reads "dark"
