## MODIFIED Requirements

### Requirement: The open poster is marked without moving its neighbours
The poster whose drawer is open SHALL appear enlarged and lifted, with a pointer below it leading into the drawer, and the other posters SHALL keep their positions. While it is open, a movie's title SHALL be hidden, since the enlarged poster covers it, and a show's title SHALL be hidden while its seasons line stays in place under the enlarged poster. On opening, the title SHALL finish fading as the poster finishes enlarging, not before, and on closing it SHALL NOT show over the shrinking poster. A poster whose drawer is closing SHALL return to its normal size.

#### Scenario: Poster enlarged
- **WHEN** a movie's drawer is open
- **THEN** that poster is shown larger with the pointer under it, its title is hidden, and its neighbours have not moved

#### Scenario: A show's text stays
- **WHEN** a show's drawer is open
- **THEN** its poster is shown larger, its title is hidden, and its seasons line still shows below the poster

#### Scenario: The title fades as the poster covers it
- **WHEN** the user clicks a poster to open its drawer
- **THEN** its title is still showing as the poster starts to enlarge, and it is gone at the moment the poster reaches its full size

#### Scenario: The title returns as the poster shrinks
- **WHEN** the user closes an open drawer
- **THEN** the poster's title stays hidden until the shrinking poster has mostly moved off it, then fades back in, and is never drawn over the poster

#### Scenario: Another poster opened
- **WHEN** a drawer is open and the user clicks another poster
- **THEN** the new poster is enlarged with the pointer, and the first poster is back to its normal size with its title showing

#### Scenario: Reduced motion
- **WHEN** reduced motion is requested and the user clicks a poster
- **THEN** the poster is enlarged at once, without easing
