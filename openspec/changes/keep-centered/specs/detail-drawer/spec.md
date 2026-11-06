## ADDED Requirements

### Requirement: A short row keeps its posters in place when a drawer opens
When the grid shows fewer posters than fit across one row, as a filter often leaves it, those posters SHALL stay where they were when a drawer opens under them: centred as a group, side by side, with the drawer opening underneath and its pointer under the clicked poster. If the window narrows so they no longer fit across, they SHALL wrap as the grid does today. A grid with at least one full row SHALL be unchanged.

#### Scenario: One show after filtering
- **WHEN** the user filters the TV shows to "Nocturne", which leaves one poster centred in a 3360px wide window, and clicks it
- **THEN** the poster stays centred, and the drawer opens under it, full width, with the pointer under the poster

#### Scenario: A few movies after filtering
- **WHEN** a filter leaves 3 movies centred side by side and the user clicks the middle one
- **THEN** all three keep their positions, and the drawer opens under them with the pointer under the middle poster

#### Scenario: A full grid
- **WHEN** the grid has full rows and the user opens a drawer under its short last row
- **THEN** the last row's posters stay lined up under the columns above, as before

#### Scenario: A narrow window
- **WHEN** a filter leaves 3 shows on a 390px wide phone, too wide to fit across
- **THEN** they wrap as before, and a drawer opens under the clicked poster's row
