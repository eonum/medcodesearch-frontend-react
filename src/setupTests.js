// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import firefox from "selenium-webdriver/firefox";
import '@testing-library/jest-dom';
import emitter from "events";
jest.setTimeout(450000) //ms --> 450s -->7.5min runningtime before tests are stopped

emitter.setMaxListeners(6)
const seleniumDrivers = require("selenium-drivers");

export const options = new firefox.Options();
options.headless();

export const n = 1000; // wait time between each step in on test
export const browser = 'firefox' //bowser to test
// sleep function for between each step
export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export const capabilities = {
    browserName: browser,
    headless: true,
}


// init method for downloading newest browser webdriver for testing
seleniumDrivers.init({
    browserName: browser,
    download: false,
    silent: true
})
