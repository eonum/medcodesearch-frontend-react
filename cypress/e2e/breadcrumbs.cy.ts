describe('Breadcrumb test suite for mobile version', function () {
    const baseUrl = Cypress.config("baseUrl");
    const n = 1000;

    beforeEach(() => {
        cy.viewport(400, 800);
    });

    it('clicking from DRG G72B to base chapter via breadcrumbs (de)', function () {
        // Move to G72B
        cy.visit(baseUrl + '/de/SwissDRG/V10.0/drgs/G72B');
        // Move one level up via breadcrumb.
        cy.get('.breadcrumb-item > a').contains('G72').click();
        cy.contains("Andere leichte bis moderate Erkrankungen der Verdauungsorgane oder Abdominalschmerz oder mesenteriale Lymphadenitis").should('be.visible');
        cy.url().should('eq', baseUrl + '/de/SwissDRG/V10.0/adrgs/G72');
        // Move one level up via breadcrumb.
        cy.get('.breadcrumb-item > a').contains('Medizinische Partition').click();
        cy.contains("MDC 06 Medizinische Partition").should('be.visible');
        cy.url().should('eq', baseUrl + '/de/SwissDRG/V10.0/partitions/G_M');
        // Move one level up via breadcrumb.
        cy.get('.breadcrumb-item > a').contains('MDC 06').click();
        cy.contains("Krankheiten und Störungen der Verdauungsorgane").should('be.visible');
        cy.url().should('eq', baseUrl + '/de/SwissDRG/V10.0/mdcs/06');
        // Move one level up via breadcrumb.
        cy.get('.breadcrumb-item > a').contains('SwissDRG 10.0').click();
        cy.contains("MDC 01").should('be.visible');
        cy.url().should('eq', baseUrl + '/de/SwissDRG/V10.0/mdcs/V10.0');
    });

    it('clicking from DRG G72B to base chapter via breadcrumbs (fr)', function () {
        // Move to G72B
        cy.visit(baseUrl + '/fr/SwissDRG/V10.0/drgs/G72B');
        // Move one level up via breadcrumb.
        cy.get('.breadcrumb-item > a').contains('G72').click();
        cy.contains("Autres affections bénignes à modérées des organes digestifs ou douleur abdominale ou adénite mésentérique").should('be.visible');
        cy.url().should('eq', baseUrl + '/fr/SwissDRG/V10.0/adrgs/G72');
        // Move one level up via breadcrumb.
        cy.get('.breadcrumb-item > a').contains('Partition médicale').click();
        cy.contains("MDC 06 Partition médicale").should('be.visible');
        cy.url().should('eq', baseUrl + '/fr/SwissDRG/V10.0/partitions/G_M');
        // Move one level up via breadcrumb.
        cy.get('.breadcrumb-item > a').contains('MDC 06').click();
        cy.contains("Maladies et troubles des organes digestifs").should('be.visible');
        cy.url().should('eq', baseUrl + '/fr/SwissDRG/V10.0/mdcs/06');
        // Move one level up via breadcrumb.
        cy.get('.breadcrumb-item > a').contains('SwissDRG 10.0').click();
        cy.contains("MDC 01").should('be.visible');
        cy.url().should('eq', baseUrl + '/fr/SwissDRG/V10.0/mdcs/V10.0');
    });

    it('clicking from DRG G72B to base chapter via breadcrumbs (it)', function () {
        // Move to G72B
        cy.visit(baseUrl + '/it/SwissDRG/V10.0/drgs/G72B');
        // Move one level up via breadcrumb.
        cy.get('.breadcrumb-item > a').contains('G72').click();
        cy.contains("Altre malattie da lievi a moderate dell'apparato digerente o dolore addominale o linfadenite mesenterica").should('be.visible');
        cy.url().should('eq', baseUrl + '/it/SwissDRG/V10.0/adrgs/G72');
        // Move one level up via breadcrumb.
        cy.get('.breadcrumb-item > a').contains('Partizione medica').click();
        cy.contains("MDC 06 Partizione medica").should('be.visible');
        cy.url().should('eq', baseUrl + '/it/SwissDRG/V10.0/partitions/G_M');
        // Move one level up via breadcrumb.
        cy.get('.breadcrumb-item > a').contains('MDC 06').click();
        cy.contains("Malattie e disturbi dell'apparato digerente").should('be.visible');
        cy.url().should('eq', baseUrl + '/it/SwissDRG/V10.0/mdcs/06');
        // Move one level up via breadcrumb.
        cy.get('.breadcrumb-item > a').contains('SwissDRG 10.0').click();
        cy.contains("MDC 01").should('be.visible');
        cy.url().should('eq', baseUrl + '/it/SwissDRG/V10.0/mdcs/V10.0');
    });

    it('clicking from MiGel 13.01.01.00.1 to base via breadcrumbs (de)', function () {
        // Move to MiGel 13.01.01.00.1
        cy.visit(baseUrl + '/de/MIGEL/migels/13.01.01.00.1');
        // Move one level up via breadcrumb.
        cy.get('.breadcrumb-item > a').contains('13.01').click();
        cy.contains("Hörgeräte").should('be.visible');
        cy.url().should('eq', baseUrl + '/de/MIGEL/migels/13.01');
        // Move one level up via breadcrumb.
        cy.get('.breadcrumb-item > a').contains('13').click();
        cy.contains("HOERHILFEN").should('be.visible');
        cy.url().should('eq', baseUrl + '/de/MIGEL/migels/13');
        // Move one level up via breadcrumb.
        cy.get('.breadcrumb-item > a').contains('MiGeL').click();
        cy.contains("ABSAUGGERAETE").should('be.visible');
        cy.url().should('eq', baseUrl + '/de/MIGEL/migels/MIGEL');
    });
});
