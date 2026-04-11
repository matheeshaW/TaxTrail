describe("Social Program Flow Test", () => {
  it("logs in as admin, creates a social program, then deletes it", () => {
    const adminEmail = Cypress.env("adminEmail");
    const adminPassword = Cypress.env("adminPassword");

    if (!adminEmail || !adminPassword) {
      throw new Error("Missing Cypress env: adminEmail and adminPassword");
    }

    const currentYear = String(new Date().getFullYear());
    const uniqueProgramName = `Cypress SP ${Date.now()}`;
    const beneficiariesCount = String(250 + Math.floor(Math.random() * 250));
    const uniqueBudget = String(2500000 + Math.floor(Math.random() * 500000));

    cy.intercept("POST", "**/socialprograms").as("createProgram");
    cy.intercept("GET", "**/socialprograms").as("getPrograms");
    cy.intercept("DELETE", "**/socialprograms/*").as("deleteProgram");

    // Login
    cy.visit("/login");
    cy.contains("label", "Email").parent().find('input[type="email"]').type(adminEmail);
    cy.contains("label", "Password").parent().find("input").first().type(adminPassword, { log: false });
    cy.contains("button", "Sign In").click();

    // Navigate to social programs page
    cy.url().should("include", "/dashboard");
    cy.contains("a", "Social programs").click();
    cy.url().should("include", "/programs");

    // Wait for initial data load
    cy.wait("@getPrograms");

    // Open create form
    cy.contains("button", "+ New program").click();
    cy.contains("h2", "New social program").should("be.visible");

    // Scope all field interactions to Create Program form
    cy.contains("button", "Create").closest("form").as("programForm");

    // Fill form
    cy.get("@programForm").within(() => {
      cy.contains("label", "Program name").parent().find("input").clear().type(uniqueProgramName);
      cy.contains("label", "Sector").parent().find("select").select("Health");
      cy.contains("label", "Target group").parent().find("select").select("Low Income");
      cy.contains("label", "Beneficiaries").parent().find("input").clear().type(beneficiariesCount);
      cy.contains("label", "Budget (LKR)").parent().find("input").clear().type(uniqueBudget);
      cy.contains("label", "Year").parent().find("input").clear().type(currentYear);

      // RegionSelect - wait for loaded options and pick first real option
      cy.contains("label", "Region")
        .parent()
        .find("select")
        .should("not.contain", "Loading regions...")
        .find("option")
        .its("length")
        .should("be.greaterThan", 1);
      cy.contains("label", "Region").parent().find("select").select(1);

      cy.contains("button", "Create").click();
    });

    // Wait for create and table refresh
    cy.wait("@createProgram").its("response.statusCode").should("be.oneOf", [200, 201]);
    cy.wait("@getPrograms");

    // Verify row exists, then delete it
    cy.contains("td", uniqueProgramName).should("exist");
    cy.contains("tr", uniqueProgramName).within(() => {
      cy.contains("button", "Delete").click();
    });

    // Confirm delete
    cy.get('[role="alertdialog"]').within(() => {
      cy.contains("button", "Delete").click();
    });

    cy.wait("@deleteProgram").its("response.statusCode").should("be.oneOf", [200, 204]);
    cy.wait("@getPrograms");

    // Verify row removed
    cy.contains("tr", uniqueProgramName).should("not.exist");
  });
});