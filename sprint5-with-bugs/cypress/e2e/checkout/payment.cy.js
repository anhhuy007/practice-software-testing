describe("Checkout Payment Tests", () => {
  let baseUrl;
  let testData;
  let users;
  let addressData;
  let paymentData;
  let testMetaData;

  before(() => {
    // Set base URL - adjust this according to your application setup
    baseUrl = Cypress.env("baseUrl") || "http://localhost:4200/#";

    // Load product test data
    cy.fixture("data/product-test-data").then((data) => {
      testData = data;
    });

    // Load user data
    cy.fixture("data/users").then((userData) => {
      users = userData.users;
    });

    // Load address data
    cy.fixture("data/address-data").then((data) => {
      addressData = data;
    });

    // Load payment data
    cy.fixture("data/payment-data").then((data) => {
      paymentData = data;
    });
    
    // Load test meta data
    cy.fixture("data/test-meta-data").then((data) => {
      testMetaData = data;
    });
  });

  beforeEach(() => {
    // Clear any existing cart state completely
    cy.window().then((win) => {
      win.localStorage.clear();
      win.sessionStorage.clear();
    });

    // Visit home page to ensure clean state
    cy.visit(baseUrl);
    cy.wait(1000);

    // Helper function to navigate to payment page
    navigateToPaymentPage();
  });

  // Helper function to log test information
  function logTestInfo() {
    cy.log(`Test run at: ${testMetaData.currentDateTime}`);
    cy.log(`Current user: ${testMetaData.currentUser}`);
  }

  // Helper function to navigate to payment page
  function navigateToPaymentPage() {
    // Add a product to cart first
    const productId = testData.productIds[0];

    // Visit the product page
    cy.visit(`${baseUrl}/product/${productId}`);
    cy.wait(1000);

    // Add item to cart
    cy.get("body").then(() => {
      cy.get('[data-test="quantity"]', { timeout: 10000 })
        .should("be.visible")
        .click()
        .clear({ force: true })
        .type("1", { force: true, delay: 10 });
    });

    cy.wait(1000);

    // Add to cart
    cy.get("body").then(() => {
      cy.get('[data-test="add-to-cart"]', { timeout: 10000 })
        .should("exist")
        .then(($btn) => {
          if ($btn.is(":disabled")) {
            cy.wrap($btn).click({ force: true });
          } else {
            cy.wrap($btn).click();
          }
        });
    });

    // Navigate to cart
    cy.get('[data-test="nav-cart"]').click();
    cy.wait(1000);

    // Click proceed to checkout
    cy.get('[data-test="proceed-1"]').click();
    cy.wait(1000);

    // Now we need to login
    cy.contains("h3", "Customer login").should("be.visible");

    // Enter login credentials
    cy.get("body").then(() => {
      cy.get('[data-test="email"]', { timeout: 10000 })
        .should("be.visible")
        .click()
        .clear()
        .type(users.customer.email, { delay: 10 });
    });

    cy.wait(50);

    cy.get("body").then(() => {
      cy.get('[data-test="password"]', { timeout: 10000 })
        .should("be.visible")
        .click()
        .clear()
        .type(users.customer.password, { delay: 10 });
    });

    cy.wait(50);

    // Submit login form
    cy.get('[data-test="login-submit"]').should("be.visible").click();

    cy.wait(1000);

    // Now we should see a message that we're logged in
    cy.contains("you are already logged in").should("be.visible");

    // Click proceed from login page
    cy.get('[data-test="proceed-2"]').should("be.enabled").click();

    cy.wait(1000);

    // Fill billing address form
    cy.contains("h3", "Blliling Adress").should("be.visible");

    // Fill in address
    cy.get("body").then(() => {
      cy.get('[data-test="address"]', { timeout: 10000 })
        .should("be.visible")
        .click()
        .clear()
        .type(addressData.valid.address, { delay: 10 });
    });

    cy.wait(50);

    cy.get("body").then(() => {
      cy.get('[data-test="city"]', { timeout: 10000 })
        .should("be.visible")
        .click()
        .clear()
        .type(addressData.valid.city, { delay: 10 });
    });

    cy.wait(50);

    cy.get("body").then(() => {
      cy.get('[data-test="state"]', { timeout: 10000 })
        .should("be.visible")
        .click()
        .clear()
        .type(addressData.valid.state, { delay: 10 });
    });

    cy.wait(50);

    cy.get("body").then(() => {
      cy.get('[data-test="country"]', { timeout: 10000 })
        .should("be.visible")
        .click()
        .clear()
        .type(addressData.valid.country, { delay: 10 });
    });

    cy.wait(50);

    cy.get("body").then(() => {
      cy.get('[data-test="postcode"]', { timeout: 10000 })
        .should("be.visible")
        .click()
        .clear()
        .type(addressData.valid.postcode, { delay: 10 });
    });

    cy.wait(1000);

    // Proceed to payment page
    cy.get('[data-test="proceed-3"]').should("be.enabled").click();

    cy.wait(1000);

    // Verify we're on the payment page
    cy.get('[data-test="payment-method"]').should("be.visible");
    cy.get('[data-test="account-name"]').should("be.visible");
    cy.get('[data-test="account-number"]').should("be.visible");
  }

  describe("CP19 - Select 'Bank Transfer' and submit with valid details", () => {
    it("should accept valid bank transfer details but lacks bank name field (BUG)", () => {
      // BUG: Missing Bank Name field
      cy.log("BUG: No Bank Name field exists for Bank Transfer payment method");

      // Select Bank Transfer payment method
      cy.get('[data-test="payment-method"]').select(
        paymentData.bankTransfer.payment_method
      );

      cy.wait(50);

      // Enter account name
      cy.get("body").then(() => {
        cy.get('[data-test="account-name"]', { timeout: 10000 })
          .should("be.visible")
          .click()
          .clear()
          .type(paymentData.bankTransfer.account_name, { delay: 10 });
      });

      cy.wait(50);

      // Enter account number
      cy.get("body").then(() => {
        cy.get('[data-test="account-number"]', { timeout: 10000 })
          .should("be.visible")
          .click()
          .clear()
          .type(paymentData.bankTransfer.account_number, { delay: 10 });
      });

      cy.wait(50);

      // Click confirm button
      cy.get('[data-test="finish"]').should("be.enabled").click();

      cy.wait(1000);

      // For this test, the success message is expected despite missing Bank Name field
      // since we're just testing basic submission with valid details in the fields that DO exist
      cy.get(".alert-success").should("be.visible");
      cy.get(".help-block")
        .contains("Payment was successful")
        .should("be.visible");

      // Check for order confirmation details
      cy.get("body").then(($body) => {
        if ($body.find("#order-confirmation").length > 0) {
          cy.get("#order-confirmation").should("be.visible");
          cy.get("#invoice-number").should("match", /INV-\d+/);
        } else {
          cy.log(
            "BUG: No invoice number or confirmation details displayed after successful payment"
          );
        }
      });

      // Log test information
      logTestInfo();
    });
  });

  describe("CP20 - Select 'Bank Transfer' with empty Bank Name", () => {
    it("should fail because Bank Name field is missing completely (BUG)", () => {
      // Select Bank Transfer payment method
      cy.get('[data-test="payment-method"]').select(
        paymentData.bankTransfer.payment_method
      );

      cy.wait(50);

      // BUG: Bank Name field is missing entirely
      cy.log(
        "BUG: Bank Name field is missing completely - cannot test leaving it empty"
      );

      // Enter account name
      cy.get("body").then(() => {
        cy.get('[data-test="account-name"]', { timeout: 10000 })
          .should("be.visible")
          .click()
          .clear()
          .type(paymentData.bankTransfer.account_name, { delay: 10 });
      });

      cy.wait(50);

      // Enter account number
      cy.get("body").then(() => {
        cy.get('[data-test="account-number"]', { timeout: 10000 })
          .should("be.visible")
          .click()
          .clear()
          .type(paymentData.bankTransfer.account_number, { delay: 10 });
      });

      cy.wait(50);

      // Click confirm button
      cy.get('[data-test="finish"]').should("be.enabled").click();

      cy.wait(1000);

      // This should FAIL the test since we expect an error for missing bank name
      // but the system incorrectly shows success
      cy.get("body").then(($body) => {
        if ($body.find(".alert-success").length > 0) {
          // Forcing test failure since this should NOT succeed
          cy.log(
            "BUG: Payment succeeded without Bank Name field (which should be required but is missing)"
          );
          expect(false).to.be.true; // Force test to fail
        }
      });

      // Log test information
      logTestInfo();
    });
  });

  describe("CP21 - Select 'Bank Transfer' with empty Account Name", () => {
    it("should show error when account name is empty", () => {
      // Select Bank Transfer payment method
      cy.get('[data-test="payment-method"]').select(
        paymentData.bankTransfer.payment_method
      );

      cy.wait(50);

      // BUG: Missing Bank Name field
      cy.log("BUG: No Bank Name field exists for Bank Transfer payment method");

      // Leave account name empty
      cy.get("body").then(() => {
        cy.get('[data-test="account-name"]', { timeout: 10000 })
          .should("be.visible")
          .click()
          .clear();
      });

      // Enter account number
      cy.get("body").then(() => {
        cy.get('[data-test="account-number"]', { timeout: 10000 })
          .should("be.visible")
          .click()
          .clear()
          .type(paymentData.bankTransfer.account_number, { delay: 10 });
      });

      // Trigger validation by clicking outside the field
      cy.get("body").click();
      cy.wait(50);

      // Check for error message
      cy.contains("Account name is required").should("be.visible");

      // Verify the confirm button is disabled
      cy.get('[data-test="finish"]').should("be.disabled");

      // Log test information
      cy.log(`Test run at: ${currentDateTime}`);
      cy.log(`Current user: ${currentUser}`);
    });
  });

  describe("CP22 - Select 'Bank Transfer' with empty Account Number", () => {
    it("should show error when account number is empty", () => {
      // Select Bank Transfer payment method
      cy.get('[data-test="payment-method"]').select(
        paymentData.bankTransfer.payment_method
      );

      cy.wait(50);

      // BUG: Missing Bank Name field
      cy.log("BUG: No Bank Name field exists for Bank Transfer payment method");

      // Enter account name
      cy.get("body").then(() => {
        cy.get('[data-test="account-name"]', { timeout: 10000 })
          .should("be.visible")
          .click()
          .clear()
          .type(paymentData.bankTransfer.account_name, { delay: 10 });
      });

      // Leave account number empty
      cy.get("body").then(() => {
        cy.get('[data-test="account-number"]', { timeout: 10000 })
          .should("be.visible")
          .click()
          .clear();
      });

      // Trigger validation by clicking outside the field
      cy.get("body").click();
      cy.wait(50);

      // Check for error message
      cy.contains("Account number is required").should("be.visible");

      // Verify the confirm button is disabled
      cy.get('[data-test="finish"]').should("be.disabled");

      // Log test information
      cy.log(`Test run at: ${currentDateTime}`);
      cy.log(`Current user: ${currentUser}`);
    });
  });

  describe("CP23 - Select 'Bank Transfer' with non-numeric Account Number", () => {
    it("should reject non-numeric account number but doesn't (BUG)", () => {
      // Select Bank Transfer payment method
      cy.get('[data-test="payment-method"]').select(
        paymentData.bankTransfer.payment_method
      );

      cy.wait(50);

      // BUG: Missing Bank Name field
      cy.log("BUG: No Bank Name field exists for Bank Transfer payment method");

      // Enter account name
      cy.get("body").then(() => {
        cy.get('[data-test="account-name"]', { timeout: 10000 })
          .should("be.visible")
          .click()
          .clear()
          .type(paymentData.bankTransfer.account_name, { delay: 10 });
      });

      // Enter non-numeric account number
      cy.get("body").then(() => {
        cy.get('[data-test="account-number"]', { timeout: 10000 })
          .should("be.visible")
          .click()
          .clear()
          .type("ABCDE", { delay: 10 }); // Non-numeric value
      });

      // Trigger validation by clicking outside the field
      cy.get("body").click();
      cy.wait(50);

      // BUG: No validation error for non-numeric account number
      cy.log(
        "BUG: No validation for numeric account number - should reject 'ABCDE' but doesn't"
      );

      // Click confirm button - it should be disabled but isn't (bug)
      cy.get('[data-test="finish"]')
        .should("be.enabled") // BUG: This should be disabled
        .click();

      cy.wait(1000);

      // This should FAIL the test since we expect an error for non-numeric account number
      // but the system incorrectly shows success
      cy.get("body").then(($body) => {
        if ($body.find(".alert-success").length > 0) {
          // Forcing test failure since this should NOT succeed
          cy.log(
            "BUG: Payment succeeded with non-numeric account number when it should be rejected"
          );
          expect(false).to.be.true; // Force test to fail
        }
      });

      // Log test information
      cy.log(`Test run at: ${currentDateTime}`);
      cy.log(`Current user: ${currentUser}`);
    });
  });

  describe("CP24 - Select 'Cash on Delivery' and submit", () => {
    it("should not require account fields for COD but does (BUG)", () => {
      // Select Cash on Delivery payment method
      cy.get('[data-test="payment-method"]').select(
        paymentData.cashOnDelivery.payment_method
      );

      cy.wait(50);

      // BUG: Account fields are displayed for Cash on Delivery
      cy.log(
        "BUG: Account fields should not be visible for Cash on Delivery but they are"
      );

      // Due to bug, fields for account info still appear and are required
      // Enter account name
      cy.get("body").then(() => {
        cy.get('[data-test="account-name"]', { timeout: 10000 })
          .should("be.visible") // BUG: This should not be visible
          .click()
          .clear()
          .type("Cash Customer", { delay: 10 });
      });

      // Enter some account number
      cy.get("body").then(() => {
        cy.get('[data-test="account-number"]', { timeout: 10000 })
          .should("be.visible") // BUG: This should not be visible
          .click()
          .clear()
          .type("COD12345", { delay: 10 });
      });

      cy.wait(50);

      // Click confirm button
      cy.get('[data-test="finish"]').should("be.enabled").click();

      cy.wait(1000);

      // This test would pass with success message since it's showing the correct result
      // even though the form fields are incorrect - we're testing COD submission
      cy.get(".alert-success").should("be.visible");
      cy.get(".help-block")
        .contains("Payment was successful")
        .should("be.visible");

      // Still need to log the bug
      cy.log("BUG: Account fields should not be required for Cash on Delivery");
      cy.log(`Test run at: ${currentDateTime}`);
      cy.log(`Current user: ${currentUser}`);
    });
  });

  describe("CP25 - Select 'Credit Card' and submit with valid details", () => {
    it("should provide proper credit card fields but doesn't (BUG)", () => {
      // Select Credit Card payment method
      cy.get('[data-test="payment-method"]').select(
        paymentData.creditCard.payment_method
      );

      cy.wait(50);

      // BUG: Missing proper credit card fields (Expiry Date, CVV)
      cy.log("BUG: Missing proper credit card fields (Expiry Date, CVV)");
      cy.log(
        "BUG: Using generic account fields for credit card instead of specific fields"
      );

      // Enter account name (as cardholder name)
      cy.get("body").then(() => {
        cy.get('[data-test="account-name"]', { timeout: 10000 })
          .should("be.visible")
          .click()
          .clear()
          .type(paymentData.creditCard.account_name, { delay: 10 });
      });

      // Enter account number (as credit card number)
      cy.get("body").then(() => {
        cy.get('[data-test="account-number"]', { timeout: 10000 })
          .should("be.visible")
          .click()
          .clear()
          .type(paymentData.creditCard.account_number, { delay: 10 });
      });

      cy.wait(50);

      // Click confirm button
      cy.get('[data-test="finish"]').should("be.enabled").click();

      cy.wait(1000);

      // This should FAIL the test since we expect proper credit card fields
      // but the system incorrectly accepts generic fields
      cy.get("body").then(($body) => {
        if ($body.find(".alert-success").length > 0) {
          // Forcing test failure since this should NOT succeed with missing required fields
          cy.log(
            "BUG: Payment succeeded without required credit card fields (expiry date, CVV)"
          );
          expect(false).to.be.true; // Force test to fail
        }
      });

      // Log test information
      cy.log(`Test run at: ${currentDateTime}`);
      cy.log(`Current user: ${currentUser}`);
    });
  });

  describe("CP26 - Select 'Credit Card' with invalid CC Number format", () => {
    it("should reject invalid credit card format but doesn't (BUG)", () => {
      // Select Credit Card payment method
      cy.get('[data-test="payment-method"]').select(
        paymentData.creditCard.payment_method
      );

      cy.wait(50);

      // BUG: Missing proper credit card fields and validation
      cy.log("BUG: Missing proper credit card fields and validation");

      // Enter account name (as cardholder name)
      cy.get("body").then(() => {
        cy.get('[data-test="account-name"]', { timeout: 10000 })
          .should("be.visible")
          .click()
          .clear()
          .type(paymentData.creditCard.account_name, { delay: 10 });
      });

      // Enter invalid credit card number
      cy.get("body").then(() => {
        cy.get('[data-test="account-number"]', { timeout: 10000 })
          .should("be.visible")
          .click()
          .clear()
          .type("123", { delay: 10 }); // Invalid CC number format
      });

      // Trigger validation by clicking outside the field
      cy.get("body").click();
      cy.wait(50);

      // BUG: No validation error for invalid credit card format
      cy.log(
        "BUG: No validation for credit card number format - accepts invalid number '123'"
      );

      // Click confirm button - it should be disabled but isn't (bug)
      cy.get('[data-test="finish"]')
        .should("be.enabled") // BUG: This should be disabled
        .click();

      cy.wait(1000);

      // This should FAIL the test since we expect an error for invalid credit card
      // but the system incorrectly shows success
      cy.get("body").then(($body) => {
        if ($body.find(".alert-success").length > 0) {
          // Forcing test failure since this should NOT succeed
          cy.log(
            "BUG: Payment succeeded with invalid credit card format when it should be rejected"
          );
          expect(false).to.be.true; // Force test to fail
        }
      });

      // Log test information
      cy.log(`Test run at: ${currentDateTime}`);
      cy.log(`Current user: ${currentUser}`);
    });
  });

  describe("CP27 - Select 'Credit Card' with invalid Expiry Date", () => {
    it("should require valid expiry date but field is missing (BUG)", () => {
      // Select Credit Card payment method
      cy.get('[data-test="payment-method"]').select(
        paymentData.creditCard.payment_method
      );

      cy.wait(50);

      // BUG: Missing expiry date field entirely
      cy.log(
        "BUG: Expiry date field is missing completely - cannot test invalid expiry date"
      );

      // Enter account name (as cardholder name)
      cy.get("body").then(() => {
        cy.get('[data-test="account-name"]', { timeout: 10000 })
          .should("be.visible")
          .click()
          .clear()
          .type(paymentData.creditCard.account_name, { delay: 10 });
      });

      // Enter credit card number
      cy.get("body").then(() => {
        cy.get('[data-test="account-number"]', { timeout: 10000 })
          .should("be.visible")
          .click()
          .clear()
          .type(paymentData.creditCard.account_number, { delay: 10 });
      });

      cy.wait(50);

      // Click confirm button
      cy.get('[data-test="finish"]').should("be.enabled").click();

      cy.wait(1000);

      // This should FAIL the test since we expect an expiry date field
      // but the system incorrectly shows success without it
      cy.get("body").then(($body) => {
        if ($body.find(".alert-success").length > 0) {
          // Forcing test failure since this should NOT succeed
          cy.log(
            "BUG: Payment succeeded without expiry date field (which should be required but is missing)"
          );
          expect(false).to.be.true; // Force test to fail
        }
      });

      // Log test information
      cy.log(`Test run at: ${currentDateTime}`);
      cy.log(`Current user: ${currentUser}`);
    });
  });

  describe("CP28 - Select 'Credit Card' with invalid CVV format", () => {
    it("should require valid CVV but field is missing (BUG)", () => {
      // Select Credit Card payment method
      cy.get('[data-test="payment-method"]').select(
        paymentData.creditCard.payment_method
      );

      cy.wait(50);

      // BUG: Missing CVV field entirely
      cy.log("BUG: CVV field is missing completely - cannot test invalid CVV");

      // Enter account name (as cardholder name)
      cy.get("body").then(() => {
        cy.get('[data-test="account-name"]', { timeout: 10000 })
          .should("be.visible")
          .click()
          .clear()
          .type(paymentData.creditCard.account_name, { delay: 10 });
      });

      // Enter credit card number
      cy.get("body").then(() => {
        cy.get('[data-test="account-number"]', { timeout: 10000 })
          .should("be.visible")
          .click()
          .clear()
          .type(paymentData.creditCard.account_number, { delay: 10 });
      });

      cy.wait(50);

      // Click confirm button
      cy.get('[data-test="finish"]').should("be.enabled").click();

      cy.wait(1000);

      // This should FAIL the test since we expect a CVV field
      // but the system incorrectly shows success without it
      cy.get("body").then(($body) => {
        if ($body.find(".alert-success").length > 0) {
          // Forcing test failure since this should NOT succeed
          cy.log(
            "BUG: Payment succeeded without CVV field (which should be required but is missing)"
          );
          expect(false).to.be.true; // Force test to fail
        }
      });

      // Log test information
      cy.log(`Test run at: ${currentDateTime}`);
      cy.log(`Current user: ${currentUser}`);
    });
  });

  describe("CP29 - Select 'Buy Now Pay Later' and choose a monthly installment", () => {
    it("should allow installment selection but option is missing (BUG)", () => {
      // Check if BNPL option exists
      cy.get('[data-test="payment-method"]').then(($select) => {
        if ($select.find('option:contains("Buy Now Pay Later")').length > 0) {
          // Select BNPL payment method
          cy.get('[data-test="payment-method"]').select(
            paymentData.buyNowPayLater.payment_method
          );

          cy.wait(50);

          // BUG: Missing installment selection
          cy.log(
            "BUG: Installment selection is missing completely for Buy Now Pay Later"
          );

          // Due to bug, generic account fields appear instead of installment selection
          // Enter account name
          cy.get("body").then(() => {
            cy.get('[data-test="account-name"]', { timeout: 10000 })
              .should("be.visible")
              .click()
              .clear()
              .type("BNPL Customer", { delay: 10 });
          });

          // Enter account number
          cy.get("body").then(() => {
            cy.get('[data-test="account-number"]', { timeout: 10000 })
              .should("be.visible")
              .click()
              .clear()
              .type("BNPL12345", { delay: 10 });
          });

          cy.wait(50);

          // Click confirm button
          cy.get('[data-test="finish"]').should("be.enabled").click();

          cy.wait(1000);

          // This should FAIL the test since we expect installment selection
          // but the system incorrectly shows success without it
          cy.get("body").then(($body) => {
            if ($body.find(".alert-success").length > 0) {
              // Forcing test failure since this should NOT succeed
              cy.log(
                "BUG: Payment succeeded without proper BNPL installment selection"
              );
              expect(false).to.be.true; // Force test to fail
            }
          });
        } else {
          // Skip test if BNPL option doesn't exist
          cy.log(
            "Buy Now Pay Later option not available in payment methods - skipping test"
          );
          cy.log(
            "BUG: Buy Now Pay Later option should be available but is missing"
          );
          // Still fail the test since this option should exist
          expect(false).to.be.true; // Force test to fail
        }
      });

      // Log test information
      cy.log(`Test run at: ${currentDateTime}`);
      cy.log(`Current user: ${currentUser}`);
    });
  });

  describe("CP30 - Select 'Buy Now Pay Later' without choosing an installment", () => {
    it("should require installment selection but option is missing (BUG)", () => {
      // Check if BNPL option exists
      cy.get('[data-test="payment-method"]').then(($select) => {
        if ($select.find('option:contains("Buy Now Pay Later")').length > 0) {
          // Select BNPL payment method
          cy.get('[data-test="payment-method"]').select(
            paymentData.buyNowPayLater.payment_method
          );

          cy.wait(50);

          // BUG: Missing installment selection entirely
          cy.log(
            "BUG: Installment selection is missing completely for Buy Now Pay Later"
          );

          // Due to bug, generic account fields appear instead of installment selection
          // Enter account name
          cy.get("body").then(() => {
            cy.get('[data-test="account-name"]', { timeout: 10000 })
              .should("be.visible")
              .click()
              .clear()
              .type("BNPL Customer", { delay: 10 });
          });

          // Enter account number
          cy.get("body").then(() => {
            cy.get('[data-test="account-number"]', { timeout: 10000 })
              .should("be.visible")
              .click()
              .clear()
              .type("BNPL12345", { delay: 10 });
          });

          cy.wait(50);

          // Click confirm button
          cy.get('[data-test="finish"]').should("be.enabled").click();

          cy.wait(1000);

          // This should FAIL the test since we expect an error for missing installment selection
          // but the system incorrectly shows success
          cy.get("body").then(($body) => {
            if ($body.find(".alert-success").length > 0) {
              // Forcing test failure since this should NOT succeed
              cy.log(
                "BUG: Payment succeeded without installment selection (which should be required but is missing)"
              );
              expect(false).to.be.true; // Force test to fail
            }
          });
        } else {
          // Skip test if BNPL option doesn't exist
          cy.log(
            "Buy Now Pay Later option not available in payment methods - skipping test"
          );
          cy.log(
            "BUG: Buy Now Pay Later option should be available but is missing"
          );
          // Still fail the test since this option should exist
          expect(false).to.be.true; // Force test to fail
        }
      });

      // Log test information
      cy.log(`Test run at: ${currentDateTime}`);
      cy.log(`Current user: ${currentUser}`);
    });
  });

  describe("CP31 - Select 'Gift Card' and submit with valid details", () => {
    it("should provide proper gift card fields but doesn't (BUG)", () => {
      // Check if Gift Card option exists
      cy.get('[data-test="payment-method"]').then(($select) => {
        if ($select.find('option:contains("Gift Card")').length > 0) {
          // Select Gift Card payment method
          cy.get('[data-test="payment-method"]').select(
            paymentData.giftCard.payment_method
          );

          cy.wait(50);

          // BUG: Using generic account fields for gift card
          cy.log(
            "BUG: Using generic account fields for gift card instead of specific gift card fields"
          );

          // Enter gift card number as account name
          cy.get("body").then(() => {
            cy.get('[data-test="account-name"]', { timeout: 10000 })
              .should("be.visible")
              .click()
              .clear()
              .type(paymentData.giftCard.account_name, { delay: 10 });
          });

          // Enter validation code as account number
          cy.get("body").then(() => {
            cy.get('[data-test="account-number"]', { timeout: 10000 })
              .should("be.visible")
              .click()
              .clear()
              .type(paymentData.giftCard.account_number, { delay: 10 });
          });

          cy.wait(50);

          // Click confirm button
          cy.get('[data-test="finish"]').should("be.enabled").click();

          cy.wait(1000);

          // This should FAIL the test since we expect proper gift card fields
          // but the system incorrectly accepts generic fields
          cy.get("body").then(($body) => {
            if ($body.find(".alert-success").length > 0) {
              // Forcing test failure since this should NOT succeed with generic fields
              cy.log(
                "BUG: Payment succeeded with generic account fields instead of proper gift card fields"
              );
              expect(false).to.be.true; // Force test to fail
            }
          });
        } else {
          // Skip test if Gift Card option doesn't exist
          cy.log(
            "Gift Card option not available in payment methods - skipping test"
          );
          cy.log("BUG: Gift Card option should be available but is missing");
          // Still fail the test since this option should exist
          expect(false).to.be.true; // Force test to fail
        }
      });

      // Log test information
      cy.log(`Test run at: ${currentDateTime}`);
      cy.log(`Current user: ${currentUser}`);
    });
  });

  describe("CP32 - Select 'Gift Card' with invalid details", () => {
    it("should reject invalid gift card details but doesn't (BUG)", () => {
      // Check if Gift Card option exists
      cy.get('[data-test="payment-method"]').then(($select) => {
        if ($select.find('option:contains("Gift Card")').length > 0) {
          // Select Gift Card payment method
          cy.get('[data-test="payment-method"]').select(
            paymentData.giftCard.payment_method
          );

          cy.wait(50);

          // BUG: Using generic account fields for gift card with no validation
          cy.log(
            "BUG: Using generic account fields for gift card with no validation"
          );

          // Enter invalid gift card number as account name
          cy.get("body").then(() => {
            cy.get('[data-test="account-name"]', { timeout: 10000 })
              .should("be.visible")
              .click()
              .clear()
              .type("INVALID-GC", { delay: 10 });
          });

          // Enter invalid validation code as account number
          cy.get("body").then(() => {
            cy.get('[data-test="account-number"]', { timeout: 10000 })
              .should("be.visible")
              .click()
              .clear()
              .type("INVALID", { delay: 10 });
          });

          cy.wait(50);

          // Click confirm button
          cy.get('[data-test="finish"]')
            .should("be.enabled") // BUG: This should be disabled
            .click();

          cy.wait(1000);

          // This should FAIL the test since we expect an error for invalid gift card
          // but the system incorrectly shows success
          cy.get("body").then(($body) => {
            if ($body.find(".alert-success").length > 0) {
              // Forcing test failure since this should NOT succeed
              cy.log(
                "BUG: Payment succeeded with invalid gift card details when it should be rejected"
              );
              expect(false).to.be.true; // Force test to fail
            }
          });
        } else {
          // Skip test if Gift Card option doesn't exist
          cy.log(
            "Gift Card option not available in payment methods - skipping test"
          );
          cy.log("BUG: Gift Card option should be available but is missing");
          // Still fail the test since this option should exist
          expect(false).to.be.true; // Force test to fail
        }
      });

      // Log test information
      cy.log(`Test run at: ${currentDateTime}`);
      cy.log(`Current user: ${currentUser}`);
    });
  });

  describe("CP33 - Attempt to place order without selecting any payment method", () => {
    it("should show error when no payment method is selected", () => {
      // Do not select any payment method
      // If a method is pre-selected, deselect it if possible
      cy.get('[data-test="payment-method"]').then(($select) => {
        if ($select.prop("selectedIndex") > 0) {
          // Try to select the first option (which might be a placeholder)
          cy.get('[data-test="payment-method"] option')
            .first()
            .then(($firstOption) => {
              if ($firstOption.text().includes("Choose")) {
                cy.get('[data-test="payment-method"]').select(
                  $firstOption.val()
                );
              }
            });
        }
      });

      cy.wait(50);

      // Enter account name
      cy.get("body").then(() => {
        cy.get('[data-test="account-name"]', { timeout: 10000 })
          .should("be.visible")
          .click()
          .clear()
          .type("Some Name", { delay: 10 });
      });

      // Enter account number
      cy.get("body").then(() => {
        cy.get('[data-test="account-number"]', { timeout: 10000 })
          .should("be.visible")
          .click()
          .clear()
          .type("12345", { delay: 10 });
      });

      // Trigger validation by clicking outside the field
      cy.get("body").click();
      cy.wait(50);

      // Check for error message
      cy.contains("Payment method is required").should("be.visible");

      // Verify the confirm button is disabled
      cy.get('[data-test="finish"]').should("be.disabled");

      // Log test information
      cy.log(`Test run at: ${currentDateTime}`);
      cy.log(`Current user: ${currentUser}`);
    });
  });

  describe("CP34 - Change payment method after interacting with fields for another", () => {
    it("should adapt form fields for new payment method but doesn't (BUG)", () => {
      // First select Bank Transfer
      cy.get('[data-test="payment-method"]').select(
        paymentData.bankTransfer.payment_method
      );

      cy.wait(50);

      // Enter some data in account fields
      cy.get("body").then(() => {
        cy.get('[data-test="account-name"]', { timeout: 10000 })
          .should("be.visible")
          .click()
          .clear()
          .type("Bank Transfer Customer", { delay: 10 });
      });

      cy.get("body").then(() => {
        cy.get('[data-test="account-number"]', { timeout: 10000 })
          .should("be.visible")
          .click()
          .clear()
          .type("BT12345678", { delay: 10 });
      });

      cy.wait(50);

      // Now switch to Cash on Delivery
      cy.get('[data-test="payment-method"]').select(
        paymentData.cashOnDelivery.payment_method
      );

      cy.wait(50);

      // BUG: Fields are still visible and possibly still have old values
      cy.log(
        "BUG: Form fields should change or hide when switching payment methods, but they don't"
      );

      // Verify that the fields are still visible (bug)
      cy.get('[data-test="account-name"]').should("be.visible");
      cy.get('[data-test="account-number"]').should("be.visible");

      // Check if previous data persists
      cy.get('[data-test="account-name"]')
        .invoke("val")
        .then((value) => {
          if (value === "Bank Transfer Customer") {
            cy.log(
              "BUG: Previous account name data persists after changing payment method"
            );
          }
        });

      // Fill in for Cash on Delivery (which shouldn't require these fields - another bug)
      cy.get("body").then(() => {
        cy.get('[data-test="account-name"]', { timeout: 10000 })
          .should("be.visible")
          .click()
          .clear()
          .type("Cash Customer", { delay: 10 });
      });

      cy.get("body").then(() => {
        cy.get('[data-test="account-number"]', { timeout: 10000 })
          .should("be.visible")
          .click()
          .clear()
          .type("COD12345", { delay: 10 });
      });

      cy.wait(50);

      // Click confirm button
      cy.get('[data-test="finish"]').should("be.enabled").click();

      cy.wait(1000);

      // This should FAIL the test since Cash on Delivery shouldn't require these fields
      // but the system incorrectly uses the same fields for all payment methods
      cy.get("body").then(($body) => {
        if ($body.find(".alert-success").length > 0) {
          // Forcing test failure since this should NOT succeed with these fields
          cy.log(
            "BUG: Payment succeeded with generic account fields for Cash on Delivery which shouldn't require them"
          );
          expect(false).to.be.true; // Force test to fail
        }
      });

      // Log test information
      cy.log(`Test run at: ${currentDateTime}`);
      cy.log(`Current user: ${currentUser}`);
    });
  });
});