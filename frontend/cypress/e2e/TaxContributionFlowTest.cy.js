describe("Tax Contribution Flow Test", () => {
  it("logs in as admin, creates a tax contribution, then deletes it", () => {
    const adminEmail = Cypress.env("adminEmail");
    const adminPassword = Cypress.env("adminPassword");

    if (!adminEmail || !adminPassword) {
      throw new Error("Missing Cypress env: adminEmail and adminPassword");
    }

    const uniqueYear = String(2090 + Math.floor(Math.random() * 9)); // 2090-2098
    const uniqueAmount = (9000000 + Math.floor(Math.random() * 99999)).toString();

    cy.intercept("POST", "**/v1/tax-contributions").as("createTax");
    cy.intercept("GET", "**/v1/tax-contributions**").as("getTaxes");
    cy.intercept("DELETE", "**/v1/tax-contributions/*").as("deleteTax");

    // Login
    cy.visit("/login");
    cy.contains("label", "Email").parent().find('input[type="email"]').type(adminEmail);
    cy.contains("label", "Password").parent().find('input').first().type(adminPassword, { log: false });
    cy.contains("button", "Sign In").click();

    // Navigate to tax page
    cy.url().should("include", "/dashboard");
    cy.contains("a", "Tax Contributions").click();
    cy.url().should("include", "/tax");

    // Open create form
    cy.contains("button", "Add Tax Record").click();
    cy.contains("h2", "Create Tax").should("be.visible");

    // Scope all field interactions to Create Tax form to avoid matching filter controls
    cy.contains("button", "Save")
      .closest("form")
      .as("taxForm");

    // Fill form
    cy.get("@taxForm").within(() => {
      cy.contains("label", "Payer Type").parent().find("select").select("Individual");
      cy.contains("label", "Income Bracket").parent().find("select").select("Medium");
      cy.contains("label", "Tax Type").parent().find("select").select("VAT");
      cy.contains("label", "Amount (LKR)").parent().find("input").clear().type(uniqueAmount);

      // YearPicker custom year
      cy.contains("label", "Year").parent().find("select").select("Custom year...");
      cy.contains("label", "Year").parent().find('input[placeholder="Enter year"]').clear().type(uniqueYear);

      // RegionSelect - wait for loaded options and pick first real option
      cy.contains("label", "Region")
        .parent()
        .find("select")
        .should("not.contain", "Loading regions...")
        .find("option")
        .its("length")
        .should("be.greaterThan", 1);
      cy.contains("label", "Region").parent().find("select").select(1);

      cy.contains("button", "Save").click();
    });

    // Wait for create and table refresh
    cy.wait("@createTax").its("response.statusCode").should("be.oneOf", [200, 201]);
    cy.wait("@getTaxes");

    // Verify row exists (by unique year)
    cy.contains("td", uniqueYear).should("exist");
    cy.contains("tr", uniqueYear).within(() => {
      cy.contains("button", "Delete").click();
    });

    // Confirm delete
    cy.get('[role="alertdialog"]').within(() => {
      cy.contains("button", "Delete").click();
    });

    cy.wait("@deleteTax").its("response.statusCode").should("be.oneOf", [200, 204]);
    cy.wait("@getTaxes");

    // Verify row removed
    cy.contains("tr", uniqueYear).should("not.exist");
  });
});