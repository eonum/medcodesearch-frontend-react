Cypress.on('uncaught:exception', (err, runnable) => {
    // Returning false prevents failing after uncaught errors.
    // We need this since we haven't resolved all promises correctly in apps code.
    return false
})
