describe('Error handling test suite for mobile version', function () {
  const baseUrl = Cypress.config("baseUrl");
  const backendUrl = 'https://search.eonum.ch';

  beforeEach(() => {
    cy.viewport(450, 1200);
  });

  it('shows error toast when search API returns 500', () => {
    cy.intercept('GET', `${backendUrl}/de/icds/ICD10-GM-2024/search*`, {
      statusCode: 500,
      body: 'Internal Server Error',
    }).as('failedSearch');

    cy.visit(`${baseUrl}/de/ICD/ICD10-GM-2024/icd_chapters/ICD10-GM-2024?query=magen`);
    cy.wait('@failedSearch');
    cy.contains('Ein Fehler ist aufgetreten: Daten konnten nicht geladen werden.').should('be.visible');
  });
});
