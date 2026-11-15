# Spec Delta

## MODIFIED Requirements

### Requirement: A show's drawer shows its active season
A show's drawer SHALL open on the show's active season, or its lowest-numbered regular season when none is active (its specials only when it has nothing else). It SHALL show that season's poster and plot, the show's title, genre, year, a badge for its rating (TV-G, TV-PG, TV-14, TV-MA or NR), an HD badge when it is in 1080p, its total seasons and episodes, and a button for each season in season order with the shown season marked. Text SHALL be shown as text, with HTML entities decoded.

#### Scenario: Counts
- **WHEN** the user opens a show with 2 seasons and 1 episode in all
- **THEN** the drawer says "2 seasons, 1 episode"

#### Scenario: Single season
- **WHEN** the user opens a show that has only season 3
- **THEN** under the title the drawer says "Season 3"

#### Scenario: Several seasons
- **WHEN** the user opens a show with 4 seasons whose active season is 2
- **THEN** under the title the drawer says "4 seasons", it shows season 2's poster and plot, and the season 2 button is marked

#### Scenario: No active season, with specials
- **WHEN** the user opens a show with seasons 0, 1 and 2, none of them active
- **THEN** the drawer shows season 1, and the season 1 button is marked

## ADDED Requirements

### Requirement: A show's specials are named Specials and come last
In a show's drawer, the button for season 0 SHALL read "Specials" and SHALL come after the button of the show's last regular season. Every other season button SHALL read its season number, in ascending order.

#### Scenario: A show with specials
- **WHEN** a user opens a show with seasons 0, 1 and 2
- **THEN** the season buttons read "1", "2" and "Specials", in that order

#### Scenario: A show without specials
- **WHEN** a user opens a show with seasons 1, 2 and 3
- **THEN** the season buttons read "1", "2" and "3"

#### Scenario: Choosing Specials
- **WHEN** a show's drawer is open on season 1 and the user clicks "Specials"
- **THEN** the drawer shows season 0's poster, plot and episodes, and the Specials button is marked

### Requirement: The drawer's season counts leave out specials
The drawer's season counts SHALL count only regular seasons, and its episode count SHALL include the specials' episodes. A show whose only season is 0 SHALL read "Specials" where a season would be named.

#### Scenario: Fourteen seasons and specials
- **WHEN** a user opens a show with seasons 1 to 14 holding 212 episodes and a season 0 holding 4
- **THEN** the drawer reads "14 seasons, 216 episodes", and "14 seasons" under the title

#### Scenario: One season and specials
- **WHEN** a user opens a show with season 3 holding 9 episodes and a season 0 holding 2
- **THEN** the drawer reads "1 season, 11 episodes" and "Season 3" under the title

#### Scenario: Only specials
- **WHEN** a user opens a show whose only season is 0, holding 4 episodes
- **THEN** the drawer reads "Specials, 4 episodes" and "Specials" under the title

### Requirement: A tile for a show with only specials reads Specials
A show's grid tile SHALL read "Specials" under its title when the show's only season is 0, which MMDb reports as empty season numbers. Other tiles SHALL keep the season label MMDb's season count and numbers give them, which leave specials out.

#### Scenario: Only specials
- **WHEN** MMDb reports a show's season numbers as empty
- **THEN** its tile reads "Specials"

#### Scenario: A stale season count of 0
- **WHEN** MMDb reports a show's season count as 0 and its season numbers as "1"
- **THEN** its tile reads "Season 1"

#### Scenario: Specials beside fourteen seasons
- **WHEN** MMDb reports a show's season count as 14
- **THEN** its tile reads "14 Seasons"
