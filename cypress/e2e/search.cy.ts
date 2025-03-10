describe('Search test suite', function () {
  const baseUrl = Cypress.config("baseUrl");

  beforeEach(() => {
    cy.viewport(1366, 768);
  });

  it('search de icd code (A15.3)', () => {
    cy.visit(baseUrl);
    cy.get('.me-2.form-control').type('A15.3');
    cy.url().should('include', '/de/ICD/ICD10-GM-2024/icd_chapters/ICD10-GM-2024?query=A15.3');
    cy.get('.searchResult:nth-child(1)').should('contain.text', 'A15.3');
  });

  it('search it icd text (stomaco)', () => {
    cy.visit(`${baseUrl}/it/ICD/ICD10-GM-2020/icd_chapters/ICD10-GM-2020`);
    cy.get('.me-2.form-control').type('stomaco');
    cy.url().should('include', '/it/ICD/ICD10-GM-2020/icd_chapters/ICD10-GM-2020?query=stomaco');
    cy.get('.searchResult:nth-child(1)').invoke('text').should('match', /stomaco/i);
  });

  it('search non existing text / code', () => {
    cy.visit(`${baseUrl}/de/ICD/ICD10-GM-2020/icd_chapters/ICD10-GM-2020`);
    cy.get('.me-2.form-control').type('asadsafadfqefqfqcqefqef232425');
    cy.url().should('include', '/de/ICD/ICD10-GM-2020/icd_chapters/ICD10-GM-2020?query=asadsafadfqefqfqcqefqef232425');
    cy.get('.searchResult:nth-child(1)').should('contain.text', 'Die Suche erzielte keinen Treffer.');
  });

  it('search fr chop text (robot)', () => {
    cy.visit(`${baseUrl}/fr/CHOP/CHOP_2022/chop_chapters/CHOP_2022`);
    cy.get('.me-2.form-control').type('robot');
    cy.url().should('include', '/fr/CHOP/CHOP_2022/chop_chapters/CHOP_2022?query=robot');
    cy.get('.searchResult:nth-child(1)').should('contain.text', 'robot opératoire');
  });

  it('search it tarmed code (12.0010)', () => {
    cy.visit(`${baseUrl}/it/TARMED/TARMED_01.09/tarmed_chapters/TARMED_01.09`);
    cy.get('.me-2.form-control').type('12.0010');
    cy.url().should('include', '/it/TARMED/TARMED_01.09/tarmed_chapters/TARMED_01.09?query=12.0010');
    cy.get('.searchResult:nth-child(1)').should('contain.text', '12.0010');
  });

  it('search de drug text (aspir)', () => {
    cy.visit(`${baseUrl}/de/DRUG/drugs/all`);
    cy.get('.me-2.form-control').type('aspir');
    cy.url().should('include', '/de/DRUG/drugs/all?query=aspir');
    cy.get('.searchResult:nth-child(1)').should('contain.text', 'ASPIRIN');
  });

  it('search result is clickable', () => {
    cy.visit(baseUrl);
    cy.get('.me-2.form-control').type('A15');
    cy.url().should('include', '/de/ICD/ICD10-GM-2024/icd_chapters/ICD10-GM-2024?query=A15');
    cy.get('.searchResult:nth-child(1)').click();
    cy.url().should('include', '/de/ICD/ICD10-GM-2024/icds/A15?query=A15');
  });

  it('load more and reset search results', () => {
    cy.visit(baseUrl);
    cy.get('.me-2.form-control').type('neubildung');
    cy.get('.searchResult').should('have.length', 10);
    cy.get('#load-more-button').scrollIntoView().click();
    cy.get('.searchResult').should('have.length.greaterThan', 10);
    cy.get('#reset-button').scrollIntoView().click();
    cy.get('.searchResult').should('have.length', 10);
  });
});
