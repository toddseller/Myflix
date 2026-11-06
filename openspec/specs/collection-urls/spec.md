# collection-urls Specification

## Purpose
Defines how the signed-in user's collection is addressed: the addresses of its Movies and TV Shows tabs, the links that lead there, what older addresses do, and what a signed-out visitor gets.

## Requirements
### Requirement: The collection's tabs have their own addresses
The signed-in user's movies SHALL be at `/browse` and their TV shows at `/browse/shows`. Opening either address SHALL show that tab. Choosing a tab SHALL change the address to that tab's, without reloading the page or the collection, and the browser's Back and Forward buttons SHALL move between the tabs visited.

#### Scenario: Reloading on TV Shows
- **WHEN** the user is on the TV Shows tab and reloads the page
- **THEN** the address is `/browse/shows` and the TV Shows tab shows

#### Scenario: Choosing a tab
- **WHEN** the user is at `/browse` and chooses TV Shows
- **THEN** the address becomes `/browse/shows`, the TV shows appear, and the collection isn't fetched again

#### Scenario: Back
- **WHEN** the user went from Movies to TV Shows and presses Back
- **THEN** the address is `/browse` and the Movies tab shows

### Requirement: Links to the collection use its address
Signing in SHALL go to `/browse`, and the header's avatar link SHALL lead to `/browse`. No link SHALL put a user id in a collection address.

#### Scenario: Signing in
- **WHEN** a user signs in
- **THEN** the address is `/browse`

#### Scenario: Header
- **WHEN** a signed-in user clicks their avatar in the header
- **THEN** they go to `/browse`

### Requirement: Other browse addresses lead to the collection
Any address under `/browse/` other than `/browse/shows`, such as a bookmarked `/browse/<id>`, SHALL redirect to `/browse`, replacing the old address in the browser's history.

#### Scenario: Old bookmark
- **WHEN** a signed-in user opens `/browse/1`
- **THEN** the address becomes `/browse` and the Movies tab shows

#### Scenario: Anything else
- **WHEN** a signed-in user opens `/browse/banana/2`
- **THEN** the address becomes `/browse`

### Requirement: A signed-out visitor is sent to sign in
Opening any `/browse` address without a stored sign-in SHALL go to `/login` before the collection page appears or requests anything. An expired sign-in SHALL keep going to `/login` when MMDb refuses it, as now.

#### Scenario: Signed out
- **WHEN** a visitor with no stored sign-in opens `/browse/shows`
- **THEN** the address becomes `/login`, the sign-in form shows, and no collection request is made

#### Scenario: Old bookmark, signed out
- **WHEN** a visitor with no stored sign-in opens `/browse/1`
- **THEN** the address becomes `/login`
