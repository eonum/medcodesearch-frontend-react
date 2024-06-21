# README MEDCODESEARCH

### Brief description

This React-App is used to represent the different catalogs which gets updated every year or two. This website helps to 
find the catalog number easier and to look up the different versions or expiry dates. \
Frontend from the website: [medcodesearch.ch](http://medcodesearch.ch) \
Backend which is used is: [search.eonum.ch](https://search.eonum.ch/documentation) 

### Setup
#### Development
For the local installation go into the folder `medcodesearch-frontend-react` and run ` install`. 
To start the local app run `yarn start`. It will open at [http://localhost:3000](http://localhost:3000) in your browser.
#### Production
Run deploy script `deploy.sh`.

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
Every method has its own documentation written in Javadoc. 

### Testing
We use cypress for our tests. Since we use typescript, we also need babel for transformation.
#### Config
The configuration for babel and cypress are stored in babel.config.js and cypress.config.ts in the root folder and can 
be adapted to your needs. We do frontend tests that can be run headless in terminal or, useful for debugging, run in 
cypress GUI. To do so, we specified some custom commands in package.json under scripts section, namely

```json
{
  "test": "start-server-and-test start-test-server http-get://localhost:$npm_package_config_testPort 'cypress run'", 
  "test:search": "start-server-and-test start-test-server http-get://localhost:$npm_package_config_testPort 'cypress run --spec cypress/e2e/searchMobile.cy.ts,cypress/e2e/search.cy.ts'", 
  "test:breadcrumbs": "start-server-and-test start-test-server http-get://localhost:$npm_package_config_testPort 'cypress run --spec cypress/e2e/breadcrumbsMobile.cy.ts,cypress/e2e/breadcrumbs.cy.ts'", 
  "test:codeAttributes": "start-server-and-test start-test-server http-get://localhost:$npm_package_config_testPort 'cypress run --spec cypress/e2e/codeAttributesMobile.cy.ts,cypress/e2e/codeAttributes.cy.ts,cypress/e2e/customCodeAttributes.cy.ts'", 
  "test:default": "start-server-and-test start-test-server http-get://localhost:$npm_package_config_testPort 'cypress run --spec cypress/e2e/defaultMobile.cy.ts,cypress/e2e/default.cy.ts'", 
  "test:popUp": "start-server-and-test start-test-server http-get://localhost:$npm_package_config_testPort 'cypress run --spec cypress/e2e/popUpMobile.cy.ts,cypress/e2e/popUp.cy.ts'", 
  "test-with-gui": "start-server-and-test start-test-server http-get://localhost:$npm_package_config_testPort 'cypress open'", 
  "start-test-server": "BROWSER=none PORT=$npm_package_config_testPort react-scripts start"
}
```

#### Run tests
Use `yarn test` to start headless server and tests or, for example `test:breadcrumbs` to run breadcrumbs tests only.
Currently the port for test server is set to `localhost:8080` in package.json. To start graphical tests use 
`yarn test-with-gui`.

### Contact
For further question: 
- +41 (0)31 311 17 06 -> eonum contact
- [info@eonum.ch](info@eonum.ch) -> eonum contact
- [jan.koch@students.unibe.ch](jan.koch@students.unibe.ch) -> university development team
- [eonum.ch/de/kontakt/](https://eonum.ch/de/kontakt/) -> eonum website

### Diagram
![img.png](img.png)
