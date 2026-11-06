# user-account Specification

## Purpose
Defines the signed-in user's account controls in Myflix: the account menu in the header, signing out, and the settings page where the avatar is changed.

## Requirements
### Requirement: The avatar opens an account menu
For a signed-in user, the avatar in the header SHALL be a button, named for screen readers as the account menu, that opens a menu with My collection, Settings and Sign out. The button SHALL say whether the menu is open. The menu SHALL close when an entry is chosen, on a click outside it, and on Escape, which SHALL then return focus to the button. While the menu is open, Escape SHALL NOT also dismiss search results.

#### Scenario: Opening and choosing
- **WHEN** a signed-in user clicks their avatar
- **THEN** a menu shows My collection, Settings and Sign out, and choosing Settings goes to `/settings` and closes the menu

#### Scenario: By keyboard
- **WHEN** a user focuses the avatar, presses Enter, then Escape
- **THEN** the menu opens, then closes, and focus is back on the avatar

#### Scenario: Clicking elsewhere
- **WHEN** the menu is open and the user clicks anywhere outside it
- **THEN** the menu closes

#### Scenario: Escape with search results showing
- **WHEN** search results are showing and the menu is open, and the user presses Escape
- **THEN** the menu closes and the search results stay

### Requirement: Signing out
Sign out SHALL tell MMDb the session is over without waiting for or depending on its answer, SHALL remove the stored sign-in from both the browser's local and session storage, SHALL forget the collection, search results and filter held in the page, and SHALL go to the home page with the header's Sign In button showing.

#### Scenario: Signing out
- **WHEN** a signed-in user chooses Sign out
- **THEN** the address is `/`, the header shows Sign In, and no `myflixUser` remains in either storage

#### Scenario: Coming back
- **WHEN** a user who signed out opens `/browse`
- **THEN** they are sent to `/login`

#### Scenario: MMDb unreachable
- **WHEN** a user signs out while MMDb doesn't answer
- **THEN** they are signed out of Myflix all the same

#### Scenario: Nothing left behind
- **WHEN** another user signs in on the same page after a sign-out
- **THEN** the first user's collection, search results and filter text are not shown at any point

### Requirement: The settings page is for signed-in users
Settings SHALL be at `/settings`. Opening it without a stored sign-in SHALL go to `/login` before the page shows.

#### Scenario: Signed out
- **WHEN** a visitor with no stored sign-in opens `/settings`
- **THEN** the address becomes `/login`

### Requirement: A chosen avatar is previewed before it is saved
The settings page SHALL show the current avatar and a control to choose a JPEG or PNG. A chosen file SHALL show in the avatar's place until it is saved or the choice is cancelled. Save SHALL be disabled while nothing is chosen or an upload is in progress.

#### Scenario: Previewing
- **WHEN** a user chooses a PNG
- **THEN** it shows in place of their avatar on the page, and Save is enabled

#### Scenario: Cancelling
- **WHEN** a user chooses a file and then cancels
- **THEN** the current avatar shows again, Save is disabled, and nothing was uploaded

### Requirement: Saving the avatar changes it everywhere
Saving SHALL upload the chosen file to MMDb's `POST /api/v2/avatar` with the sign-in. On success, the header's avatar SHALL show the new image at once, the stored sign-in SHALL keep its URL, so a reload shows it too, and the user SHALL go to their collection at `/browse`, since the avatar is all the page changes.

#### Scenario: Changing the avatar
- **WHEN** a user chooses a PNG and saves
- **THEN** the address is `/browse`, the header's avatar shows the new image straight away, and after a reload it still does

#### Scenario: An expired sign-in
- **WHEN** the upload is refused because the sign-in has expired
- **THEN** the user is sent to `/login`, as for any expired sign-in

### Requirement: A failed save leaves the avatar unchanged
When MMDb refuses the file or the upload fails, the page SHALL show MMDb's message, or a general one when MMDb gives none, and the avatar SHALL stay as it was.

#### Scenario: A refused file
- **WHEN** MMDb refuses the upload with "Only JPEG and PNG files are accepted."
- **THEN** that message shows on the page, and the header's avatar is unchanged

#### Scenario: Storage failure or no connection
- **WHEN** the upload fails with a 502 or never reaches MMDb
- **THEN** a message says the avatar couldn't be saved, and the avatar is unchanged
