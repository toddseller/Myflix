## MODIFIED Requirements

### Requirement: Links to the collection use its address
Signing in SHALL go to `/browse`, and the account menu's My collection entry SHALL lead to `/browse`. No link SHALL put a user id in a collection address.

#### Scenario: Signing in
- **WHEN** a user signs in
- **THEN** the address is `/browse`

#### Scenario: Header
- **WHEN** a signed-in user opens the account menu from their avatar and chooses My collection
- **THEN** they go to `/browse`
