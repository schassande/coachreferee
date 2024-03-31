# Referee Coaching application

This project is a mobile/web application for coaching referee in a sport named Touch (rugby like).
This application helps the referee coach to assess or to evalue referees during competitions or tournaments.
The application can work offline but also with a backend to persist data and to share some of them.
The application can be found on the [web site](https://app.coachreferee.com)

The mobile application is build with IOnic 7 (Angular 15). As it is a PWA application, it can be installed on Laptop, Android and IOS devices. It works with a backend based on firebase: hosting, firestore and functions. But the application can work offline too.

* [Application](https://app.coachreferee.com)
* [Documentation of the product](https://github.com/schassande/referee-coaching/wiki/Documentation-of-the-RefCoach-application)
* [Privacy policy](https://github.com/schassande/referee-coaching/wiki/Privacy-policy)

This project is totaly free and can be fork/clone/deploy as you want.
Be free to contribute to the project.

## Code organisation

The source code is composed by 3 parts:

```./app```: contains the web application source code
```./functions```: contains the source code of the backend firebase functions
```./hosting/www```: contains the root web site

The compiling and deploy process is based on npm scripts:

* ```npm version patch``` : To create a release as patch version (3rd digit) and deploy the web app on firebase hosting
* ```npm version minor``` : To create a release as minor version (2nd digit) and deploy the web app on firebase hosting
* ```npm version major``` : To create a release as minor version (1st digit) and deploy the web app on firebase hosting
* ```npm start``` : To start the Angular server for local web dev
* ```npm build-app``` : To build the web application
* ```npm deploy-functions``` : To build and deploy the backend functions on Firebase
* ```npm deploy-www``` : To build and deploy the web side on Firebase hosting
