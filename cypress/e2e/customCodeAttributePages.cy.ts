describe('Code attributes test suite for desktop version and components with custom page', function () {
    const baseUrl = Cypress.config("baseUrl");

    beforeEach(() => {
        cy.viewport(1366, 768);
    });

    it('drg', function () {
        cy.visit(baseUrl + "/de/SwissDRG/V13.0/mdcs/V13.0");
        cy.get(".breadcrumb-item.active").should('have.text', "SwissDRG 13.0");
        cy.get("h3").should('have.text', "SwissDRG 13.0");

        cy.visit(baseUrl + "/de/SwissDRG/V13.0/drgs/I06A");
        cy.get('#drgOnlineManualLink')
            // Check href attribute value
            .should('have.attr', 'href', 'https://manual.swissdrg.org/de/13.3/drgs/I06A')
        cy.get('#drgDynamicsLink')
            // Check href attribute value
            .should('have.attr', 'href', 'https://drgdynamics.eonum.ch/drgs/name?code=I06A&version=V13.0&locale=de')

        cy.get("#attributesTable tr th").then(($ths) => {
            // @ts-ignore
            const ths = [...$ths].map((th) => th.innerText);
            expect(ths[0]).to.equal("Eintrag aus dem Fallpauschalenkatalog");
        });

        cy.get("#attributesTable tr td").then(($tds) => {
            // @ts-ignore
            const tds = [...$tds].map((td) => td.innerText);
            expect(tds[0]).to.equal("Partition");
            expect(tds[1]).to.equal("O");
            expect(tds[2]).to.equal("Kostengewicht");
            expect(tds[3]).to.equal("8.137");
            expect(tds[4]).to.equal("Durchschnittliche Verweildauer (Tage)");
            expect(tds[5]).to.equal("18.9");
            expect(tds[6]).to.equal("Erster Tag mit Abschlag");
            expect(tds[7]).to.equal("5");
            expect(tds[8]).to.equal("Abschlag pro Tag");
            expect(tds[9]).to.equal("0.697");
            expect(tds[10]).to.equal("Erster Tag mit Zuschlag");
            expect(tds[11]).to.equal("33");
            expect(tds[12]).to.equal("Zuschlag pro Tag");
            expect(tds[13]).to.equal("0.242");
            expect(tds[14]).to.equal("Verlegungsfallpauschale");
            expect(tds[15]).to.equal("Nein (0.244)");
            expect(tds[16]).to.equal("Ausnahme von Wiederaufnahme");
            expect(tds[17]).to.equal("Nein");
        });

        cy.contains("Komplexe Eingriffe an der Wirbelsäule mit äusserst schweren CC und Alter < 16 Jahre oder sehr komplexe WS-Eingriffe oder intensivmedizinischer Komplexbehandlung/IMCK > 184 Aufwandspunkte oder geriatrische Akutrehabilitation ab 14 Behandlungstage").should('exist');
    });

    it('supplement', function () {
        cy.visit(baseUrl + "/de/Supplements/V13.0/supplements/ZE-2024-04.10");
        cy.get(".breadcrumb-item.active").should('have.text', "ZE-2024-04.10");

        cy.get(".breadcrumb-item.breadLink").then(($elements) => {
            // @ts-ignore
            const elements = [...$elements].map((el) => el.textContent);
            expect(elements[0]).to.equal("Zusatzentgelte 13.0");
            expect(elements[1]).to.equal("ZE-2024-04");
        });

        cy.get("h3").should('have.text', "ZE-2024-04.10");

        cy.get("#siblings a").then(($links) => {
            // @ts-ignore
            const links = [...$links].map((el) => el.innerText);
            expect(links.sort()).to.deep.equal([
                "ZE-2024-04.01 (37.52): ",
                "ZE-2024-04.04 (37.6D.11): ",
                "ZE-2024-04.05 (37.6D.24): ",
                "ZE-2024-04.05 (37.6D.22): ",
                "ZE-2024-04.05 (37.6D.23): ",
                "ZE-2024-04.08 (37.6A.11): ",
                "ZE-2024-04.08 (37.6A.12): ",
                "ZE-2024-04.09 (37.6A.21): ",
                "ZE-2024-04.13 (37.6A.35): ",
                "ZE-2024-04.13 (37.6A.37): ",
                "ZE-2024-04.14 (37.6A.34): ",
                "ZE-2024-04.14 (37.6A.36): ",
                "ZE-2024-04.15 (37.6A.3A): ",
                "ZE-2024-04.16 (37.6A.38): "
            ].sort());
        });

        cy.get("#siblings ul>li:nth-child(4)> a").click();
        cy.url().should('eq', baseUrl + "/de/Supplements/V13.0/supplements/ZE-2024-04.05");
    });

    it('rcg', function () {
        cy.visit(baseUrl + "/de/Reha/REHA_2.0/arcgs/REHA_2.0");
        cy.get(".breadcrumb-item.active").should('have.text', "ST Reha 2.0");
        cy.get("h3").should('have.text', "ST Reha 2.0");

        cy.visit(baseUrl + "/de/Reha/REHA_2.0/rcgs/TR19A");
        cy.get('#rcgOnlineManualLink')
            // Check href attribute value
            .should('have.attr', 'href', 'https://manual.swissdrg.org/de/r2.3/rcgs/TR19A')

        cy.get("#attributesTable tr th").then(($ths) => {
            // @ts-ignore
            const ths = [...$ths].map((th) => th.innerText);
            expect(ths[0]).to.equal("Eintrag aus dem RCG Katalog");
        });

        cy.get("#attributesTable tr td").then(($tds) => {
            // @ts-ignore
            const tds = [...$tds].map((td) => td.innerText);
            expect(tds[0]).to.equal("Anzahl Phasen");
            expect(tds[1]).to.equal("1");
            expect(tds[2]).to.equal("Tageskostengewicht von Phase 1");
            expect(tds[3]).to.equal("0.878");
        });

        cy.get("#siblings a").then(($links) => {
            // @ts-ignore
            const links = [...$links].map((el) => el.innerText);
            expect(links.sort()).to.deep.equal(["TR19B: "]);
        });

        cy.contains("Kardiale Rehabilitation").should('exist');
    });

    it('test constraint icds linking for supplements', function () {
        cy.visit(baseUrl + "/de/Supplements/V13.0/supplements/ZE-2024-30.50");
        cy.get("#CONSTRAINT_ICDS > h5").should('have.text', "Vorausgesetzte ICD-Codes");
        // Uncomment and fix once the code linking is implemented
        // cy.get("#CONSTRAINT_ICDS ul>li:nth-child(3)> a").click();
        // cy.url().should('eq', baseUrl + "/de/ICD/ICD10-GM-2024/icds/D65.2");
    });

    it('test constraint chop linking for supplements', function () {
        cy.visit(baseUrl + "/de/Supplements/V13.0/supplements/ZE-2024-108.01");
        cy.get("#CONSTRAINT_CHOPS > h5").should('have.text', "Vorausgesetzte CHOP-Codes");
        // Uncomment and fix once the code linking is implemented
        // cy.get("#CONSTRAINT_CHOPS ul>li:nth-child(3)> a").click();
        // cy.url().should('eq', baseUrl + "/de/CHOP/CHOP_2024/chops/92.26.20");
    });

    it('test relevant codes linking for supplements', function () {
        cy.visit(baseUrl + "/de/Supplements/V13.0/supplements/ZE-2024-01.01");
        cy.get("#RELEVANT_CODES > h5").should('have.text', "Relevante Codes (CHOP)");
        // Uncomment and fix once the code linking is implemented
        // cy.get("#relevantChopCodes ul>li:nth-child(4)> a").click();
        // cy.url().should('eq', baseUrl + "/de/CHOP/CHOP_2024/chops/39.95.62");

        cy.visit(baseUrl + "/de/Supplements/V13.0/supplements/ZE-2024-11.27");
        cy.get("#RELEVANT_CODES > h5").should('have.text', "Relevante Codes (ATC)");
    });

    it('test excluded drgs linking for supplements', function () {
        cy.visit(baseUrl + "/de/Supplements/V13.0/supplements/ZE-2024-01.01");
        cy.get("#EXCLUDED_DRGS > h5").should('have.text', "(Basis-)DRGs, welche die Abrechnung des ZE ausschliessen");
        // Uncomment and fix once the code linking is implemented
        // cy.get("#EXCLUDED_DRGS ul>li:nth-child(1)>a").click();
        // cy.url().should('eq', baseUrl + "/de/SwissDrg/V13.0/adrgs/L60");
    });
});
