describe('Code attributes test suite for mobile version', function () {
    const baseUrl = Cypress.config("baseUrl");

    beforeEach(() => {
            cy.viewport(400, 800);
    });

    it('available and enabled attributes are displayed', function () {
        cy.visit(baseUrl + "/de/MIGEL/migels/10.01.01.00.1");
        cy.contains("Krücken für Erwachsene, ergonomischer Griff, Kauf").should('be.visible');
        cy.contains("Limitation").should('be.visible');
        cy.get("#limitation_attribute_value").should('have.text', "HVB Pflege: Vergütung nur bei Anwendung durch Pflegefachfrauen und Pflegefachmänner die den Beruf selbständig und auf eigene Rechnung ausüben");
        cy.contains("Einheit").should('be.visible');
        cy.get("#unit_attribute_value").should('have.text', "1 Paar");
        cy.contains("Ähnliche Codes").should('be.visible');
        cy.contains("Höchstvergütungsbetrag (HVB) Selbstanwendung (CHF)").should('be.visible');
        cy.get("#hvb_self_attribute_value").should('have.text', "35.13");
        cy.contains("Höchstvergütungsbetrag (HVB) Pflege (CHF)").should('be.visible');
        cy.get("#hvb_care_attribute_value").should('have.text', "29.86");
        cy.contains("Zuletzt auf medcodesearch.ch aktualisiert").should('be.visible');
        cy.contains("Gültig ab").should('be.visible');
        cy.contains("Gültig bis").should('be.visible');
    });

    it('show new code information', function () {
        cy.visit(baseUrl + '/de/CHOP/CHOP_2022/chops/00.4I.11?query=00.4I.11');
        cy.contains("Dies ist ein Neukode, der keine Vorgängercodes in Vorversionen hat.").should('be.visible');
        cy.visit(baseUrl + '/de/ICD/ICD10-GM-2021/icds/U13.5?query=u13.5');
        cy.contains("Dies ist ein Neukode, der keine Vorgängercodes in Vorversionen hat.").should('be.visible');
        cy.visit(baseUrl + '/de/ICD/ICD10-GM-2011/icds/R11?query=r11');
        cy.contains("Dies ist ein Neukode, der keine Vorgängercodes in Vorversionen hat.").should('not.exist');
        cy.visit(baseUrl + '/de/ICD/ICD10-GM-2021/icds/N19?query=N19');
        cy.contains("Dies ist ein Neukode, der keine Vorgängercodes in Vorversionen hat.").should('not.exist');
    });

    it('show drg code information', function () {
        cy.visit(baseUrl + '/de/SwissDRG/V12.0/drgs/B02A?query=A06A');
        cy.contains("Durchschnittliche Verweildauer (Tage)").should('be.visible');
        cy.contains("15").should('be.visible');
        cy.contains("Erster Tag mit Abschlag").should('be.visible');
        cy.contains("4").should('be.visible');
        cy.contains("Abschlag pro Tag").should('be.visible');
        cy.contains("0.845").should('be.visible');
        cy.contains("Erster Tag mit Zuschlag").should('be.visible');
        cy.contains("29").should('be.visible');
        cy.contains("Zuschlag pro Tag").should('be.visible');
        cy.contains("0.289").should('be.visible');

        cy.visit(baseUrl + '/fr/SwissDRG/V12.0/drgs/B02A?query=A06A');
        cy.contains("Durée de séjour moyenne (journées)").should('be.visible');
        cy.contains("Premier jour avec réduction").should('be.visible');
        cy.contains("Réduction journalier").should('be.visible');
        cy.contains("Premier jour avec supplément").should('be.visible');
        cy.contains("Supplément journalier").should('be.visible');

        cy.visit(baseUrl + '/it/SwissDRG/V12.0/drgs/B02A?query=A06A');
        cy.contains("Durata media di degenza (giorni)").should('be.visible');
        cy.contains("Primo giorno con riduzione").should('be.visible');
        cy.contains("Tasso di riduzione giornaliero").should('be.visible');
        cy.contains("Primo giorno con supplemento").should('be.visible');
        cy.contains("Supplemento giornaliero").should('be.visible');
        cy.contains("Elementi simili").should('be.visible');
    });

    it('SL code information', function () {
        cy.visit(baseUrl + '/de/DRUG/drugs/7680517950673?');
        cy.get("#SL_status").should('contain.text', "Status: SL");
        cy.get("#SL_public_price").should('contain.text', "Publikumspreis (CHF): 16.75");
        cy.get("#SL_date_added_in_sl").should('contain.text', "Zur SL hinzugefügt: 15.03.1997");
        cy.get("#SL_has_limitation").should('contain.text', "Limitation: Nein");
        cy.get("#SL_is_generica").should('contain.text', "Generika: Nein");
    });
});
