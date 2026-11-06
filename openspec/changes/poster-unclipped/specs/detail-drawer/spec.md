## ADDED Requirements

### Requirement: The enlarged poster is shown in full in every row
The open poster SHALL be shown whole as it enlarges, while it stays enlarged, and as it returns to its normal size, with no edge cut off, whatever row it sits in, as on MMDb: the whole poster grows and shrinks in one motion. The rest of the grid SHALL look and scroll as before.

#### Scenario: A filtered show
- **WHEN** the user filters the TV shows to "Nocturne" and opens its drawer
- **THEN** the whole enlarged poster shows, with the Apple TV logo keeping its margin from the top and right edges

#### Scenario: The grid's top row
- **WHEN** the user opens a movie in the grid's first row
- **THEN** the enlarged poster's top edge shows in full, 10px above the row

#### Scenario: The first row of a later group
- **WHEN** a user with more than 420 movies opens the 421st
- **THEN** its enlarged poster shows in full

#### Scenario: Closing
- **WHEN** the user closes a drawer, or opens another poster
- **THEN** the enlarged poster shrinks back whole, its edges never cut off before the artwork has returned to its normal size
