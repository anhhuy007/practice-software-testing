/**
 * Payment Test Utilities
 * Contains helper functions for payment testing
 */

// Helper function to log test information
export function logTestInfo(testMetaData) {
  cy.log(`Test run at: ${testMetaData.currentDateTime}`);
  cy.log(`Current user: ${testMetaData.currentUser}`);
}

// Helper function to navigate to payment page
export function navigateToPaymentPage(baseUrl, testData, users, addressData) {
  // Add a product to cart first
  const productId = testData.products && testData.products[0] ? testData.products[0].id : 1;

  cy.log(`Navigating to payment page...`);
  cy.log(`Product ID: ${productId}`);
  cy.log(`Base URL: ${baseUrl}`);

  // Visit the product page - first verify base url
  if (!baseUrl) {
    cy.log("Error: baseUrl is undefined, using default");
    baseUrl = "http://localhost:4200/#";
  }

  // Visit the product page
  cy.visit(`${baseUrl}/product/${productId}`, { timeout: 30000 });
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

  // Fill in first name and last name if they exist in the form
  cy.get("body").then(() => {
    cy.get('[data-test="firstName"]', { timeout: 5000 })
      .should("be.visible")
      .click()
      .clear()
      .type(addressData.firstName || "John", { delay: 10 });
  });

  cy.wait(50);

  cy.get("body").then(() => {
    cy.get('[data-test="lastName"]', { timeout: 5000 })
      .should("be.visible")
      .click()
      .clear()
      .type(addressData.lastName || "Doe", { delay: 10 });
  });

  cy.wait(50);

  // Fill in address
  cy.get("body").then(() => {
    cy.get('[data-test="address"]', { timeout: 10000 })
      .should("be.visible")
      .click()
      .clear()
      .type(addressData.address || "Test street 123", { delay: 10 });
  });

  cy.wait(50);

  cy.get("body").then(() => {
    cy.get('[data-test="city"]', { timeout: 10000 })
      .should("be.visible")
      .click()
      .clear()
      .type(addressData.city || "Test City", { delay: 10 });
  });

  cy.wait(50);

  cy.get("body").then(() => {
    cy.get('[data-test="state"]', { timeout: 10000 })
      .should("be.visible")
      .click()
      .clear()
      .type(addressData.state || "Test State", { delay: 10 });
  });

  cy.wait(50);

  cy.get("body").then(() => {
    cy.get('[data-test="country"]', { timeout: 10000 })
      .should("be.visible")
      .click()
      .clear()
      .type(addressData.country || "Test Country", { delay: 10 });
  });

  cy.wait(50);

  cy.get("body").then(() => {
    cy.get('[data-test="postcode"]', { timeout: 10000 })
      .should("be.visible")
      .click()
      .clear()
      .type(addressData.postcode || "12345", { delay: 10 });
  });

  cy.wait(50);

  // Fill in email and phone if they exist in the form
  cy.get("body").then(() => {
    cy.get('[data-test="email"]', { timeout: 5000 })
      .should("be.visible")
      .click()
      .clear()
      .type(addressData.email || "test@example.com", { delay: 10 });
  });

  cy.wait(50);

  cy.get("body").then(() => {
    cy.get('[data-test="phone"]', { timeout: 5000 })
      .should("be.visible")
      .click()
      .clear()
      .type(addressData.phone || "123456789", { delay: 10 });
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
