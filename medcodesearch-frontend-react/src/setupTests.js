// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import {driver} from "selenium-drivers";
jest.setTimeout(600000) //ms --> 600s -->10min


const seleniumDrivers = require("selenium-drivers");
const webDriver = require("selenium-webdriver");
export const n = 1000;
export const browser = 'firefox'
export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

seleniumDrivers.init({

    browserName: browser,
    download: false

})