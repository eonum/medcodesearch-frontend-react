// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
jest.setTimeout(3600000) //ms --> 3600s -->60min


const seleniumDrivers = require("selenium-drivers");
const webDriver = require("selenium-webdriver");

seleniumDrivers.init({

    browserName: 'chrome',
    download: false

})
seleniumDrivers.init({
    browserName: 'firefox',
    download: false

})
seleniumDrivers.init({
    browserName: 'safari',
    download: false
})