# Spec Delta

## ADDED Requirements

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
