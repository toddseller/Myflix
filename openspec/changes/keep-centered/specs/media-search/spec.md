## ADDED Requirements

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
