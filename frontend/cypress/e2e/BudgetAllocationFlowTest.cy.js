describe("Budget Allocation Flow Test", () => {
  it("logs in as admin, creates a budget allocation, then deletes it", () => {
    const adminEmail = Cypress.env("adminEmail");
    const adminPassword = Cypress.env("adminPassword");

    if (!adminEmail || !adminPassword) {
      throw new Error("Missing Cypress env: adminEmail and adminPassword");
    }

    const uniqueYear = String(2090 + Math.floor(Math.random() * 9)); // 2090-2098
    const uniqueAmount = (
      5000000 + Math.floor(Math.random() * 499999)
    ).toString();

    cy.intercept("POST", "**/v1/budget-allocations").as("createBudget");
    cy.intercept("GET", "**/v1/budget-allocations**").as("getBudgets");
    cy.intercept("DELETE", "**/v1/budget-allocations/*").as("deleteBudget");

    // Login
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

    // Navigate to budget page
    cy.url().should("include", "/dashboard");
    cy.contains("a", "Budget Allocation").click();
    cy.url().should("include", "/budget");

    // Open create form
    cy.contains("button", "+ New Allocation").click();
    cy.contains("h2", "New Budget Allocation").should("be.visible");

    // Scope all field interactions to Create Budget form to avoid matching filter controls
    cy.contains("button", "Create").closest("form").as("budgetForm");

    // Fill form
    cy.get("@budgetForm").within(() => {
      cy.contains("label", "Sector")
        .parent()
        .find("select")
        .select("Education");
      cy.contains("label", "Target Income Group")
        .parent()
        .find("select")
        .select("Low Income");
      cy.contains("label", "Amount (LKR)")
        .parent()
        .find("input")
        .clear()
        .type(uniqueAmount);
      cy.contains("label", "Year")
        .parent()
        .find("input")
        .clear()
        .type(uniqueYear);

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
    cy.wait("@createBudget")
      .its("response.statusCode")
      .should("be.oneOf", [200, 201]);
    cy.wait("@getBudgets");

    // Verify row exists (by unique year)
    cy.contains("td", uniqueYear).should("exist");
    cy.contains("tr", uniqueYear).within(() => {
      cy.contains("button", "Delete").click();
    });

    // Confirm delete
    cy.get('[role="alertdialog"]').within(() => {
      cy.contains("button", "Delete").click();
    });

    // Wait for delete API and modal to close
    cy.wait("@deleteBudget")
      .its("response.statusCode")
      .should("be.oneOf", [200, 204]);

    // Verify modal is closed
    cy.get('[role="alertdialog"]').should("not.exist");

    // Wait for table refresh
    cy.wait("@getBudgets");

    // Verify row removed from table
    cy.contains("tr", uniqueYear).should("not.exist");
  });
});
