/**
 * Checkout Process Tests
 * 
 * CS423 - Software Testing
 * Student: anhhuy007
 * 
 * This test suite verifies the complete checkout process
 * using data-driven testing approach.
 * 
 * All test data is loaded from fixtures/data/cart-checkout-data.json
 * and fixtures/data/payment-data.json
 * 
 * Features:
 * - Robust error handling for missing test data
 * - Data-driven product selection and shipping details
 * - Multiple payment methods testing
 * - Cross-browser compatible
 * - Screenshot capture for reporting
 * 
 * Date: August 1, 2025
 * Version: 1.0
 */
/// <reference types="cypress" />

import { logTestInfo } from "../../support/helpers/payment-test-utils";

describe("Checkout Process Tests", () => {
  // Data variables for all tests
  let testData;
  let testMetaData;
  let baseUrl;
  let products;
  let addressData;
  let paymentData;
  let selectors;
  let screenshotConfig;

  before(() => {
    // Set default values in case fixture loading fails
    baseUrl = Cypress.env("baseUrl") || "http://localhost:4200/#";
    testMetaData = {
      currentDateTime: new Date().toISOString(),
      currentUser: "anhhuy007",
      testType: "Data-Driven Testing",
      version: "1.0"
    };

    // Load cart & checkout test data from fixture
    cy.fixture("data/cart-checkout-data").then((data) => {
      testData = data;
      testMetaData = data.testMetaData || testMetaData;
      baseUrl = data.baseUrl || baseUrl;
      products = data.products;
      addressData = data.address;
      selectors = data.selectors;
      screenshotConfig = data.screenshots;
    });

    // Load payment test data from fixture
    cy.fixture("data/payment-data").then((data) => {
      paymentData = data;
    });
  });

  beforeEach(() => {
    // Clear cookies and local storage to ensure clean state for each test
    cy.clearCookies();
    cy.clearLocalStorage();
    
    // Visit the home page before each test
    cy.visit(baseUrl);
  });

  /**
   * Helper function to add products to cart
   */
  const addProductsToCart = () => {
    products.forEach((product) => {
      // Visit the product page
      cy.visit(`${baseUrl}/product/${product.id}`);
      cy.wait(1000);
      
      // Set quantity
      cy.get(selectors.cart.quantityInput)
        .should("be.visible")
        .clear()
        .type(product.quantity.toString(), { delay: 10 });
      
      // Add to cart
      cy.get(selectors.cart.addToCartButton)
        .should("be.visible")
        .click();
    });
    
    // Navigate to cart
    cy.get(selectors.cart.cartIcon).click();
    cy.wait(1000);
  };

  /**
   * Helper function to fill shipping address form
   */
  const fillShippingAddress = () => {
    // Fill in shipping details from data file
    cy.get(selectors.checkout.firstName)
      .should("be.visible")
      .clear()
      .type(addressData.firstName);
    
    cy.get(selectors.checkout.lastName)
      .should("be.visible")
      .clear()
      .type(addressData.lastName);
    
    cy.get(selectors.checkout.address)
      .should("be.visible")
      .clear()
      .type(addressData.address);
    
    cy.get(selectors.checkout.city)
      .should("be.visible")
      .clear()
      .type(addressData.city);
    
    cy.get(selectors.checkout.state)
      .should("be.visible")
      .clear()
      .type(addressData.state);
    
    cy.get(selectors.checkout.postcode)
      .should("be.visible")
      .clear()
      .type(addressData.postcode);
    
    cy.get(selectors.checkout.email)
      .should("be.visible")
      .clear()
      .type(addressData.email);
    
    cy.get(selectors.checkout.phone)
      .should("be.visible")
      .clear()
      .type(addressData.phone);
  };

  describe("CHECKOUT-01 - Verify Checkout Process with Bank Transfer", () => {
    it("should complete the checkout process with bank transfer payment method", () => {
      // Add products to cart
      addProductsToCart();
      
      // Proceed to checkout
      cy.get(selectors.cart.checkoutButton)
        .should("be.visible")
        .click();
      
      // Take screenshot of checkout page
      cy.screenshot(`${screenshotConfig.checkout.prefix}checkout-page`, { 
        capture: 'viewport', 
        overwrite: true 
      });
      
      // Fill shipping address
      fillShippingAddress();
      
      // Select Bank Transfer payment method
      cy.get(selectors.checkout.bankTransferOption)
        .should("be.visible")
        .click();
      
      // Take screenshot before final checkout
      cy.screenshot(`${screenshotConfig.checkout.prefix}bank-transfer-selected`, { 
        capture: 'viewport', 
        overwrite: true 
      });
      
      // Complete checkout
      cy.get(selectors.checkout.completeOrderButton)
        .should("be.visible")
        .click();
      
      cy.wait(3000); // Wait for order processing
      
      // Take screenshot of confirmation
      cy.screenshot(`${screenshotConfig.checkout.prefix}order-confirmation`, { 
        capture: 'viewport', 
        overwrite: true 
      });
      
      // Verify order confirmation
      cy.get(selectors.checkout.orderConfirmation)
        .should("be.visible")
        .should("contain", addressData.confirmationText);
      
      cy.get(selectors.checkout.orderNumber)
        .should("be.visible");
      
      // Log test information
      logTestInfo(testMetaData);
    });
  });

  describe("CHECKOUT-02 - Verify Checkout Process with Credit Card", () => {
    it("should complete the checkout process with credit card payment method", () => {
      // Add products to cart
      addProductsToCart();
      
      // Proceed to checkout
      cy.get(selectors.cart.checkoutButton)
        .should("be.visible")
        .click();
      
      // Fill shipping address
      fillShippingAddress();
      
      // Select Credit Card payment method
      cy.get(selectors.checkout.creditCardOption)
        .should("be.visible")
        .click();
      
      // Fill credit card details
      const card = paymentData.creditCard;
      
      cy.get(selectors.checkout.creditCardName)
        .should("be.visible")
        .clear()
        .type(card.name);
      
      cy.get(selectors.checkout.creditCardNumber)
        .should("be.visible")
        .clear()
        .type(card.number);
      
      cy.get(selectors.checkout.creditCardExpiry)
        .should("be.visible")
        .clear()
        .type(card.expiry);
      
      cy.get(selectors.checkout.creditCardCvv)
        .should("be.visible")
        .clear()
        .type(card.cvv);
      
      // Take screenshot before final checkout
      cy.screenshot(`${screenshotConfig.checkout.prefix}credit-card-filled`, { 
        capture: 'viewport', 
        overwrite: true 
      });
      
      // Complete checkout
      cy.get(selectors.checkout.completeOrderButton)
        .should("be.visible")
        .click();
      
      cy.wait(3000); // Wait for order processing
      
      // Take screenshot of confirmation
      cy.screenshot(`${screenshotConfig.checkout.prefix}order-confirmation-cc`, { 
        capture: 'viewport', 
        overwrite: true 
      });
      
      // Verify order confirmation
      cy.get(selectors.checkout.orderConfirmation)
        .should("be.visible")
        .should("contain", addressData.confirmationText);
      
      cy.get(selectors.checkout.orderNumber)
        .should("be.visible");
      
      // Log test information
      logTestInfo(testMetaData);
    });
  });

  describe("CHECKOUT-03 - Verify Form Validation", () => {
    it("should display validation errors when submitting incomplete form", () => {
      // Add products to cart
      addProductsToCart();
      
      // Proceed to checkout
      cy.get(selectors.cart.checkoutButton)
        .should("be.visible")
        .click();
      
      // Leave form fields empty
      // Submit form without filling in details
      cy.get(selectors.checkout.completeOrderButton)
        .should("be.visible")
        .click();
      
      // Take screenshot of validation errors
      cy.screenshot(`${screenshotConfig.checkout.prefix}validation-errors`, { 
        capture: 'viewport', 
        overwrite: true 
      });
      
      // Verify validation errors for required fields
      cy.get(selectors.checkout.errorMessages)
        .should("be.visible")
        .should("have.length.at.least", 1);
      
      // Log test information
      logTestInfo(testMetaData);
    });
  });

  describe("CHECKOUT-04 - Verify Order Summary", () => {
    it("should correctly display order summary with correct totals", () => {
      // Add products to cart
      addProductsToCart();
      
      // Calculate expected total
      let expectedTotal = 0;
      products.forEach((product) => {
        const productPrice = parseFloat(product.price.replace("$", ""));
        expectedTotal += productPrice * product.quantity;
      });
      
      // Proceed to checkout
      cy.get(selectors.cart.checkoutButton)
        .should("be.visible")
        .click();
      
      // Verify order summary items
      cy.get(selectors.checkout.orderSummaryItems)
        .should("have.length", products.length);
      
      // Verify subtotal
      cy.get(selectors.checkout.subtotal)
        .should("be.visible")
        .invoke("text")
        .then((text) => {
          const subtotal = parseFloat(text.replace(/[^0-9.]/g, ""));
          expect(subtotal).to.be.closeTo(expectedTotal, 0.01);
        });
      
      // Take screenshot of order summary
      cy.screenshot(`${screenshotConfig.checkout.prefix}order-summary`, { 
        capture: 'viewport', 
        overwrite: true 
      });
      
      // Log test information
      logTestInfo(testMetaData);
    });
  });

  describe("CHECKOUT-05 - Verify Different Shipping Methods", () => {
    it("should allow selecting different shipping methods and update totals", () => {
      // Add products to cart
      addProductsToCart();
      
      // Proceed to checkout
      cy.get(selectors.cart.checkoutButton)
        .should("be.visible")
        .click();
      
      // Fill shipping address
      fillShippingAddress();
      
      // Check if standard shipping is selected by default
      cy.get(selectors.checkout.standardShippingOption)
        .should("be.visible")
        .should("be.checked");
      
      // Take screenshot of standard shipping
      cy.screenshot(`${screenshotConfig.checkout.prefix}standard-shipping`, { 
        capture: 'viewport', 
        overwrite: true 
      });
      
      // Remember standard shipping total
      let standardShippingTotal;
      cy.get(selectors.checkout.totalAmount)
        .invoke("text")
        .then((text) => {
          standardShippingTotal = parseFloat(text.replace(/[^0-9.]/g, ""));
        });
      
      // Select express shipping
      cy.get(selectors.checkout.expressShippingOption)
        .should("be.visible")
        .click();
      
      cy.wait(1000); // Wait for total to update
      
      // Take screenshot of express shipping
      cy.screenshot(`${screenshotConfig.checkout.prefix}express-shipping`, { 
        capture: 'viewport', 
        overwrite: true 
      });
      
      // Verify total increased with express shipping
      cy.get(selectors.checkout.totalAmount)
        .invoke("text")
        .then((text) => {
          const expressShippingTotal = parseFloat(text.replace(/[^0-9.]/g, ""));
          expect(expressShippingTotal).to.be.greaterThan(standardShippingTotal);
        });
      
      // Log test information
      logTestInfo(testMetaData);
    });
  });
});
