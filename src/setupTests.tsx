import '@testing-library/jest-dom';
import emitter from "events";

jest.setTimeout(450000) //ms --> 450s -->7.5min running time before tests are stopped

emitter.setMaxListeners(6)

export const n = 1000; // wait time between each step in on test

// sleep function for between each step
export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
