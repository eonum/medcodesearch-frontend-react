describe('PopUp test suite', function () {
    const baseUrl = Cypress.config("baseUrl");

    beforeEach(() => {
        cy.viewport(1366, 768);
    });

    it('PopUp for versions not available in language', function () {
        cy.visit(`${baseUrl}/de/ICD/ICD10-GM-2024/icd_chapters/ICD10-GM-2024`);
        // Change language to 'fr'.
        cy.get(".language-btn:nth-child(3)").should('be.visible');
        cy.get(".language-btn:nth-child(2)").click();
        cy.url().should('eq', `${baseUrl}/fr/ICD/ICD10-GM-2024/icd_chapters/ICD10-GM-2024`);
        // Click on versions button for icds.
        cy.get("#version_button").should('be.visible').click();
        cy.wait(2000)
        // Select ICD 2021 (which is not available in 'fr').
        cy.get("#ICD10-GM-2021").should('be.visible').click();
        // PopUp for language selection or go back should appear.
        cy.get(".modal-content").should('be.visible').then(($el) => {
            const value = $el.text();
            expect(value).to.match(/Le catalogue sélectionné n'est pas disponible dans la langue actuelle./);
        });
        // Click retour button, i.e. stay on page with same URL.
        cy.get(".modal-footer > button").should('be.visible');
        cy.get(".modal-footer > .PopUpBtn").click();
        cy.url().should('eq', `${baseUrl}/fr/ICD/ICD10-GM-2024/icd_chapters/ICD10-GM-2024`);
        // Again click ICD 2021 but now choose 'de' and check if correct forwarded.
        cy.get("#version_button").should('be.visible').click();
        cy.get("#ICD10-GM-2021").should('be.visible').click();
        // 'de' should be first button.
        cy.get(".modal-footer > div > .PopUpBtn:nth-child(1)").should('be.visible').click();
        cy.url().should('eq', `${baseUrl}/de/ICD/ICD10-GM-2021/icd_chapters/ICD10-GM-2021`);
    });

    it('Navigates to latest icd with toast warning if selected version for language change not available', function () {
        cy.visit(`${baseUrl}/de/ICD/ICD10-GM-2021/icd_chapters/ICD10-GM-2021`);
        // Change language to 'fr'. 2021 ICD doesn't exist in french version which should trigger rendering of latest
        // existing icd version for 'fr' and rendering of a toast as warning.
        cy.get(".language-btn:nth-child(3)").should('be.visible');
        cy.get(".language-btn:nth-child(2)").click();
        cy.get(".Toastify__toast-container").should('be.visible');
        cy.contains("Cette version n'est pas disponible dans la langue sélectionnée.");
    });
});
