# README MEDCODESEARCH

### Brief description

This React-App is used to represent the different catalogs which gets updated every year or two. This website helps to 
find the catalog number easier and to look up the different versions or expiry dates. \
Frontend from the website: [medcodesearch.ch](http://medcodesearch.ch) \
Backend which is used is: [search.eonum.ch](https://search.eonum.ch/documentation) 

### Installation instructions

For the local installation go into the folder `medcodesearch-frontend-react` and run `npm install` \
To start the local app run `npm start`. It will open at [http://localhost:3000](http://localhost:3000) in your browser.

### Issues

There is one screen size in which the buttons don't line up perfectly, but we couldn't figure out which exactly.

### Coding conventions

Each class is defined in *its own file*. \
Everything has been written in English (Comments included). \
The first letter of a classname is in uppercase, the reminder is lowercase. \
Method-names are always lowercase. \
Variable-names are lowercase if only "oneword"-word, otherwise the first letter in between is capital. \
Constants are always uppercase. \
All components reside in their own subdirectory in `/src/Components`. \
All services reside in their own subdirectory in `/src/Services`. \
All test-suites reside in their own subdirectory in `/src/__test_`. \
The installation guide resides in their own directory `/documentation`. \
Every method has its own documentation written in Javadoc. 

### Testing
#### Prerequisites
If not already installed from  `npm install` use `npm install --save-dev jest`, 
`npm install --save-dev @testing-library/react` and `npm install --save-dev start-server-and-test` to install jest,
react testing library and start-server-and-test which enables starting a server, then run test command. When you stop
the tests, the server is automatically shut down.

#### Run tests
Pay attention that using `npm test` will run tests in browser. As we want to run our tests headless, use 
`npm run test-headless` which is configured via scripts in `package.json`. There you can also adapt port for test 
server which is currently set to `localhost:8080`.

### Contact 

For further question: 
- +41 (0)31 311 17 06 -> eonum contact
- [info@eonum.ch](info@eonum.ch) -> eonum contact
- [jan.koch@students.unibe.ch](jan.koch@students.unibe.ch) -> university development team
- [eonum.ch/de/kontakt/](https://eonum.ch/de/kontakt/) -> eonum website

### Diagram

![img.png](img.png)
