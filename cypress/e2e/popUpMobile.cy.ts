describe('PopUp test suite for mobile version', function () {
    const baseUrl = Cypress.config("baseUrl");

    beforeEach(() => {
        cy.viewport(400, 800);
    });

    // Testing the same functionality for mobile screen (with different language and version).
    it('PopUp mobile', function () {
        cy.visit(`${baseUrl}/de/ICD/ICD10-GM-2022/icd_chapters/ICD10-GM-2022`);
        // Change language to 'it'.
        cy.get(".language-btn:nth-child(3)").click();
        cy.url().should('eq', `${baseUrl}/it/ICD/ICD10-GM-2022/icd_chapters/ICD10-GM-2022`);
        // Click on versions button for icds.
        cy.get("#version_button").should('be.visible').click();
        cy.wait(2000)
        // Select ICD 2019 (which is not available in 'it').
        cy.get("#ICD10-GM-2019").should('be.visible').click();
        // PopUp for language selection or go back should appear.
        cy.get(".modal-content").should('be.visible').then(($el) => {
            const value = $el.text();
            expect(value).to.match(/Il catalogo selezionato non è disponibile nel linguaggio corrente./);
        });
        // Click retour button, i.e. stay on page with same URL.
        cy.get(".modal-footer > .PopUpBtn").should('be.visible').click();
        cy.url().should('eq', `${baseUrl}/it/ICD/ICD10-GM-2022/icd_chapters/ICD10-GM-2022`);
        // Again click ICD 2021 but now choose 'de' and check if correct forwarded.
        cy.get("#version_button").should('be.visible').click();
        cy.get("#ICD10-GM-2019").should('be.visible').click();
        // 'de' should be first button.
        cy.get(".modal-footer > div > .PopUpBtn:nth-child(1)").should('be.visible').click();
        cy.url().should('eq', `${baseUrl}/de/ICD/ICD10-GM-2019/icd_chapters/ICD10-GM-2019`);
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
