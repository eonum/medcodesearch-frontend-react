import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require('./cypress/plugins/index.js')(on, config)
    },
    baseUrl: 'http://localhost:8080',
    env: {
      testUrl: 'http://localhost:8080'
    },
    supportFile: './cypress/support/index.js',
  },
  retries: {
    // The runMode option determines how Cypress should handle retries. The value 2 corresponds to the runMode option
    // OPEN_MODE_ONCE_FAILED, which means that Cypress will:
    // Run all tests once.
    // If any test fails, it will rerun only the failed tests from the beginning.
    // If the failed tests still fail after the retry, Cypress will open the browser and run the failed tests again,
    // allowing you to inspect and debug them.
    runMode: 2
  }
})
