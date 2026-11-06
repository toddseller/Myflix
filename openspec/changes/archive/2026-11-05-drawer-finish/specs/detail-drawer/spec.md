# Spec Delta

## ADDED Requirements

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

## MODIFIED Requirements

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
