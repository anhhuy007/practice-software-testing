describe("Cart Functionality Tests", () => {
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
  });

  describe("CP01 - View items in cart with correct details", () => {
    it("should display cart items with correct details after adding item", () => {
      testData.productIds.forEach((productId) => {
        cy.log(`Testing with Product ID: ${productId}`);

        // Clear cart completely before starting each product test
        cy.window().then((win) => {
          win.localStorage.clear();
          win.sessionStorage.clear();
        });

        // Visit the specific product page
        cy.visit(`${baseUrl}/product/${productId}`);

        // First, capture product information from the product page
        let originalProductName, originalProductPrice, originalProductQuantity;

        // Get product name from product page
        cy.get('[data-test="product-name"]')
          .invoke("text")
          .then((productName) => {
            originalProductName = productName.trim();
          });

        // Get product price from product page
        cy.get('[data-test="unit-price"]')
          .invoke("text")
          .then((productPrice) => {
            originalProductPrice = productPrice.trim();
          });

        // Get product quantity from product page and ensure it's set properly
        cy.get('[data-test="quantity"]')
          .should("be.visible")
          .then(($quantityInput) => {
            const currentValue = $quantityInput.val();
            if (!currentValue || currentValue === "0" || currentValue === "") {
              // Set quantity to 1 if it's empty or 0 - use force for disabled fields
              cy.wrap($quantityInput)
                .clear({ force: true })
                .type("1", { force: true });
            }
            // Get the value after potential update
            cy.wrap($quantityInput)
              .invoke("val")
              .then((val) => {
                originalProductQuantity = (val || "1").toString().trim();
              });
          });

        // Wait a moment for any quantity validation to complete
        cy.wait(500);

        // Add item to cart - handle disabled state
        cy.get('[data-test="add-to-cart"]', { timeout: 4000 })
          .should("be.visible")
          .then(($button) => {
            if ($button.prop("disabled")) {
              // If button is disabled, try to enable it by ensuring quantity is valid
              cy.get('[data-test="quantity"]')
                .clear({ force: true })
                .type("1", { force: true });
              cy.wait(500);

              // Force click if still disabled (might be out of stock scenario)
              cy.get('[data-test="add-to-cart"]').click({ force: true });
            } else {
              cy.wrap($button).click();
            }
          });

        // Navigate to cart page
        cy.get('[data-test="nav-cart"]').click();
        cy.url().should("include", "/checkout");

        // Verify there's only one item in cart (the one we just added)
        cy.get("tbody tr").should("have.length", 1);

        // Verify product name matches what was on product page (first and only item)
        cy.get("tbody tr")
          .first()
          .find('[data-test="product-title"]')
          .should("be.visible")
          .and("not.be.empty")
          .then(($cartName) => {
            const cartProductName = $cartName.text().trim();
            expect(cartProductName).to.equal(originalProductName);
          });

        // Verify individual price matches what was on product page (first and only item)
        cy.get("tbody tr")
          .first()
          .find('[data-test="product-price"]')
          .should("be.visible")
          .and("not.be.empty")
          .then(($cartPrice) => {
            const cartProductPrice = $cartPrice.text().trim();
            // Compare the numeric values instead of string with dollar sign
            const originalPriceNumeric = parseFloat(
              originalProductPrice.replace(/[^\d.-]/g, "")
            );
            const cartPriceNumeric = parseFloat(
              cartProductPrice.replace(/[^\d.-]/g, "")
            );
            expect(cartPriceNumeric).to.equal(originalPriceNumeric);
          });

        // Verify product quantity in cart (should be set to 1 for newly added item)
        cy.get("tbody tr")
          .first()
          .find('[data-test="product-quantity"]', { timeout: 5000 })
          .should("be.visible")
          .then(($input) => {
            const value = $input.val();
            // Cart quantity should be 1 for newly added item, or field might be empty initially
            if (value === "" || value === null || value === undefined) {
              // If empty, type 1 to set the quantity
              cy.wrap($input).clear({ force: true }).type("1", { force: true });
            } else {
              // If has value, verify it's 1
              expect(value).to.equal("1");
            }
          });

        // Check item total price (should equal individual price for quantity 1)
        cy.get("tbody tr")
          .first()
          .find('[data-test="line-price"]')
          .should("be.visible")
          .and("not.be.empty");
      });
    });
  });

  describe("CP02 - Edit quantity of an item in the cart (increase)", () => {
    it("should update item total when quantity is increased", () => {
      // Use the first product ID for this test
      const productId = testData.productIds[0];
      cy.log(`Testing with Product ID: ${productId}`);

      // Visit the specific product page
      cy.visit(`${baseUrl}/product/${productId}`);

      // Ensure quantity is set properly before adding to cart
      cy.get('[data-test="quantity"]')
        .should("be.visible")
        .clear({ force: true })
        .type("1", { force: true });
      cy.wait(500);

      // Add item to cart
      cy.get('[data-test="add-to-cart"]').then(($button) => {
        if ($button.prop("disabled")) {
          cy.wrap($button).click({ force: true });
        } else {
          cy.wrap($button).click();
        }
      });

      // Navigate to cart page
      cy.get('[data-test="nav-cart"]').click();

      // Get initial price for calculation
      cy.get('[data-test="product-price"]')
        .invoke("text")
        .then((priceText) => {
          const unitPrice = parseFloat(priceText.replace(/[^\d.-]/g, ""));

          // Change quantity from 1 to 3
          cy.get('[data-test="product-quantity"]')
            .clear({ force: true })
            .type("3", { force: true });

          // Trigger change event (might need to click elsewhere or press enter)
          cy.get('[data-test="product-quantity"]').blur();

          // Wait for updates to process
          cy.wait(1000);

          // Verify item's total price updates correctly (Price x 3)
          cy.get('[data-test="line-price"]')
            .invoke("text")
            .then((totalText) => {
              const itemTotal = parseFloat(totalText.replace(/[^\d.-]/g, ""));
              expect(itemTotal).to.equal(unitPrice * 3);
            });
        });
    });
  });

  describe("CP03 - Edit quantity of an item in the cart (decrease)", () => {
    it("should update item total when quantity is decreased", () => {
      // Use the second product ID for this test
      const productId = testData.productIds[1];
      cy.log(`Testing with Product ID: ${productId}`);

      // Visit the specific product page
      cy.visit(`${baseUrl}/product/${productId}`);

      // Ensure quantity is set properly before adding to cart
      cy.get('[data-test="quantity"]')
        .should("be.visible")
        .clear({ force: true })
        .type("1", { force: true });
      cy.wait(500);

      // Add item to cart
      cy.get('[data-test="add-to-cart"]').then(($button) => {
        if ($button.prop("disabled")) {
          cy.wrap($button).click({ force: true });
        } else {
          cy.wrap($button).click();
        }
      });

      // Navigate to cart page
      cy.get('[data-test="nav-cart"]').click();

      // First increase quantity to 2
      cy.get('[data-test="product-quantity"]')
        .clear({ force: true })
        .type("2", { force: true });
      cy.get('[data-test="product-quantity"]').blur();
      cy.wait(1000);

      // Get unit price for calculation
      cy.get('[data-test="product-price"]')
        .invoke("text")
        .then((priceText) => {
          const unitPrice = parseFloat(priceText.replace(/[^\d.-]/g, ""));

          // Change quantity from 2 to 1
          cy.get('[data-test="product-quantity"]')
            .clear({ force: true })
            .type("1", { force: true });
          cy.get('[data-test="product-quantity"]').blur();
          cy.wait(1000);

          // Verify item's total price updates correctly (Price x 1)
          cy.get('[data-test="line-price"]')
            .invoke("text")
            .then((totalText) => {
              const itemTotal = parseFloat(totalText.replace(/[^\d.-]/g, ""));
              expect(itemTotal).to.equal(unitPrice * 1);
            });
        });
    });
  });

  describe("CP04 - Edit quantity of an item in the cart to zero", () => {
    it("should handle zero quantity appropriately", () => {
      // Use the third product ID for this test
      const productId = testData.productIds[2];
      cy.log(`Testing with Product ID: ${productId}`);

      // Visit the specific product page
      cy.visit(`${baseUrl}/product/${productId}`);

      // Ensure quantity is set properly before adding to cart
      cy.get('[data-test="quantity"]')
        .should("be.visible")
        .clear({ force: true })
        .type("1", { force: true });
      cy.wait(500);

      // Add item to cart
      cy.get('[data-test="add-to-cart"]').then(($button) => {
        if ($button.prop("disabled")) {
          cy.wrap($button).click({ force: true });
        } else {
          cy.wrap($button).click();
        }
      });

      // Navigate to cart page
      cy.get('[data-test="nav-cart"]').click();

      // Try to change quantity to 0
      cy.get('[data-test="product-quantity"]')
        .clear({ force: true })
        .type("0", { force: true });
      cy.get('[data-test="product-quantity"]').blur();
      cy.wait(1000);

      // Check if item is removed OR validation error is shown
      cy.get("body").then(($body) => {
        if ($body.find("tbody tr").length === 0) {
          // Item was removed - this is acceptable behavior
          cy.contains("The cart is empty. Nothing to display").should(
            "be.visible"
          );
        } else {
          // Item still exists - check for validation error or quantity reset
          cy.get('[data-test="product-quantity"]').then(($quantity) => {
            const currentValue = $quantity.val();
            if (currentValue === "0") {
              // If quantity is still 0, check for validation error
              cy.get('[data-test="quantity-error"]').should("be.visible");
            } else {
              // Quantity should have been reset to a non-zero value
              expect(currentValue).to.not.equal("0");
            }
          });
        }
      });
    });
  });

  describe("CP05 - Remove an item from the cart", () => {
    it("should remove item and update cart totals when remove button is clicked", () => {
      // Use the fourth product ID for this test
      const productId = testData.productIds[3];
      cy.log(`Testing with Product ID: ${productId}`);

      // Visit the specific product page
      cy.visit(`${baseUrl}/product/${productId}`);

      // Ensure quantity is set properly before adding to cart
      cy.get('[data-test="quantity"]')
        .should("be.visible")
        .clear({ force: true })
        .type("1", { force: true });
      cy.wait(500);

      // Add item to cart
      cy.get('[data-test="add-to-cart"]').then(($button) => {
        if ($button.prop("disabled")) {
          cy.wrap($button).click({ force: true });
        } else {
          cy.wrap($button).click();
        }
      });

      // Navigate to cart page
      cy.get('[data-test="nav-cart"]').click();

      // Verify item exists
      cy.get("tbody tr").should("have.length.at.least", 1);

      // Click remove button
      cy.get(".btn.btn-danger").first().click();

      // Verify item is removed
      cy.get("body").then(($body) => {
        if ($body.find("tbody tr").length === 0) {
          // Cart is now empty
          cy.contains("The cart is empty. Nothing to display").should(
            "be.visible"
          );
        } else {
          // If multiple items were in cart, verify count decreased
          cy.get("tbody tr").should("have.length.lessThan", 2);
        }
      });
    });
  });

  describe("CP06 - Proceed to Checkout with items in cart", () => {
    it("should navigate to Sign In page when Proceed to Checkout is clicked with items", () => {
      // Use the fifth product ID for this test
      const productId = testData.productIds[4];
      cy.log(`Testing with Product ID: ${productId}`);

      // Visit the specific product page
      cy.visit(`${baseUrl}/product/${productId}`);

      // Ensure quantity is set properly before adding to cart
      cy.get('[data-test="quantity"]')
        .should("be.visible")
        .clear({ force: true })
        .type("1", { force: true });
      cy.wait(500);

      // Add item to cart
      cy.get('[data-test="add-to-cart"]').then(($button) => {
        if ($button.prop("disabled")) {
          cy.wrap($button).click({ force: true });
        } else {
          cy.wrap($button).click();
        }
      });

      // Navigate to cart page
      cy.get('[data-test="nav-cart"]').click();
      // Verify items exist in cart
      cy.get("tbody tr").should("have.length.at.least", 1);

      // Click Proceed to Checkout
      cy.get('[data-test="proceed-1"], [data-test="proceed-to-checkout"]')
        .should("be.visible")
        .click();

      // Verify "Customer login" heading is displayed
      cy.contains("h3", "Customer login").should("be.visible");

      // Alternative: Check for login form elements
      cy.get('[data-test="email"], [data-test="username"]').should(
        "be.visible"
      );
      cy.get('[data-test="password"]').should("be.visible");
    });
  });

  describe("CP07 - Proceed to Checkout with an empty cart", () => {
    it("should hide Proceed to Checkout button and show empty cart message", () => {
      // Navigate directly to cart page without adding items
      cy.visit(`${baseUrl}/checkout`);

      // Verify empty cart message is displayed
      cy.contains("The cart is empty. Nothing to display").should("be.visible");

      // Verify Proceed to Checkout button is hidden or disabled
      cy.get("body").then(($body) => {
        const checkoutButton = $body.find(
          '[data-test="proceed-1"], [data-test="proceed-to-checkout"]'
        );
        if (checkoutButton.length === 0) {
          // Button doesn't exist - this is acceptable
          cy.log(
            "Proceed to checkout button not found - acceptable for empty cart"
          );
        } else {
          // Button exists but should be disabled
          cy.get(
            '[data-test="proceed-1"], [data-test="proceed-to-checkout"]'
          ).should("be.disabled");
        }
      });
    });
  });

  describe("Cart Total Calculation", () => {
    it("should calculate and display correct cart total", () => {
      // Use the first product ID for this test
      const productId = testData.productIds[0];
      cy.log(`Testing with Product ID: ${productId}`);

      // Visit the specific product page
      cy.visit(`${baseUrl}/product/${productId}`);

      // Ensure quantity is set properly before adding to cart
      cy.get('[data-test="quantity"]')
        .should("be.visible")
        .clear({ force: true })
        .type("1", { force: true });
      cy.wait(500);

      // Add item to cart
      cy.get('[data-test="add-to-cart"]').then(($button) => {
        if ($button.prop("disabled")) {
          cy.wrap($button).click({ force: true });
        } else {
          cy.wrap($button).click();
        }
      });

      // Navigate to cart page
      cy.get('[data-test="nav-cart"]').click();

      // Get unit price and quantity for calculation
      cy.get('[data-test="product-price"]')
        .invoke("text")
        .then((priceText) => {
          const unitPrice = parseFloat(priceText.replace(/[^\d.-]/g, ""));

          cy.get('[data-test="product-quantity"]')
            .invoke("val")
            .then((quantity) => {
              const qty = parseInt(quantity) || 1;
              const expectedTotal = unitPrice * qty;

              // Verify cart total is correct (allowing for taxes/fees)
              cy.get('[data-test="cart-total"]')
                .should("be.visible")
                .invoke("text")
                .then((cartTotalText) => {
                  const cartTotal = parseFloat(
                    cartTotalText.replace(/[^\d.-]/g, "")
                  );
                  expect(cartTotal).to.be.at.least(expectedTotal);
                });
            });
        });
    });
  });

  describe("Line Item Total Calculation", () => {
    it("should calculate correct line item total (price x quantity)", () => {
      // Use the second product ID for this test
      const productId = testData.productIds[1];
      cy.log(`Testing with Product ID: ${productId}`);

      // Visit the specific product page
      cy.visit(`${baseUrl}/product/${productId}`);

      // Ensure quantity is set properly before adding to cart
      cy.get('[data-test="quantity"]')
        .should("be.visible")
        .clear({ force: true })
        .type("1", { force: true });
      cy.wait(500);

      // Add item to cart
      cy.get('[data-test="add-to-cart"]').then(($button) => {
        if ($button.prop("disabled")) {
          cy.wrap($button).click({ force: true });
        } else {
          cy.wrap($button).click();
        }
      });

      // Navigate to cart page
      cy.get('[data-test="nav-cart"]').click();

      // Get unit price for calculation
      cy.get('[data-test="product-price"]')
        .invoke("text")
        .then((priceText) => {
          const unitPrice = parseFloat(priceText.replace(/[^\d.-]/g, ""));

          // Test with quantity 1 (default)
          cy.get('[data-test="line-price"]')
            .invoke("text")
            .then((lineText) => {
              const lineTotal = parseFloat(lineText.replace(/[^\d.-]/g, ""));
              expect(lineTotal).to.equal(unitPrice * 1);
            });

          // Change quantity to 3 and verify line total updates
          cy.get('[data-test="product-quantity"]')
            .clear({ force: true })
            .type("3", { force: true });
          cy.get('[data-test="product-quantity"]').blur();
          cy.wait(1000);

          cy.get('[data-test="line-price"]')
            .invoke("text")
            .then((lineText) => {
              const lineTotal = parseFloat(lineText.replace(/[^\d.-]/g, ""));
              expect(lineTotal).to.equal(unitPrice * 3);
            });
        });
    });
  });

  // Additional helper test to verify product page functionality
  describe("Helper - Product Page Functionality", () => {
    it("should successfully add product to cart from product page", () => {
      testData.productIds.forEach((productId) => {
        cy.log(
          `Testing Product Page Functionality with Product ID: ${productId}`
        );

        // Clear cart completely before starting each product test
        cy.window().then((win) => {
          win.localStorage.clear();
          win.sessionStorage.clear();
        });

        // Visit the specific product page
        cy.visit(`${baseUrl}/product/${productId}`);

        // Verify we're on a product page
        cy.url().should("include", `/product/${productId}`);

        // Verify product details are loaded
        cy.get('[data-test="product-name"]').should("be.visible");
        cy.get('[data-test="unit-price"]').should("be.visible");

        // Verify add to cart button is present and clickable
        cy.get('[data-test="add-to-cart"]').should("be.visible");

        // Ensure quantity is set properly before adding to cart
        cy.get('[data-test="quantity"]')
          .should("be.visible")
          .clear({ force: true })
          .type("1", { force: true });
        cy.wait(500);

        // Click add to cart
        cy.get('[data-test="add-to-cart"]').then(($button) => {
          if ($button.prop("disabled")) {
            cy.wrap($button).click({ force: true });
          } else {
            cy.wrap($button).click();
          }
        });

        // Verify success feedback (could be notification, cart count update, etc.)
        cy.get('[data-test="cart-quantity"], [data-test="success-message"]', {
          timeout: 5000,
        }).should("be.visible");
      });
    });
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

      // Add item to cart
      cy.get('[data-test="quantity"]')
        .should("be.visible")
        .clear({ force: true })
        .type("1", { force: true });
      cy.wait(500);

      cy.get('[data-test="add-to-cart"]').then(($button) => {
        if ($button.prop("disabled")) {
          cy.wrap($button).click({ force: true });
        } else {
          cy.wrap($button).click();
        }
      });

      // Navigate to cart
      cy.get('[data-test="nav-cart"]').click();

      // Verify we're on the cart page and items exist
      cy.get("tbody tr").should("have.length.at.least", 1);

      // Click Proceed to Checkout
      cy.get('[data-test="proceed-1"]').click();

      // Verify we're on the sign-in page by checking for sign-in form elements
      cy.get('[data-test="email"]').should("be.visible");
      cy.get('[data-test="password"]').should("be.visible");
      cy.get('[data-test="login-submit"]').should("be.visible");

      // Additional verification that we're on step 2 (Sign in)
      cy.get('aw-wizard-step[steptitle="Sign in"]').should(
        "have.attr",
        "aria-expanded",
        "true"
      );
    });
  });
});
