# Spec Delta

## ADDED Requirements

### Requirement: The drawer stays smooth in large collections
Opening, swapping, moving and closing the drawer SHALL keep frames short in a grid of thousands of posters, by not rendering tiles far from the screen. The median frame during a drawer's animation SHALL stay under 25ms in a grid of about 4,500 movies on a desktop browser.

#### Scenario: Thousands of movies
- **WHEN** a drawer opens, swaps within its row, moves to another row, or closes in a grid of 4,527 movies on a desktop browser with the window in front
- **THEN** the median frame during the animation is under 25ms, near the top of the grid as well as further down

### Requirement: Scrolling the grid doesn't freeze
Scrolling or jumping through a grid of thousands of posters SHALL show the posters that come into view without freezing the page.

#### Scenario: Long scroll
- **WHEN** the user jumps from the top of a 4,527-movie grid to the middle
- **THEN** the page shows the posters there without freezing

### Requirement: The grid looks the same however its tiles are grouped
Skipping off-screen tiles and grouping them SHALL NOT change what the grid shows: the same columns, gaps and rows at every width, with every row full except the last, and the last row's posters lined up under the columns above them.

#### Scenario: A collection longer than one group
- **WHEN** a user with 845 movies views the grid on a 1500px wide window
- **THEN** every row holds 7 posters except the last, which holds 5 starting under the first column, and the gaps between all rows are equal

#### Scenario: Scrollbar
- **WHEN** a user drags the page's scrollbar from top to bottom
- **THEN** the scrollbar's length and position track the page as before, without jumping as posters come into view
