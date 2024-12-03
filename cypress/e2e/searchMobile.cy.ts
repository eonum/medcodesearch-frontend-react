describe('Search test suite for mobile version', function () {
    const baseUrl = Cypress.config('baseUrl');

    beforeEach(() => {
        cy.viewport(450, 1200);
    });

    it('search de icd code (A15.3)', function() {
        cy.visit(baseUrl);
        cy.get(".me-2.form-control").type("A15.3");
        cy.get('#searchResults').should('be.visible');
        cy.url().should('eq', `${baseUrl}/de/ICD/ICD10-GM-2024/icd_chapters/ICD10-GM-2024?query=A15.3`);
        cy.get(".searchResult:nth-child(1)").should('contain.text', "A15.3");
    });

    it('search it icd text (stomaco)', function() {
        cy.visit(`${baseUrl}/it/ICD/ICD10-GM-2020/icd_chapters/ICD10-GM-2020`);
        cy.get(".me-2.form-control").type("stomaco");
        cy.get('#searchResults').should('be.visible');
        cy.url().should('eq', `${baseUrl}/it/ICD/ICD10-GM-2020/icd_chapters/ICD10-GM-2020?query=stomaco`);
        cy.get(".searchResult:nth-child(1)").should('contain.text', "stomaco");
    });

    it('search non existing text / code', function() {
        cy.visit(`${baseUrl}/de/ICD/ICD10-GM-2020/icd_chapters/ICD10-GM-2020`);
        cy.get(".me-2.form-control").type("$$$");
        cy.get('#searchResults').should('be.visible');
        cy.url().should('eq', `${baseUrl}/de/ICD/ICD10-GM-2020/icd_chapters/ICD10-GM-2020?query=%24%24%24`);
        cy.get(".searchResult:nth-child(1)").should('have.text', "Die Suche erzielte keinen Treffer.");
    });

    it('search fr chop text (robot)', function() {
        cy.visit(`${baseUrl}/fr/CHOP/CHOP_2022/chop_chapters/CHOP_2022`);
        cy.get(".me-2.form-control").type("robot");
        cy.get('#searchResults').should('be.visible');
        cy.url().should('eq', `${baseUrl}/fr/CHOP/CHOP_2022/chop_chapters/CHOP_2022?query=robot`);
        cy.get(".searchResult:nth-child(1)").should('contain.text', "robot opératoire");
    });

    it('searches for tarmed code 12.0010', () => {
        cy.visit(`${baseUrl}/it/TARMED/TARMED_01.09/tarmed_chapters/TARMED_01.09`);
        cy.get(".me-2.form-control").type('12.0010');
        // Wait for search results
        cy.get('#searchResults').should('be.visible');
        cy.url().should('eq', `${baseUrl}/it/TARMED/TARMED_01.09/tarmed_chapters/TARMED_01.09?query=12.0010`);
        cy.get(".searchResult:nth-child(1)").should('contain.text', "12.0010");
    });


    it('search de drug text (aspir)', function() {
        cy.visit(`${baseUrl}/de/DRUG/drugs/all`);
        cy.get(".me-2.form-control").type("aspir");
        cy.get('#searchResults').should('be.visible');
        cy.url().should('eq', `${baseUrl}/de/DRUG/drugs/all?query=aspir`);
        cy.get(".searchResult:nth-child(1)").should('contain.text', "ASPIRIN");
    });

    it('search result is clickable', function() {
        cy.visit(baseUrl);
        cy.get(".me-2.form-control").type("A15");
        cy.get('#searchResults').should('be.visible');
        cy.url().should('eq', `${baseUrl}/de/ICD/ICD10-GM-2024/icd_chapters/ICD10-GM-2024?query=A15`);
        // Check the collapse button text (should be expanded and thus show "Suchresultate einblenden").
        cy.get("#collapse-button").should('be.visible').and('have.text', "Suchresultate ausblenden")
        // Click the first search result
        cy.get(".searchResult:nth-child(1)").click();
        cy.get('#searchResults').should('be.visible');
        cy.get("#collapse-button").should('have.text', "Suchresultate einblenden");
        cy.url().should('eq', `${baseUrl}/de/ICD/ICD10-GM-2024/icds/A15?query=A15`);
    });

    it('load more and reset search results', function() {
        cy.visit(`${baseUrl}/de/ICD/ICD10-GM-2024/icd_chapters/ICD10-GM-2024?query=neubildung`);
        cy.get("#collapse-button").then(($btn) => {
            if ($btn.text() === "Suchresultate einblenden") {
                cy.wrap($btn).click();
            }
        });
        // Wait for the initial search results to be present
        cy.get('.searchResult').should('have.length', 10);
        // Click the "Load More" button after scrolling it into view.
        cy.get('#load-more-button').scrollIntoView().click();
        // Wait for the additional search results to be present
        cy.get('.searchResult').should('have.length.greaterThan', 10);
    });
});
