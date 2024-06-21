// TODO: Viewport should be set via config
describe('Default test suite for mobile version, testing general navigation via clicks', function () {
    const baseUrl = Cypress.config("baseUrl");
    const n = 1000;

    beforeEach(() => {
        cy.viewport(400, 800);
    });

    it('click on logo mobile', function() {
        cy.visit(`${baseUrl}/de/SwissDRG/V4.0/mdcs/V4.0`);
        cy.contains("SwissDRG 4.0");
        cy.get("#logo").click();
        // TODO: Adapt when new ICD version seeded.
        cy.contains("ICD10-GM-2022");
    });

    it('click through mobile buttons (de)', function() {
        // Load base URL
        cy.visit(baseUrl);
        // Change to CHOP 2016.
        cy.get("#catalog_button").should('be.visible').click();
        cy.get("#CHOP_button").click();
        cy.get("#version_button").should('be.visible').click();
        cy.get("#CHOP_2016").should('be.visible').click();
        cy.wait(n);
        cy.contains("CHOP 2016");
        cy.url().should('eq', `${baseUrl}/de/CHOP/CHOP_2016/chop_chapters/CHOP_2016`);
        // Change to CHOP 2020.
        cy.get("#version_button").should('be.visible').click();
        cy.get("#CHOP_2020").should('be.visible').click();
        cy.wait(n);
        cy.contains("CHOP 2020");
        cy.url().should('eq', `${baseUrl}/de/CHOP/CHOP_2020/chop_chapters/CHOP_2020`);
        // Change to Swissdrg V7.0.
        cy.get("#catalog_button").should('be.visible').click();
        cy.get("#SwissDRG_button").should('be.visible').click();
        cy.get("#version_button").should('be.visible').click();
        cy.get("#V70").should('be.visible').click();
        cy.wait(n);
        cy.contains("SwissDRG 7.0");
        cy.url().should('eq', `${baseUrl}/de/SwissDRG/V7.0/mdcs/V7.0`);
        // Change to TARMED.
        cy.get("#catalog_button").should('be.visible').click();
        cy.get("#TARMED_button").click();
        cy.wait(n);
        cy.contains("TARMED");
        cy.url().should('eq', `${baseUrl}/de/TARMED/TARMED_01.09/tarmed_chapters/TARMED_01.09`);
    });

    it('icd clicking from I to A00.0 (de, 2022)', function () {
        cy.visit(`${baseUrl}/de/ICD/ICD10-GM-2022/icd_chapters/ICD10-GM-2022`);
        // Click on I (first ICD chapter).
        cy.get("ul>li:first-child>a").should('be.visible').click();
        cy.wait(n);
        cy.contains("Bestimmte infektiöse und parasitäre Krankheiten");
        cy.url().should('eq', `${baseUrl}/de/ICD/ICD10-GM-2022/icd_chapters/I`);
        // Click on A00-A09 (first group of ICD Chapter I).
        cy.get("ul>li:first-child>a").should('be.visible');
        // We have to scroll down one window height since otherwise selector is out of viewport...
        cy.scrollTo(0, window.innerHeight);
        cy.wait(n);
        cy.get("ul>li:first-child>a").click();
        cy.wait(n);
        cy.contains("Infektiöse Darmkrankheiten");
        cy.url().should('eq', `${baseUrl}/de/ICD/ICD10-GM-2022/icd_groups/A00-A09`);
        // Click on A00 (first nonterminal of icd group A00-A09).
        cy.get("ul>li:first-child>a").should('be.visible').click();
        cy.wait(n);
        cy.contains("Cholera");
        cy.url().should('eq', `${baseUrl}/de/ICD/ICD10-GM-2022/icds/A00`);
        // Click on A00.0 (first code of ICD nonterminal A00).
        cy.get("ul>li:first-child>a").should('be.visible').click();
        cy.wait(n);
        cy.contains("Cholera durch Vibrio cholerae O:1, Biovar cholerae");
        cy.url().should('eq', `${baseUrl}/de/ICD/ICD10-GM-2022/icds/A00.0`);
        // Click on A00.1 (first sibling).
        cy.get("ul>li:first-child>a").should('be.visible').click();
        cy.wait(n);
        cy.contains("Cholera durch Vibrio cholerae O:1, Biovar eltor");
        cy.url().should('eq', `${baseUrl}/de/ICD/ICD10-GM-2022/icds/A00.1`);
    });

    it('icd clicking from I to A00.0 (fr, 2022)', function () {
        cy.visit(`${baseUrl}/fr/ICD/ICD10-GM-2022/icd_chapters/ICD10-GM-2022`);
        // Click on I (first ICD chapter).
        cy.get("ul>li:first-child>a").should('be.visible').click();
        cy.wait(n);
        cy.contains("Certaines maladies infectieuses et parasitaires");
        cy.url().should('eq', `${baseUrl}/fr/ICD/ICD10-GM-2022/icd_chapters/I`);
        // Click on A00-A09 (first group of ICD Chapter I).
        cy.get("ul>li:first-child>a").should('be.visible');
        // We have to scroll down one window height since otherwise selector is out of viewport...
        cy.scrollTo(0, window.innerHeight);
        cy.wait(n);
        cy.get("ul>li:first-child>a").click();
        cy.wait(n);
        cy.contains("Maladies intestinales infectieuses");
        cy.url().should('eq', `${baseUrl}/fr/ICD/ICD10-GM-2022/icd_groups/A00-A09`);
        // Click on A00 (first nonterminal of icd group A00-A09).
        cy.get("ul>li:first-child>a").should('be.visible').click();
        cy.wait(n);
        cy.contains("Choléra");
        cy.url().should('eq', `${baseUrl}/fr/ICD/ICD10-GM-2022/icds/A00`);
        // Click on A00.0 (first code of ICD nonterminal A00).
        cy.get("ul>li:first-child>a").should('be.visible').click();
        cy.wait(n);
        cy.contains("A Vibrio cholerae 01, biovar cholerae");
        cy.url().should('eq', `${baseUrl}/fr/ICD/ICD10-GM-2022/icds/A00.0`);
        // Click on A00.1 (first sibling).
        cy.get("ul>li:first-child>a").should('be.visible').click();
        cy.wait(n);
        cy.contains("A Vibrio cholerae 01, biovar El Tor");
        cy.url().should('eq', `${baseUrl}/fr/ICD/ICD10-GM-2022/icds/A00.1`);
    });

    it('icd clicking from I to A00.0 (it, 2022)', function () {
        cy.visit(`${baseUrl}/it/ICD/ICD10-GM-2022/icd_chapters/ICD10-GM-2022`);
        // Click on I (first ICD chapter).
        cy.get("ul>li:first-child>a").should('be.visible').click();
        cy.wait(n);
        cy.contains("Alcune malattie infettive e parassitarie");
        cy.url().should('eq', `${baseUrl}/it/ICD/ICD10-GM-2022/icd_chapters/I`);
        // Click on A00-A09 (first group of ICD Chapter I).
        cy.get("ul>li:first-child>a").should('be.visible');
        // We have to scroll down one window height since otherwise selector is out of viewport...
        cy.scrollTo(0, window.innerHeight);
        cy.wait(n);
        cy.get("ul>li:first-child>a").click();
        cy.wait(n);
        cy.contains("Malattie infettive intestinali");
        cy.url().should('eq', `${baseUrl}/it/ICD/ICD10-GM-2022/icd_groups/A00-A09`);
        // Click on A00 (first nonterminal of icd group A00-A09).
        cy.get("ul>li:first-child>a").should('be.visible').click();
        cy.wait(n);
        cy.contains("Colera");
        cy.url().should('eq', `${baseUrl}/it/ICD/ICD10-GM-2022/icds/A00`);
        // Click on A00.0 (first code of ICD nonterminal A00).
        cy.get("ul>li:first-child>a").should('be.visible').click();
        cy.wait(n);
        cy.contains("Colera da Vibrio cholerae O:1, biotipo del colera");
        cy.url().should('eq', `${baseUrl}/it/ICD/ICD10-GM-2022/icds/A00.0`);
        // Click on A00.1 (first sibling).
        cy.get("ul>li:first-child>a").should('be.visible').click();
        cy.wait(n);
        cy.contains("Colera da Vibrio cholerae O:1, biotipo El Tor");
        cy.url().should('eq', `${baseUrl}/it/ICD/ICD10-GM-2022/icds/A00.1`);
    });

    it('icd clicking from I to A00.0 (en, 2022)', function () {
        cy.visit(`${baseUrl}/en/ICD/ICD10-GM-2022/icd_chapters/ICD10-GM-2022`);
        // Click on I (first ICD chapter).
        cy.get("ul>li:first-child>a").click();
        cy.wait(n);
        cy.contains("Certain infectious and parasitic diseases");
        cy.url().should('eq', `${baseUrl}/en/ICD/ICD10-GM-2022/icd_chapters/I`);
        // Click on A00-A09 (first group of ICD Chapter I).
        cy.get("ul>li:first-child>a").should('be.visible').click();
        cy.wait(n);
        cy.contains("Intestinal infectious diseases");
        cy.url().should('eq', `${baseUrl}/en/ICD/ICD10-GM-2022/icd_groups/A00-A09`);
        // Click on A00 (first nonterminal of icd group A00-A09).
        cy.get("ul>li:first-child>a").should('be.visible').click();
        cy.wait(n);
        cy.contains("Cholera");
        cy.url().should('eq', `${baseUrl}/en/ICD/ICD10-GM-2022/icds/A00`);
        // Click on A00.0 (first code of ICD nonterminal A00).
        cy.get("ul>li:first-child>a").should('be.visible').click();
        cy.wait(n);
        cy.contains("Cholera due to Vibrio cholerae 01, biovar cholerae");
        cy.url().should('eq', `${baseUrl}/en/ICD/ICD10-GM-2022/icds/A00.0`);
        // Click on A00.1 (first sibling).
        cy.get("ul>li:first-child>a").should('be.visible').click();
        cy.wait(n);
        cy.contains("Cholera due to Vibrio cholerae 01, biovar eltor");
        cy.url().should('eq', `${baseUrl}/en/ICD/ICD10-GM-2022/icds/A00.1`);
    });

    // If last ICD version is newer than 2022, this test has to be adapted.
    it ('call to base URL', function() {
        cy.visit(baseUrl);
        cy.url().should('eq', `${baseUrl}/de/ICD/ICD10-GM-2022/icd_chapters/ICD10-GM-2022`);
    });
});
