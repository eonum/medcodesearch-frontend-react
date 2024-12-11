describe('Default test suite, testing general navigation via clicks', function () {
    let baseUrl = Cypress.config('baseUrl');

    beforeEach(() => {
        cy.viewport(1366, 768);
    });

    it('clicking from one catalog to another (de)', function () {
        cy.visit(baseUrl);
        cy.contains('ICD10-GM');
        cy.contains('IX: Krankheiten des Kreislaufsystems');
        cy.contains('Untergeordnete Codes');
        cy.url().should('eq', baseUrl + "/de/ICD/ICD10-GM-2024/icd_chapters/ICD10-GM-2024");
        cy.get('#catalog_button').click();
        cy.get('#CHOP_button').click();
        cy.contains('CHOP');
        cy.contains('C14: Operationen am Bewegungsapparat (76–84)');
        cy.contains('Untergeordnete Codes');
        cy.url().should('eq', baseUrl + "/de/CHOP/CHOP_2025/chop_chapters/CHOP_2025");
        cy.get('#catalog_button').click();
        cy.get('#SwissDRG_button').click();
        cy.contains('SwissDRG');
        cy.contains('MDC 22:');
        cy.contains('Verbrennungen');
        cy.contains('Untergeordnete Codes');
        cy.url().should('eq', baseUrl + "/de/SwissDRG/V14.0/mdcs/V14.0");
        cy.get('#catalog_button').click();
        cy.get("#TARMED_button").click();
        cy.contains('TARMED');
        cy.contains('24: Diagnostik und Therapie des Bewegungsapparates');
        cy.contains('Untergeordnete Codes');
        cy.url().should('eq', baseUrl + "/de/TARMED/TARMED_01.09/tarmed_chapters/TARMED_01.09");
        cy.get('#catalog_button').click();
        cy.get('#MIGEL_button').click();
        cy.contains('MiGeL');
        cy.contains('13: HOERHILFEN');
        cy.contains('Untergeordnete Codes');
        cy.url().should('match', new RegExp(baseUrl + "/de/MIGEL/migels/all"));
        cy.get("#datepicker").should('exist');
        cy.get('#catalog_button').click();
        cy.get('#AL_button').click();
        cy.url().should('match', new RegExp(baseUrl + "/de/AL/als/all"));
        cy.contains('AL');
        cy.contains('C: Mikrobiologie');
        cy.contains('Untergeordnete Codes');
        cy.get("#datepicker").should('exist');
    });

    it('switch ICD versions (de)', function () {
        cy.visit(baseUrl);
        cy.get("#ICD10-GM-2018").should('not.exist');
        cy.get("#version_button").click();
        cy.get("#ICD10-GM-2018").click();
        cy.contains('ICD10-GM-2018');
        cy.contains('XV: Schwangerschaft, Geburt und Wochenbett');
        cy.get("#version_button").click();
        cy.get("#ICD10-GM-2024").click();
        cy.contains('ICD10-GM-2024');
        cy.contains('XXII: Schlüsselnummern für besondere Zwecke');
    });

    it('changing languages', function () {
        cy.visit(baseUrl);
        cy.get(".language-btn:nth-child(2)").click();
        cy.contains('Eléments subordonnés');
        cy.contains('XIX: Lésions traumatiques, empoisonnements et certaines autres conséquences de causes externes');
        cy.get(".language-btn:nth-child(3)").click();
        cy.contains('Elementi subordinati');
        cy.contains('XVIII: Sintomi, segni e risultati anormali di esami clinici e di laboratorio, non classificati altrove');
        cy.get(".language-btn:nth-child(4)").click();
        cy.contains('Subordinate codes');
        cy.contains('VII: Diseases of the eye and adnexa');
        cy.get("ul>li:nth-child(1)>.link").click();
        cy.contains('Certain infectious and parasitic diseases');
        cy.contains('A50-A64: Infections with a predominantly sexual mode of transmission');
        cy.get(".language-btn:nth-child(2)").click();
        cy.contains('Certaines maladies infectieuses et parasitaires');
    });

    it('moving from a specific catalog version to other versions of other catalogs', function() {
        cy.visit(baseUrl);
        cy.get("#catalog_button").click();
        cy.get("#CHOP_button").click();
        cy.get("#version_button").click();
        cy.get("#CHOP_2020").should('be.visible').click();
        cy.contains("CHOP 2020");
        cy.get("#catalog_button").click();
        cy.get("#SwissDRG_button").click();
        cy.get("#version_button").click();
        cy.get("#V80").should('be.visible').click();
        cy.contains("SwissDRG 8.0");
        cy.get("#catalog_button").click();
        cy.get("#AL_button").click();
        cy.contains("A: Chemie/Hämatologie/Immunologie");
        cy.get("#catalog_button").click();
        cy.get("#ICD_button").click();
        cy.get("#version_button").click();
        cy.get("#ICD10-GM-2016").should('be.visible').click();
        cy.contains("ICD10-GM-2016");
    });

    it('go to base url when clicking on logo', function() {
        cy.visit(baseUrl + '/de/SwissDRG/V4.0/mdcs/V4.0');
        cy.contains("SwissDRG 4.0");
        cy.get("#logo").click();
        cy.contains("ICD10-GM-2024");
    });

    it('icd clicking from I to A00.0 (de, 2022)', function() {
        cy.visit(baseUrl + "/de/ICD/ICD10-GM-2024/icd_chapters/ICD10-GM-2024");
        cy.get("ul>li:first-child>a").click();
        cy.contains("Bestimmte infektiöse und parasitäre Krankheiten");
        cy.url().should('eq', baseUrl + '/de/ICD/ICD10-GM-2024/icd_chapters/I');
        cy.get("ul>li:first-child>a").click();
        cy.contains("Infektiöse Darmkrankheiten");
        cy.url().should('eq', baseUrl + '/de/ICD/ICD10-GM-2024/icd_groups/A00-A09');
        cy.get("ul>li:first-child>a").click();
        cy.contains("Cholera");
        cy.url().should('eq', baseUrl + '/de/ICD/ICD10-GM-2024/icds/A00');
        cy.get("ul>li:first-child>a").click();
        cy.contains("Cholera durch Vibrio cholerae O:1, Biovar cholerae");
        cy.url().should('eq', baseUrl + '/de/ICD/ICD10-GM-2024/icds/A00.0');
        cy.get("ul>li:first-child>a").click();
        cy.contains("Cholera durch Vibrio cholerae O:1, Biovar eltor");
        cy.url().should('eq', baseUrl + '/de/ICD/ICD10-GM-2024/icds/A00.1');
    });

    it('icd clicking from I to A00.0 (fr, 2022)', function() {
        cy.visit(baseUrl + "/fr/ICD/ICD10-GM-2024/icd_chapters/ICD10-GM-2024");
        cy.get("ul>li:first-child>a").click();
        cy.contains("Certaines maladies infectieuses et parasitaires");
        cy.url().should('eq', baseUrl + '/fr/ICD/ICD10-GM-2024/icd_chapters/I');
        cy.get("ul>li:first-child>a").click();
        cy.contains("Maladies intestinales infectieuses");
        cy.url().should('eq', baseUrl + '/fr/ICD/ICD10-GM-2024/icd_groups/A00-A09');
        cy.get("ul>li:first-child>a").click();
        cy.contains("Choléra");
        cy.url().should('eq', baseUrl + '/fr/ICD/ICD10-GM-2024/icds/A00');
        cy.get("ul>li:first-child>a").click();
        cy.contains("A Vibrio cholerae 01, biovar cholerae");
        cy.url().should('eq', baseUrl + '/fr/ICD/ICD10-GM-2024/icds/A00.0');
        cy.get("ul>li:first-child>a").click();
        cy.contains("A Vibrio cholerae 01, biovar El Tor");
        cy.url().should('eq', baseUrl + '/fr/ICD/ICD10-GM-2024/icds/A00.1');
    });

    it('icd clicking from I to A00.0 (it, 2022)', function() {
        cy.visit(baseUrl + "/it/ICD/ICD10-GM-2024/icd_chapters/ICD10-GM-2024");
        cy.get("ul>li:first-child>a").click();
        cy.contains("Alcune malattie infettive e parassitarie");
        cy.url().should('eq', baseUrl + '/it/ICD/ICD10-GM-2024/icd_chapters/I');
        cy.get("ul>li:first-child>a").click();
        cy.contains("Malattie infettive intestinali");
        cy.url().should('eq', baseUrl + '/it/ICD/ICD10-GM-2024/icd_groups/A00-A09');
        cy.get("ul>li:first-child>a").click();
        cy.contains("Colera");
        cy.url().should('eq', baseUrl + '/it/ICD/ICD10-GM-2024/icds/A00');
        cy.get("ul>li:first-child>a").click();
        cy.contains("Colera da Vibrio cholerae O:1, biotipo del colera");
        cy.url().should('eq', baseUrl + '/it/ICD/ICD10-GM-2024/icds/A00.0');
        cy.get("ul>li:first-child>a").click();
        cy.contains("Colera da Vibrio cholerae O:1, biotipo El Tor");
        cy.url().should('eq', baseUrl + '/it/ICD/ICD10-GM-2024/icds/A00.1');
    });

    it('icd clicking from I to A00.0 (en, 2022)', function () {
        cy.visit(`${baseUrl}/en/ICD/ICD10-GM-2024/icd_chapters/ICD10-GM-2024`);
        // Click on I (first ICD chapter).
        cy.get("ul>li:first-child>a").click();
        cy.contains("Certain infectious and parasitic diseases");
        cy.url().should('eq', `${baseUrl}/en/ICD/ICD10-GM-2024/icd_chapters/I`);
        // Click on A00-A09 (first group of ICD Chapter I).
        cy.get("ul>li:first-child>a").should('be.visible').click();
        cy.contains("Intestinal infectious diseases");
        cy.url().should('eq', `${baseUrl}/en/ICD/ICD10-GM-2024/icd_groups/A00-A09`);
        // Click on A00 (first nonterminal of icd group A00-A09).
        cy.get("ul>li:first-child>a").should('be.visible').click();
        cy.contains("Cholera");
        cy.url().should('eq', `${baseUrl}/en/ICD/ICD10-GM-2024/icds/A00`);
        // Click on A00.0 (first code of ICD nonterminal A00).
        cy.get("ul>li:first-child>a").should('be.visible').click();
        cy.contains("Cholera due to Vibrio cholerae 01, biovar cholerae");
        cy.url().should('eq', `${baseUrl}/en/ICD/ICD10-GM-2024/icds/A00.0`);
        // Click on A00.1 (first sibling).
        cy.get("ul>li:first-child>a").should('be.visible').click();
        cy.contains("Cholera due to Vibrio cholerae 01, biovar eltor");
        cy.url().should('eq', `${baseUrl}/en/ICD/ICD10-GM-2024/icds/A00.1`);
    });

    // If last ICD version is newer than 2022, this test has to be adapted.
    it ('call to base URL', function() {
        cy.visit(baseUrl);
        cy.url().should('eq', `${baseUrl}/de/ICD/ICD10-GM-2024/icd_chapters/ICD10-GM-2024`);
    });
});
