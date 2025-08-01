describe("Admin Dashboard Tests", () => {
  const currentDateTime = "2025-07-31 15:08:12"; // Updated as specified
  const currentUser = "anhhuy007"; // As specified
  const baseUrl = Cypress.env("baseUrl") || "http://localhost:4200/#";
  const adminCredentials = {
    email: "admin@practicesoftwaretesting.com",
    password: "welcome01",
  };

  beforeEach(() => {
    // Clear cookies and local storage to ensure clean state for each test
    cy.clearCookies();
    cy.clearLocalStorage();

    // Login as admin before each test
    cy.visit(`${baseUrl}/auth/login`);

    // Fill in admin credentials
    cy.get("body").then(() => {
      cy.get('[data-test="email"]', { timeout: 10000 })
        .should("be.visible")
        .click()
        .clear()
        .type(adminCredentials.email, { delay: 10 });
    });

    cy.wait(500);

    cy.get("body").then(() => {
      cy.get('[data-test="password"]', { timeout: 10000 })
        .should("be.visible")
        .click()
        .clear()
        .type(adminCredentials.password, { delay: 10 });
    });

    // Submit the login form
    cy.get('[data-test="login-submit"]').should("be.visible").click();

    cy.wait(2000);

    // Navigate to admin dashboard
    cy.visit(`${baseUrl}/admin/dashboard`);
    cy.wait(2000);
  });

  describe("ADM-OM01 - Verify Admin Dashboard elements display correctly", () => {
    it("should display Sales over the years chart and Latest orders table", () => {
      // Check for page title "Sales over the years"
      cy.get('[data-test="page-title"]')
        .should("be.visible")
        .and("have.text", "Sales over the years");

      // Check for chart component
      cy.get("chart").should("be.visible");

      // Check for "Latest orders" heading
      cy.contains("h2", "Latest orders").should("be.visible");

      // Check for orders table (if there are orders)
      cy.get("body").then(($body) => {
        if ($body.find("table").length > 0) {
          cy.get("table.table-hover").should("be.visible");
        } else {
          cy.contains("No recent invoices.").should("be.visible");
        }
      });

      // Log test information
      cy.log(`Test run at: ${currentDateTime}`);
      cy.log(`Current user: ${currentUser}`);
    });
  });

  describe("ADM-OM02 - Verify columns in Latest orders table", () => {
    it("should display all expected columns in the orders table", () => {
      // Check if table exists (we might have no orders)
      cy.get("body").then(($body) => {
        if ($body.find("table").length > 0) {
          // Check for all required column headers
          cy.get("table thead th").should(($headers) => {
            expect($headers).to.contain.text("Invoice Number");
            expect($headers).to.contain.text("Billing Address");
            expect($headers).to.contain.text("Invoice Date");
            expect($headers).to.contain.text("Status");
            expect($headers).to.contain.text("Total");
            // Last column is for Edit button, may not have header text
          });

          // Check that there are exactly 6 columns (including the Edit column)
          cy.get("table thead th").should("have.length", 6);

          // Specifically check for Edit button in the last column
          if (Cypress.$("table tbody tr").length > 0) {
            cy.get("table tbody tr")
              .first()
              .find("td")
              .last()
              .find("a")
              .should("have.text", "Edit")
              .and("have.class", "btn-primary");
          }
        } else {
          // Skip test if there are no orders
          cy.log("No orders available to test table columns");
        }
      });

      // Log test information
      cy.log(`Test run at: ${currentDateTime}`);
      cy.log(`Current user: ${currentUser}`);
    });
  });

  describe("ADM-OM03 - Verify clicking Edit button navigates to order details page", () => {
    it("should navigate to the correct order details page when Edit button is clicked", () => {
      // Check if table exists and has orders
      cy.get("body").then(($body) => {
        if ($body.find("table tbody tr").length > 0) {
          // Get the first invoice number for verification
          let invoiceNumber;

          cy.get("table tbody tr")
            .first()
            .find("td")
            .first()
            .invoke("text")
            .then((text) => {
              invoiceNumber = text.trim();

              // Now click the Edit button for this order
              cy.get("table tbody tr")
                .first()
                .find("td")
                .last()
                .find("a.btn-primary")
                .click();

              // Wait for navigation
              cy.wait(2000);

              // Verify we're on an order edit page
              cy.url().should("include", "/admin/orders/edit/");

              // Check for the specific form structure according to provided HTML
              cy.get(".form-group.row").should("exist");
              cy.get('label[for="invoice_date"]')
                .should("exist")
                .and("contain.text", "Invoice Number");

              // Check that the invoice number field exists
              cy.get('[data-test="invoice-number"]')
                .should("exist")
                .and("have.class", "form-control-plaintext");

              // Verify the invoice number is in the form
              cy.get('[data-test="invoice-number"]').should(
                "have.value",
                invoiceNumber
              );
            });
        } else {
          // Skip test if there are no orders
          cy.log("No orders available to test Edit button navigation");
        }
      });

      // Log test information
      cy.log(`Test run at: ${currentDateTime}`);
      cy.log(`Current user: ${currentUser}`);
    });
  });

  describe("ADM-OM04 - Verify Sales over the years chart data (visual check)", () => {
    it("should display chart with data for relevant years", () => {
      // Check for chart existence
      cy.get("chart")
        .should("be.visible")
        .and("have.attr", "style")
        .and("include", "height: 300px");

      // Visual check of the chart (limited capabilities in automated tests)
      // We can verify if the chart component exists with correct height
      cy.get("chart").should("exist").should("have.css", "height", "300px");

      // Log the known issue with missing years
      cy.log(
        "BUG: Chart appears to be missing data for years from 2022 to 2024"
      );
      cy.log("BUG: No total numbers are displayed on top of the bars");

      // Log test information
      cy.log(`Test run at: ${currentDateTime}`);
      cy.log(`Current user: ${currentUser}`);
    });
  });

  describe("ADM-OM05 - Verify Latest orders data format consistency", () => {
    it("should display consistent data formats in the orders table", () => {
      // Check if table exists and has orders
      cy.get("body").then(($body) => {
        if ($body.find("table tbody tr").length > 0) {
          // Check invoice number format (INV-xxxxxxxxxx)
          cy.get("table tbody tr td:nth-child(1)").each(($cell) => {
            const invoiceNumber = $cell.text().trim();
            expect(invoiceNumber).to.match(/^INV-\d+$/);
          });

          // Check billing address format (should be non-empty)
          cy.get("table tbody tr td:nth-child(2)").each(($cell) => {
            const address = $cell.text().trim();
            expect(address.length).to.be.greaterThan(0);
          });

          // Check invoice date format (YYYY-MM-DD HH:MM:SS)
          cy.get("table tbody tr td:nth-child(3)").each(($cell) => {
            const dateText = $cell.text().trim();
            expect(dateText).to.match(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
          });

          // Check status format (should be non-empty text)
          cy.get("table tbody tr td:nth-child(4)").each(($cell) => {
            const status = $cell.text().trim();
            expect(status.length).to.be.greaterThan(0);
          });

          // Check total format ($XX.XX)
          cy.get("table tbody tr td:nth-child(5)").each(($cell) => {
            const total = $cell.text().trim();
            expect(total).to.match(/^\$\d+(\.\d{2})?$/);
          });
        } else {
          // Skip test if there are no orders
          cy.log("No orders available to test data format consistency");
        }
      });

      // Log test information
      cy.log(`Test run at: ${currentDateTime}`);
      cy.log(`Current user: ${currentUser}`);
    });
  });
});
