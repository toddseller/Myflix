## ADDED Requirements

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
