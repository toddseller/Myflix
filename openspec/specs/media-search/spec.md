# media-search Specification

## Purpose
Defines how the search panel presents the titles found to add to the collection: the order a show search's results come in, and that every result in the panel can be reached.

## Requirements
### Requirement: A show search puts the collection's own shows first
The results of a show search SHALL list the seasons of shows already in the user's collection first, then seasons whose show title matches the search text exactly (ignoring case and surrounding spaces), then every other result. Within each group, results SHALL keep the order MMDb returned them in, so a show's seasons stay in sequence.

#### Scenario: A show in the collection among many loose matches
- **WHEN** the user searches the TV shows for "nocturne", and MMDb returns 69 seasons with the collection's own "Nocturne" season 1 last
- **THEN** "Nocturne" season 1 is the first result

#### Scenario: An exact title not yet in the collection
- **WHEN** the user searches for "dark", and the results include seasons of "Dark", which the collection doesn't have, after seasons of "Dark Matter" and "Dark Winds"
- **THEN** the seasons of "Dark" come before those of "Dark Matter" and "Dark Winds", in the order MMDb gave them

#### Scenario: No match in the collection or by exact title
- **WHEN** no result belongs to the collection or matches the search text exactly
- **THEN** the results keep MMDb's order

### Requirement: Every search result can be reached
The search panel's row of results SHALL scroll sideways within the panel when its results don't all fit, including by a finger swipe or trackpad, for movie results, show results and a season's episodes alike. When they all fit, the row SHALL look as before, with no arrows.

#### Scenario: More results than fit
- **WHEN** a search returns 69 results on a 1500px wide window
- **THEN** the user can scroll the row to the 69th result

#### Scenario: A season's episodes
- **WHEN** the user picks a season with more episodes than fit across the screen
- **THEN** the user can scroll the row to its last episode

#### Scenario: Few results
- **WHEN** a search returns 3 results
- **THEN** they show centred, as before, and no arrows show

### Requirement: Arrows scroll the results row
Each arrow SHALL scroll the results row by its visible width, gliding unless the system asks for reduced motion, when it SHALL jump. The left arrow SHALL show only while the row is scrolled past its start, and the right arrow only while results are hidden past its end, however the row was scrolled. The arrows SHALL be buttons named for screen readers: "Earlier results" and "Later results".

#### Scenario: Scrolling from the start
- **WHEN** a long row of results is at its start
- **THEN** only the "Later results" arrow shows; clicking it glides the row one visible width and shows "Earlier results"

#### Scenario: Reaching the end
- **WHEN** the row is scrolled to its end
- **THEN** "Later results" hides and "Earlier results" shows

#### Scenario: Reduced motion
- **WHEN** a user whose system asks for reduced motion clicks an arrow
- **THEN** the row moves one visible width at once

### Requirement: Closing the search box ends the search
Closing the search box SHALL end the search however many results it found: the results panel closes, its results clear, the grid can scroll again, and the collection's counts refresh.

#### Scenario: One result
- **WHEN** a show search returns a single season and the user closes the search box
- **THEN** the results panel closes and the grid scrolls

#### Scenario: No results
- **WHEN** a search returns nothing and the user closes the search box
- **THEN** the results panel closes and the grid scrolls

#### Scenario: Many results
- **WHEN** a search returns 69 results and the user closes the search box
- **THEN** the results panel closes and the grid scrolls, as before

### Requirement: Each search shows its results
Submitting a search SHALL open the results panel with that search's results, whether or not the panel is already open.

#### Scenario: A second search while results show
- **WHEN** results for "nocturne" are showing and the user submits a search for "dark"
- **THEN** the panel stays open and shows the results for "dark"

### Requirement: Adding from the results ends the search
Adding a movie, or a season's episodes, from the results SHALL end the search as closing the search box does.

#### Scenario: Adding a movie
- **WHEN** the user picks a movie from the search results
- **THEN** it is added, the results panel closes, and the grid scrolls
