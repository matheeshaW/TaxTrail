describe("Regional Development Flow Test", () => {
  it("logs in as admin, creates a regional data record, then deletes it", () => {
    const adminEmail = Cypress.env("adminEmail");
    const adminPassword = Cypress.env("adminPassword");

    if (!adminEmail || !adminPassword) {
      throw new Error("Missing Cypress env: adminEmail and adminPassword");
    }

    const uniqueYear = String(2010 + Math.floor(Math.random() * 20)); 
    const uniqueIncome = (40000 + Math.floor(Math.random() * 9999)).toString();

    cy.intercept("POST", "**/v1/regional-development").as("createRecord");
    cy.intercept("GET", "**/v1/regional-development**").as("getRecords");
    cy.intercept("DELETE", "**/v1/regional-development/*").as("deleteRecord");

    cy.visit("/login");
    cy.contains("label", "Email")
      .parent()
      .find('input[type="email"]')
      .type(adminEmail);
    cy.contains("label", "Password")
      .parent()
      .find("input")
      .first()
      .type(adminPassword, { log: false });
    cy.contains("button", "Sign In").click();

    cy.url().should("include", "/dashboard");
    cy.contains("a", "Regional Development").click(); 
    cy.url().should("include", "/regional-development"); 

    cy.wait("@getRecords");

  
    cy.contains("button", "+ Add New Record").click();
    
 cy.contains("button", "Save Record").closest("form").as("regionalForm");

    cy.get("@regionalForm").within(() => {
      cy.contains("label", "Year")
        .parent()
        .find("input")
        .clear()
        .type(uniqueYear);

      cy.contains("label", "Average Income (LKR)")
        .parent()
        .find("input")
        .clear()
        .type(uniqueIncome);

      cy.contains("label", "Unemployment Rate (%)")
        .parent()
        .find("input")
        .clear()
        .type("5.5");

      cy.contains("label", "Poverty Rate (%)")
        .parent()
        .find("input")
        .clear()
        .type("8.2");

      cy.contains("label", "Region")
        .parent()
        .find("select")
        .should("not.contain", "Loading")
        .find("option")
        .its("length")
        .should("be.greaterThan", 1);
      cy.contains("label", "Region").parent().find("select").select(1);

      cy.contains("button", "Save Record").click();
    });

    cy.wait("@createRecord")
      .its("response.statusCode")
      .should("be.oneOf", [200, 201]);
    cy.wait("@getRecords");

    cy.contains("td", uniqueYear).should("exist");
    cy.contains("tr", uniqueYear).within(() => {
      cy.contains("button", "Delete").click();
    });


cy.wait("@deleteRecord").its("response.statusCode").should("be.oneOf", [200, 204]);
    cy.wait("@getRecords");



 cy.contains("tr", uniqueYear).should("not.exist");
  });
});