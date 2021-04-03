# Features & releases

This file lists the development task to do:

## Bugs

- Scrolling with tabs does work on iPhone. Tested on safari and on chrome
- Import duplicates coaching

## Possibles features by priority

Priority 1:

- coachiing game page / exis of improvment / Be able to indicate an improvement without enter into the detail of the feedback item (just clicking on an icon => 2 colors/shape of the icon in the line)
- test competition referee ranking on a competition with plenty of referees
- work in progress indicator: competition import
- work in progress indicator: sharing of coaching
- work in progress indicator: account creation
- Function sendXpReport
- Migrate to IOnic 5 / Angular 9
- Create user group used to simplify the sharing
- Une page myday avec coaching du jour

Priority 2:

- Localisation des serveurs en europe
- Cleaning script of past empty coaching
- Style of the online help
- In context menu, of coaching game, add the next and the previous game
- Settings: limit to referee to a region or a group => defintion of referee group
- Find a solution to force pushing data when switch online
- Offline photo for users & referees
- Create a trigger to delete unused photo on storage every week end
- Referee list : infinite scroll, group by short name or level
- Coaching list : infinite scroll
- Assessment list : infinite scroll
- Auto detect disconnected mode.
- Organize Angular code in submodules with lazy loading.

## Next version

- fix bug: on invitation the email to the user and the admin must not indicate a validation is required.

## Versin 2.6.4 2020/03/14

- improve import of referees
- bug fix in user creation

## Versin 2.6.3 2020/03/14

- Export a referee list from a competition
- In coaching-list use a different color for the futur coaching
- Fix bug about user creation

## Versin 2.6.2 2020/03/10

- Add the invitation feature. An invited people does not need a validation step by the application administrator.
- Sort the user when adding a coach to a competition.
- Add new game categories
- Show number of referees/coaches on competition home page.
- On competition coach page, the button to add a coach is now consistent with the rest of the application style (Button bottom, right).

## Versin 2.6.0 2020/03/09

- Coaching list: Make closable the sub list of coachings
- Coaching list: Can lock the sub list of coachings
- Coaching edit: Time slot is each 5 minutes
- Coaching Game: can switch period of an item by click on period icon

## Versin 2.5.0 2020/03/07

- Import of referees in a competition. Based on the list of short names.
- Permit to delete all referees from a competition.

## Versin 2.4.0

- Add the concept of competition
- New feature helping to rank referees during a competition as panel member
- New feature helping to decide the referee upgrades during a competition as panel member
- New feature helping to decide the referee upgrades over a season/year
- On coaching list page, there is a new button to filter coaching of the day by default

## Versin 2.3.2

- New admin page showing the use of the application with charts
- show user id users admin page
- Bug Fix about account validation
- Bug fix about offline/online
- Wait server response on write action when online
- Add Junior category for a referee


## Versin 2.3.1

- list assessments of a refere in Referee View Page
- Shortcut to assess a referee from the coaching page and from the Referee View page

## Versin 2.3.0

- API key is no more in Git repository
- Write a documentation of the application on the web site
- Create an admin page of users: delete account, ask the reset of the password, un/block an account and validate the subscription of new user
- On User edit page the user can delete his account
- Import of referees via a CSV file
- Import csv of a competition containing the referees, the coaches and the games. The import creates coaching

## Versin 2.2.1

- On any page, an help is available via context menu. Help is based on markdown file.

## Version 2.2.0

- Remove the delay to wait the referee list on the referee select page
- Backups of data everyday over last 30 days
- Add competitions feature
- Add an admin page : migrate profile and account management links on this page
- Create a login page (Remove the feature to select an user on login page: only email/password, Logout navigate on Login page, move autologin into that page)

## Version 2.1.3

- Auto clean the context menu list
- Show a Loading screen on login
- Use a slide transition between coaching edit page, coaching game page, positive feedback page and improvment feedback page
- In CoachingGame page add an icon in improvment feedback list when the problem has been fixed
- Replace link to Coaching edit page by coaching game page
- Show in row the buttons of period of time in coaching game page
- Settings local to define the number of period of time during a game

## Version 2.1.2 

- show alert message when no password
- disable or hide buttons on coach edit page


## Version 2.1.1

- show alert message when login fails.

## Version 2.1.0

- XP history management
- Coach profiles
- Assessment of coach (coach profile)
- New logo
- [Web site](http://coachreferee.com)
- referee view/list : show badge
- List of pro not completly defined
- Public sharing of a pro

## Version 2.0.14 2019-06-09

- bug fix about default competition saving
- CoachingList : view by competition name & day
- refresh coaching list by pull down
- RefereeView : show detail of coaching
- referee list : sort by name or badge
- referee list : show badge [color]

## Version 2.0.13

- bug fix about user registration

## Version 2.0.12

- change alertcontroller of login to modal controller
- add link to send email to reset password.
- add offline into menu

## Version 2.0.11

- Add google account
- Add facebook account
