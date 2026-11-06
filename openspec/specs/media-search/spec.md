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

### Requirement: Typing a filter never replaces the page
The page SHALL show its loading page only until the collection's movies and shows have first loaded. After that, a filter that matches nothing on the current tab SHALL show an empty grid, with the tabs, search box, typed text and count bar still on screen, and opening or closing the search box SHALL NOT bring the loading page back.

#### Scenario: A filter that matches no show
- **WHEN** the collection has loaded and the user types "zzqx" into the search box on the TV Shows tab
- **THEN** the grid is empty, and the search box still shows "zzqx" so it can be edited

#### Scenario: On the Movies tab
- **WHEN** the user is on the Movies tab and types text that matches movies but no shows
- **THEN** the matching movies show, and the page is not replaced

#### Scenario: After the search box is closed
- **WHEN** the user opens and closes the search box, then types a filter that matches nothing
- **THEN** the grid is empty and the page is not replaced

#### Scenario: Before the collection arrives
- **WHEN** the page has just opened and the movies and shows haven't loaded yet
- **THEN** the loading page shows, and the grid replaces it once both have loaded

### Requirement: Opening a drawer keeps the search results
Clicking a poster in the grid while search results show SHALL open its drawer under the poster and SHALL leave the results panel, its results, the search box and its text as they were. The grid SHALL stay pinned until the results are dismissed or the search ends, so a drawer whose row is below the screen is reached by dismissing the results first.

#### Scenario: Comparing a result with the collection
- **WHEN** the user has typed "nocturne", searched the TV shows, and clicks the "Nocturne" poster in the filtered grid
- **THEN** its drawer opens under it, and the 69 results stay above with the search box still reading "nocturne"

#### Scenario: A drawer below the screen
- **WHEN** results show and the user opens a drawer whose row is below the bottom of the screen
- **THEN** the results stay, and dismissing them unpins the grid so the page can scroll to the drawer

### Requirement: The search results can be dismissed without losing the filter
While the results panel is open, a dismiss button SHALL show at its top right, named "Dismiss search results" for screen readers, and pressing Escape SHALL do the same as clicking it. Dismissing SHALL close the panel, clear its results and unpin the grid, and SHALL leave the search box open with its text, so the grid stays filtered. When the panel is closed, the button SHALL be hidden and Escape SHALL do nothing.

#### Scenario: Dismissing show results
- **WHEN** the user has typed "nocturne", searched the TV shows, and clicks the dismiss button
- **THEN** the panel closes, the results are cleared, the grid scrolls again, and the grid stays filtered to "nocturne" with the search box still open

#### Scenario: Escape
- **WHEN** the results panel is open and the user presses Escape
- **THEN** the panel is dismissed as if the button were clicked

#### Scenario: While a search is still running
- **WHEN** the panel shows "Searching our database…" and the user dismisses it
- **THEN** the panel closes, and results that arrive afterwards don't reopen it

#### Scenario: Nothing to dismiss
- **WHEN** no search is open
- **THEN** no dismiss button shows, and Escape changes nothing
