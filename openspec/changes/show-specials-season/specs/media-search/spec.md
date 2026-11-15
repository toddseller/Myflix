# Spec Delta

## ADDED Requirements

### Requirement: A specials season is listed as Specials
In a show search's results, a season numbered 0 SHALL be labelled "Specials" in place of "Season 0". Other seasons SHALL keep their "Season N" label.

#### Scenario: A stored show with specials
- **WHEN** the user searches for a show whose results include its seasons 1 and 0
- **THEN** the results label those seasons "Season 1" and "Specials"
