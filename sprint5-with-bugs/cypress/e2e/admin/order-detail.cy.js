import {
  logTestInfo,
  adminLogin,
  navigateToInvoiceDetail,
} from "../../support/helpers/admin-test-utils";

describe("Admin Order Details Tests", () => {
  // Declare variables at the top level
  const testMetaData = {
    currentDateTime: "2025-07-31 16:13:50",
    currentUser: "anhhuy007",
  };

  const baseUrl = Cypress.env("baseUrl") || "http://localhost:4200/#";
  const adminCredentials = {
    email: "admin@practicesoftwaretesting.com",
    password: "welcome01",
  };

  const expectedStatusOptions = [
    "AWAITING_FULFILLMENT",
    "ON_HOLD",
    "AWAITING_SHIPMENT",
    "SHIPPED",
    "COMPLETED",
  ];

  // Define specific invoice tests without relying on async data loading
  describe("ADM-OM06 - Verify all sections display on Order Details page", () => {
    beforeEach(() => {
      cy.fixture("data/invoice-data").then((data) => {
        const invoiceData = data.invoices;
        const selectedInvoice = invoiceData[0]; // Use the first invoice

        // Setup for this test
        cy.clearCookies();
        cy.clearLocalStorage();
        adminLogin(baseUrl, adminCredentials);
        navigateToInvoiceDetail(baseUrl, selectedInvoice.invoice_number);
      });
    });

    it("should display all required sections on the order details page", () => {
      // Check for all section headings
      cy.contains("h3", "General Information").should("be.visible");
      cy.contains("h3", "Payment Information").should("be.visible");
      cy.contains("h3", "Billing Address").should("be.visible");
      cy.contains("h3", "Products").should("be.visible");

      // Log test information
      logTestInfo(testMetaData);
    });
  });

  describe("ADM-OM07 - Verify 'General Information' for multiple invoices", () => {
    // Define the test for each specific invoice number we want to test
    const invoicesToTest = [
      "INV-2022000002",
      "INV-2022000004",
      "INV-2021000002",
    ];

    invoicesToTest.forEach((invoiceNumber) => {
      it(`should display correct general information for invoice ${invoiceNumber}`, () => {
        // Load the invoice data
        cy.fixture("data/invoice-data").then((data) => {
          const invoiceData = data.invoices;
          const selectedInvoice = invoiceData.find(
            (inv) => inv.invoice_number === invoiceNumber
          );

          if (!selectedInvoice) {
            cy.log(`Invoice ${invoiceNumber} not found in test data`);
            return;
          }

          // Setup for this test
          cy.clearCookies();
          cy.clearLocalStorage();
          adminLogin(baseUrl, adminCredentials);
          navigateToInvoiceDetail(baseUrl, invoiceNumber);

          // Check invoice number
          cy.get('[data-test="invoice-number"]')
            .should("be.visible")
            .and("have.value", selectedInvoice.invoice_number);

          // Check invoice date
          cy.get('[data-test="invoice-date"]')
            .should("be.visible")
            .and("have.value", selectedInvoice.invoice_date);

          // Check total
          cy.get('[data-test="invoice-total"]')
            .should("be.visible")
            .and("have.value", `$ ${selectedInvoice.total}`);

          // Check status dropdown - fix for the null value issue
          cy.get('[data-test="order-status"]')
            .should("be.visible")
            .find(`option[value="${selectedInvoice.status}"]`)
            .should("exist")
            .and("be.selected");

          // Log test information
          logTestInfo(testMetaData);
        });
      });
    });
  });

  describe("ADM-OM08 - Verify 'Payment Information' for multiple invoices", () => {
    // Define the test for each specific invoice number we want to test
    const invoicesToTest = ["INV-2022000002", "INV-2022000004"];

    invoicesToTest.forEach((invoiceNumber) => {
      it(`should display correct payment information for invoice ${invoiceNumber}`, () => {
        // Load the invoice data
        cy.fixture("data/invoice-data").then((data) => {
          const invoiceData = data.invoices;
          const selectedInvoice = invoiceData.find(
            (inv) => inv.invoice_number === invoiceNumber
          );

          if (!selectedInvoice) {
            cy.log(`Invoice ${invoiceNumber} not found in test data`);
            return;
          }

          // Setup for this test
          cy.clearCookies();
          cy.clearLocalStorage();
          adminLogin(baseUrl, adminCredentials);
          navigateToInvoiceDetail(baseUrl, invoiceNumber);

          // Check payment method
          cy.get('[data-test="payment-method"]')
            .should("be.visible")
            .and("have.value", selectedInvoice.payment_method);

          // Check account name
          cy.get('[data-test="account-name"]')
            .should("be.visible")
            .and("have.value", selectedInvoice.account_name);

          // Check account number
          cy.get('[data-test="account-number"]')
            .should("be.visible")
            .and("have.value", selectedInvoice.account_number);

          // Log test information
          logTestInfo(testMetaData);
        });
      });
    });
  });

  describe("ADM-OM09 - Verify 'Billing Address' for multiple invoices", () => {
    // Define the test for each specific invoice number we want to test
    const invoicesToTest = ["INV-2022000002", "INV-2022000004"];

    invoicesToTest.forEach((invoiceNumber) => {
      it(`should display correct billing address for invoice ${invoiceNumber}`, () => {
        // Load the invoice data
        cy.fixture("data/invoice-data").then((data) => {
          const invoiceData = data.invoices;
          const selectedInvoice = invoiceData.find(
            (inv) => inv.invoice_number === invoiceNumber
          );

          if (!selectedInvoice) {
            cy.log(`Invoice ${invoiceNumber} not found in test data`);
            return;
          }

          // Setup for this test
          cy.clearCookies();
          cy.clearLocalStorage();
          adminLogin(baseUrl, adminCredentials);
          navigateToInvoiceDetail(baseUrl, invoiceNumber);

          // Check address
          cy.get('[data-test="address"]')
            .should("be.visible")
            .and("have.value", selectedInvoice.billing_address);

          // Check postcode
          cy.get('[data-test="postcode"]')
            .should("be.visible")
            .and("have.value", selectedInvoice.billing_postcode);

          // Check city
          cy.get('[data-test="city"]')
            .should("be.visible")
            .and("have.value", selectedInvoice.billing_city);

          // Check state
          cy.get('[data-test="state"]')
            .should("be.visible")
            .and("have.value", selectedInvoice.billing_state);

          // Check country
          cy.get('[data-test="country"]')
            .should("be.visible")
            .and("have.value", selectedInvoice.billing_country);

          // Log test information
          logTestInfo(testMetaData);
        });
      });
    });
  });

  describe("ADM-OM10 - Verify 'Products' list for multiple invoices", () => {
    // Define the test for each specific invoice number we want to test
    const invoicesToTest = ["INV-2022000002", "INV-2022000004", "INV-2022000001", "INV-2022000003"];

    invoicesToTest.forEach((invoiceNumber) => {
      it(`should display correct products list for invoice ${invoiceNumber}`, () => {
        // Load the invoice data
        cy.fixture("data/invoice-data").then((data) => {
          const invoiceData = data.invoices;
          const selectedInvoice = invoiceData.find(
            (inv) => inv.invoice_number === invoiceNumber
          );

          if (!selectedInvoice) {
            cy.log(`Invoice ${invoiceNumber} not found in test data`);
            return;
          }

          // Setup for this test
          cy.clearCookies();
          cy.clearLocalStorage();
          adminLogin(baseUrl, adminCredentials);
          navigateToInvoiceDetail(baseUrl, invoiceNumber);

          // Check products table headers
          cy.get("table thead tr th").should(($headers) => {
            expect($headers).to.contain.text("Quantity");
            expect($headers).to.contain.text("Product");
            expect($headers).to.contain.text("Price");
            expect($headers).to.contain.text("Total");
          });

          // Check that there are products listed
          cy.get("table tbody tr").should("have.length.at.least", 1);
          
          // If we have specific product data for this invoice, verify it matches exactly
          if (selectedInvoice.products) {
            // Verify number of products matches
            cy.get("table tbody tr").should("have.length", selectedInvoice.products.length);
            
            // Verify each product in the table
            selectedInvoice.products.forEach((expectedProduct, index) => {
              // Get the row for this product
              cy.get("table tbody tr").eq(index).within(() => {
                // Check quantity
                cy.get("td").eq(0).invoke("text").should("eq", expectedProduct.quantity.toString());
                
                // Check product name
                cy.get("td").eq(1).invoke("text").should("eq", expectedProduct.name);
                
                // Check price (compare without worrying about exact formatting)
                cy.get("td").eq(2).invoke("text").then((text) => {
                  const priceValue = parseFloat(text.replace("$", ""));
                  const expectedPriceValue = parseFloat(expectedProduct.price.replace("$", ""));
                  expect(priceValue).to.be.closeTo(expectedPriceValue, 0.01);
                });
                
                // Check total (compare without worrying about exact formatting)
                cy.get("td").eq(3).invoke("text").then((text) => {
                  const totalValue = parseFloat(text.replace("$", ""));
                  const expectedTotalValue = parseFloat(expectedProduct.total.replace("$", ""));
                  expect(totalValue).to.be.closeTo(expectedTotalValue, 0.01);
                });
              });
            });
          } else {
            // If no specific product data, do the basic structure checks
            cy.get("table tbody tr").each(($row) => {
              // Check quantity column exists and is a number
              cy.wrap($row)
                .find("td")
                .eq(0)
                .invoke("text")
                .then((text) => {
                  expect(parseInt(text.trim())).to.be.a("number");
                });
  
              // Check product name exists and is not empty
              cy.wrap($row)
                .find("td")
                .eq(1)
                .invoke("text")
                .then((text) => {
                  expect(text.trim().length).to.be.greaterThan(0);
                });
  
              // Check unit price column exists and has $ format
              cy.wrap($row)
                .find("td")
                .eq(2)
                .invoke("text")
                .then((text) => {
                  expect(text.trim()).to.match(/^\$\d+\.\d{2}$/);
                });
  
              // Check total column exists and has $ format
              cy.wrap($row)
                .find("td")
                .eq(3)
                .invoke("text")
                .then((text) => {
                  expect(text.trim()).to.match(/^\$\d+\.\d{2}$/);
                });
            });
          }

          // Verify that the invoice total matches the sum of product totals
          let productTotals = 0;

          cy.get("table tbody tr")
            .each(($row) => {
              // Get the total for this product
              cy.wrap($row)
                .find("td")
                .eq(3)
                .invoke("text")
                .then((text) => {
                  const totalValue = parseFloat(text.trim().replace("$", ""));
                  productTotals += totalValue;
                });
            })
            .then(() => {
              // Get the invoice total and compare
              cy.get('[data-test="invoice-total"]')
                .invoke("val")
                .then((totalText) => {
                  const invoiceTotal = parseFloat(
                    totalText.replace("$", "").trim()
                  );
                  expect(productTotals).to.be.closeTo(invoiceTotal, 0.01); // Allow for small rounding differences
                });
            });

          // Log test information
          logTestInfo(testMetaData);
        });
      });
    });
  });

  describe("ADM-OM11 - Verify 'Status' dropdown contains all specified options", () => {
    beforeEach(() => {
      cy.fixture("data/invoice-data").then((data) => {
        const invoiceData = data.invoices;
        const selectedInvoice = invoiceData[0]; // Use the first invoice

        // Setup for this test
        cy.clearCookies();
        cy.clearLocalStorage();
        adminLogin(baseUrl, adminCredentials);
        navigateToInvoiceDetail(baseUrl, selectedInvoice.invoice_number);
      });
    });

    it("should display all expected status options in the dropdown", () => {
      // Check each status option exists in the dropdown
      cy.get('[data-test="order-status"]').within(() => {
        expectedStatusOptions.forEach((status) => {
          cy.get(`option[value="${status}"]`).should("exist");
        });
      });

      // Check that the correct number of options exists
      cy.get('[data-test="order-status"] option').should(
        "have.length",
        expectedStatusOptions.length
      );

      // Log test information
      logTestInfo(testMetaData);
    });
  });

  describe("ADM-OM12 - Verify 'Back' link functionality on order details page", () => {
    beforeEach(() => {
      cy.fixture("data/invoice-data").then((data) => {
        const invoiceData = data.invoices;
        const selectedInvoice = invoiceData[0]; // Use the first invoice

        // Setup for this test
        cy.clearCookies();
        cy.clearLocalStorage();
        adminLogin(baseUrl, adminCredentials);
        navigateToInvoiceDetail(baseUrl, selectedInvoice.invoice_number);
      });
    });

    it("should navigate back to orders list when Back link is clicked", () => {
      // Click the Back link
      cy.get('[data-test="back"]').click();

      // Wait for navigation
      cy.wait(2000);

      // Verify we're back at the orders page
      cy.url().should("include", "/admin/orders");

      // Verify that it's the orders listing page by checking for table existence
      cy.get("table").should("exist");

      // Log test information
      logTestInfo(testMetaData);
    });
  });
});
