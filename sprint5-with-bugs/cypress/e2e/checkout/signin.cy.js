describe("Checkout Tests", () => {
  let baseUrl;
  let testData;
  let users;

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
  });

  beforeEach(() => {
    // Clear any existing cart state completely
    cy.window().then((win) => {
      win.localStorage.clear();
      win.sessionStorage.clear();
    });

    // Visit home page to ensure clean state
    cy.visit(baseUrl);
    // Wait for page to load completely
    cy.wait(1000);
  });

  describe("CP08 - Proceed to Sign In page when not logged in", () => {
    it("should navigate to Sign In page when clicking Proceed to Checkout while not logged in", () => {
      // Use the first product ID for this test
      const productId = testData.productIds[0];

      // Ensure user is logged out (clear any auth tokens)
      cy.clearCookies();
      cy.clearLocalStorage();

      // Visit the specific product page
      cy.visit(`${baseUrl}/product/${productId}`);
      cy.wait(1000);

      // Add item to cart
      cy.get("body").then(() => {
        cy.get('[data-test="quantity"]', { timeout: 10000 })
          .should("be.visible")
          .click()
          .clear({ force: true })
          .type("1", { force: true, delay: 100 });
      });

      cy.wait(1000);

      // Add to cart with proper error handling
      cy.get("body").then(() => {
        cy.get('[data-test="add-to-cart"]', { timeout: 10000 })
          .should("exist")
          .then(($btn) => {
            if ($btn.is(":disabled")) {
              cy.log("Add to cart button is disabled, forcing click");
              cy.wrap($btn).click({ force: true });
            } else {
              cy.log("Add to cart button is enabled, clicking normally");
              cy.wrap($btn).click();
            }
          });
      });

      cy.wait(1000);

      // Navigate to cart
      cy.get('[data-test="nav-cart"]').click();
      cy.wait(1000);

      // Verify we're on the cart page and items exist
      cy.get("tbody tr").should("have.length.at.least", 1);

      // Click Proceed to Checkout
      cy.get('[data-test="proceed-1"]').click();
      cy.wait(1000);

      // Verify we're on the sign-in page by checking for sign-in form elements
      cy.contains("h3", "Customer login").should("be.visible");
      cy.get('[data-test="email"]').should("be.visible");
      cy.get('[data-test="password"]').should("be.visible");
      cy.get('[data-test="login-submit"]').should("be.visible");
    });
  });

  describe("CP09 - Proceed from Cart when already logged in", () => {
    it("should proceed directly to Address page when already logged in", () => {
      // First, navigate to the login page and login with actual credentials
      cy.visit(`${baseUrl}/auth/login`);
      cy.wait(1000); // Wait for page to load completely

      // Enter email - with retry for stability
      cy.get("body").then(() => {
        cy.get('[data-test="email"]', { timeout: 10000 })
          .should("be.visible")
          .click()
          .clear()
          .type(users.customer.email, { delay: 10 });
      });

      // Wait for the framework to process the input
      cy.wait(500);

      // Enter password - with retry for stability
      cy.get("body").then(() => {
        cy.get('[data-test="password"]', { timeout: 10000 })
          .should("be.visible")
          .click()
          .clear()
          .type(users.customer.password, { delay: 10 });
      });

      // Wait before submitting
      cy.wait(500);

      // Click login button
      cy.get('[type="submit"], [data-test="login-submit"]')
        .should("be.visible")
        .click();

      // Wait for login to complete
      cy.wait(1000);

      // Use the first product ID for this test
      const productId = testData.productIds[0];

      // Visit the specific product page
      cy.visit(`${baseUrl}/product/${productId}`);
      cy.wait(1000); // Wait for page to load completely

      // Interact with quantity field
      cy.get("body").then(() => {
        cy.get('[data-test="quantity"]', { timeout: 10000 })
          .should("be.visible")
          .click()
          .clear({ force: true })
          .type("1", { force: true, delay: 100 });
      });

      // Wait for any validations to complete
      cy.wait(1000);

      // Add to cart with proper error handling
      cy.get("body").then(() => {
        cy.get('[data-test="add-to-cart"]', { timeout: 10000 })
          .should("exist")
          .then(($btn) => {
            if ($btn.is(":disabled")) {
              cy.log("Add to cart button is disabled, forcing click");
              cy.wrap($btn).click({ force: true });
            } else {
              cy.log("Add to cart button is enabled, clicking normally");
              cy.wrap($btn).click();
            }
          });
      });

      // Wait for cart update
      cy.wait(1000);

      // Navigate to cart
      cy.get('[data-test="nav-cart"]').click();
      cy.wait(1000); // Wait for page to load

      // Verify we're on the cart page and items exist
      cy.get("tbody tr").should("have.length.at.least", 1);

      // Click Proceed to Checkout
      cy.get('[data-test="proceed-1"]').click();
      cy.wait(1000);

      // Since we're already logged in, we should see a message indicating that
      cy.contains("Hello").should("be.visible");
      cy.contains("you are already logged in").should("be.visible");

      // Click the proceed button on the sign-in step
      cy.get('[data-test="proceed-2"]').click();
      cy.wait(1000);

      // Verify we're on the Address page by checking for "Blliling Adress" heading
      cy.contains("h3", "Blliling Adress").should("be.visible");

      // Also verify form fields are present
      cy.get('[data-test="address"]').should("be.visible");
      cy.get('[data-test="city"]').should("be.visible");
      cy.get('[data-test="state"]').should("be.visible");
      cy.get('[data-test="country"]').should("be.visible");
      cy.get('[data-test="postcode"]').should("be.visible");
    });
  });

  // For CP10 - Successful login during checkout
  describe("CP10 - Successful login during checkout", () => {
    it("should allow login with valid credentials during checkout process", () => {
      // Use the first product ID for this test
      const productId = testData.productIds[0];

      // Ensure user is logged out
      cy.clearCookies();
      cy.clearLocalStorage();

      // Visit the specific product page
      cy.visit(`${baseUrl}/product/${productId}`);
      cy.wait(1000); // Wait for page to load completely

      // Interact with quantity field
      cy.get("body").then(() => {
        cy.get('[data-test="quantity"]', { timeout: 10000 })
          .should("be.visible")
          .click()
          .clear({ force: true })
          .type("1", { force: true, delay: 100 });
      });

      // Wait for any validations to complete
      cy.wait(1000);

      // Add to cart with proper error handling
      cy.get("body").then(() => {
        cy.get('[data-test="add-to-cart"]', { timeout: 10000 })
          .should("exist")
          .then(($btn) => {
            if ($btn.is(":disabled")) {
              cy.log("Add to cart button is disabled, forcing click");
              cy.wrap($btn).click({ force: true });
            } else {
              cy.log("Add to cart button is enabled, clicking normally");
              cy.wrap($btn).click();
            }
          });
      });

      // Wait for cart update
      cy.wait(1000);

      // Navigate to cart
      cy.get('[data-test="nav-cart"]').click();
      cy.wait(1000); // Wait for page to load

      // Verify we're on the cart page and items exist
      cy.get("tbody tr").should("have.length.at.least", 1);

      // Click Proceed to Checkout
      cy.get('[data-test="proceed-1"]').click();
      cy.wait(1000);

      // Verify we're on the sign-in page
      cy.get('[data-test="email"]').should("be.visible");

      // Enter valid credentials - first email
      cy.get("body").then(() => {
        cy.get('[data-test="email"]', { timeout: 10000 })
          .should("be.visible")
          .click()
          .clear()
          .type(users.customer.email, { delay: 10 });
      });

      // Wait for the framework to process the input
      cy.wait(500);

      // Enter password
      cy.get("body").then(() => {
        cy.get('[data-test="password"]', { timeout: 10000 })
          .should("be.visible")
          .click()
          .clear()
          .type(users.customer.password, { delay: 10 });
      });

      // Wait before submitting
      cy.wait(500);

      // Submit the login form
      cy.get('[data-test="login-submit"]').should("be.visible").click();

      // Wait for login to process
      cy.wait(1000);

      // Verify successful login with the exact expected message
      cy.contains(
        "p",
        "Hello Jane Doe, you are already logged in. You can proceed to checkout."
      ).should("be.visible");

      // Verify the proceed button is enabled
      cy.get('[data-test="proceed-2"]').should("be.enabled").click();

      // Wait for navigation
      cy.wait(1000);

      // Verify we've reached the address page
      cy.contains("h3", "Blliling Adress").should("be.visible");
      cy.get('[data-test="address"]').should("be.visible");
    });
  });

  // For CP11 - Failed login (invalid credentials) during checkout
  describe("CP11 - Failed login (invalid credentials) during checkout", () => {
    it("should show error message when login fails with invalid credentials", () => {
      // Use the first product ID for this test
      const productId = testData.productIds[0];

      // Ensure user is logged out
      cy.clearCookies();
      cy.clearLocalStorage();

      // Visit the specific product page
      cy.visit(`${baseUrl}/product/${productId}`);
      cy.wait(1000); // Wait for page to load completely

      // Interact with quantity field
      cy.get("body").then(() => {
        cy.get('[data-test="quantity"]', { timeout: 10000 })
          .should("be.visible")
          .click()
          .clear({ force: true })
          .type("1", { force: true, delay: 100 });
      });

      // Wait for any validations to complete
      cy.wait(1000);

      // Add to cart with proper error handling
      cy.get("body").then(() => {
        cy.get('[data-test="add-to-cart"]', { timeout: 10000 })
          .should("exist")
          .then(($btn) => {
            if ($btn.is(":disabled")) {
              cy.log("Add to cart button is disabled, forcing click");
              cy.wrap($btn).click({ force: true });
            } else {
              cy.log("Add to cart button is enabled, clicking normally");
              cy.wrap($btn).click();
            }
          });
      });

      // Wait for cart update
      cy.wait(1000);

      // Navigate to cart
      cy.get('[data-test="nav-cart"]').click();
      cy.wait(1000); // Wait for page to load

      // Click Proceed to Checkout
      cy.get('[data-test="proceed-1"]').click();
      cy.wait(1000);

      // Verify we're on the sign-in page
      cy.get('[data-test="email"]').should("be.visible");

      // Enter invalid credentials - first email
      cy.get("body").then(() => {
        cy.get('[data-test="email"]', { timeout: 10000 })
          .should("be.visible")
          .click()
          .clear()
          .type(users.invalid.email, { delay: 10 });
      });

      // Wait for the framework to process the input
      cy.wait(500);

      // Enter password
      cy.get("body").then(() => {
        cy.get('[data-test="password"]', { timeout: 10000 })
          .should("be.visible")
          .click()
          .clear()
          .type(users.invalid.password, { delay: 10 });
      });

      // Wait before submitting
      cy.wait(500);

      // Submit the login form
      cy.get('[data-test="login-submit"]').should("be.visible").click();

      // Wait for login attempt to process
      cy.wait(1000);

      // Verify the exact error message is displayed
      cy.contains("div.help-block", "Invalid email or password").should(
        "be.visible"
      );

      // Verify we're still on the sign-in page
      cy.get('[data-test="email"]').should("be.visible");
      cy.get('[data-test="password"]').should("be.visible");
    });
  });

  describe("CP12 - Login with second customer account", () => {
    it("should successfully login with the second customer account", () => {
      // Use the second product ID for this test
      const productId = testData.productIds[1];

      // Ensure user is logged out
      cy.clearCookies();
      cy.clearLocalStorage();

      // Visit the specific product page
      cy.visit(`${baseUrl}/product/${productId}`);
      cy.wait(1000); // Wait for page to load completely

      // Interact with quantity field
      cy.get("body").then(() => {
        cy.get('[data-test="quantity"]', { timeout: 10000 })
          .should("be.visible")
          .click()
          .clear({ force: true })
          .type("1", { force: true, delay: 100 });
      });

      // Wait for any validations to complete
      cy.wait(1000);

      // Add to cart with proper error handling
      cy.get("body").then(() => {
        cy.get('[data-test="add-to-cart"]', { timeout: 10000 })
          .should("exist")
          .then(($btn) => {
            if ($btn.is(":disabled")) {
              cy.log("Add to cart button is disabled, forcing click");
              cy.wrap($btn).click({ force: true });
            } else {
              cy.log("Add to cart button is enabled, clicking normally");
              cy.wrap($btn).click();
            }
          });
      });

      // Wait for cart update
      cy.wait(1000);

      // Navigate to cart
      cy.get('[data-test="nav-cart"]').click();
      cy.wait(1000); // Wait for page to load

      // Verify we're on the cart page and items exist
      cy.get("tbody tr").should("have.length.at.least", 1);

      // Click Proceed to Checkout
      cy.get('[data-test="proceed-1"]').click();
      cy.wait(1000);

      // Verify we're on the sign-in page
      cy.get('[data-test="email"]').should("be.visible");

      // Enter second customer account credentials - first email
      cy.get("body").then(() => {
        cy.get('[data-test="email"]', { timeout: 10000 })
          .should("be.visible")
          .click()
          .clear()
          .type(users.customer2.email, { delay: 10 });
      });

      // Wait for the framework to process the input
      cy.wait(500);

      // Enter password
      cy.get("body").then(() => {
        cy.get('[data-test="password"]', { timeout: 10000 })
          .should("be.visible")
          .click()
          .clear()
          .type(users.customer2.password, { delay: 10 });
      });

      // Wait before submitting
      cy.wait(500);

      // Submit the login form
      cy.get('[data-test="login-submit"]').should("be.visible").click();

      // Wait for login to process
      cy.wait(1000);

      // Verify the login success message appears
      // Note: Assuming the second customer's name might be different,
      // we check for the key parts of the message pattern
      cy.get("p")
        .should("contain", "Hello")
        .and("contain", "you are already logged in")
        .and("contain", "You can proceed to checkout");

      // Verify the proceed button is enabled
      cy.get('[data-test="proceed-2"]').should("be.enabled").click();

      // Wait for navigation
      cy.wait(1000);

      // Verify we've reached the address page
      cy.contains("h3", "Blliling Adress").should("be.visible");
      cy.get('[data-test="address"]').should("be.visible");
    });
  });
});
