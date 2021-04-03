# Competition Import

This page permits to import a competition from a .csv file descriptor. Each ligne of the CSV file is a game of the competition. Each line describes the minimal information of a game with the referee coaching concern.

On a first step you select a file from your device. The application analyses your file. If a competition with the same name already exists, the application will merge the data. For each game the referees and the coaches are analysed. If the coach are an user this app, a coaching will be created automatically.

This feature is very useful in a tournament because after your allocation of the referee coches you can send them their allocation via the application.

## About the CSV file format

The CSV file must use comma as separator of columns. An header is expected with the name of columns. The columns of the CSV file are the following:

* gameId: The identifier of the game. It must be unique over the competition. It is highly recommended to provide a value. It helps to recognize on second import.
* competition: The name of the competition. All lines of the file MUST have the same competition name.
* date: The date of the first competition day. The date format is YYYY-MM-DD  (YYYY is the year over 4 digits, MM is the month number over 2 digits from 1 to 12, DD is the day number from 1 to 31)
* timeSlot: The time slot of the game. the format is HH:mm (HH is the hour from 0 to 24, mm is the minute from 0 to 59)
* field: The number of the field (1 ... )
* category: The category of the game. Value from: MO, WO, XO, MO30, MO35, MO40, MO45, MO50, WO27, WO30, WO35, SMX, OPEN)
* referee1: The short name of the first referee of the game. The short name must be the one used in the application. It is the unique way to recognize the referee from the database.
* referee2: Same as referee1 but it is about the second referee of the game.
* referee3: Same as referee1 but it is about the third referee of the game.
* refereeCoach1: The short name of the first referee coach of the game. The short name must be the one used in the application. It is the unique way to recognize an user of the application.
* refereeCoach2: Same as refereecoach1 but it is about the second referee coach of the game.
* refereeCoach3: Same as refereecoach1 but it is about the second referee coach of the game.

## Import options

### Existing games

When you import a csv file about an existing competition (the second time for instance), you can specify to update or not the existing games.

### Remove unreferenced games

When you import a csv file about an existing competition (the second time for instance), you can specify if you want to remove the games which are present in database but not listed in your csv file. This option permits to do partial imports for only new games.
