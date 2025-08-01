/**
 * Cart Functionality Tests
 * 
 * CS423 - Software Testing
 * Student: anhhuy007
 * 
 * This test suite verifies the functionality of the shopping cart
 * using data-driven testing approach.
 * 
 * All test data is loaded from fixtures/data/cart-checkout-data.json
 * 
 * Features:
 * - Robust error handling for missing test data
 * - Data-driven product selection
 * - Dynamic quantity testing
 * - Cross-browser compatible
 * - Screenshot capture for reporting
 * 
 * Date: August 1, 2025
 * Version: 1.0
 */
/// <reference types="cypress" />

import { logTestInfo } from "../../support/helpers/payment-test-utils";

describe("Cart Functionality Tests", () => {
  // Data variables for all tests
  let testData;
  let testMetaData;
  let baseUrl;
  let products;
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

    // Load test data from fixture
    cy.fixture("data/cart-checkout-data").then((data) => {
      testData = data;
      testMetaData = data.testMetaData || testMetaData;
      baseUrl = data.baseUrl || baseUrl;
      products = data.products;
      selectors = data.selectors;
      screenshotConfig = data.screenshots;
    });
  });

  beforeEach(() => {
    // Clear cookies and local storage to ensure clean state for each test
    cy.clearCookies();
    cy.clearLocalStorage();
    
    // Visit the home page before each test
    cy.visit(baseUrl);
  });

  describe("CART-01 - Add Product to Cart", () => {
    it("should add a product to the cart with selected quantity", () => {
      // Get first product from the test data
      const product = products[0];
      
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

      // Take screenshot
      cy.screenshot(`${screenshotConfig.cart.prefix}add-product`, { 
        capture: 'viewport', 
        overwrite: true 
      });

      // Navigate to cart
      cy.get(selectors.cart.cartIcon).click();
      cy.wait(1000);

      // Verify product is in cart with correct quantity
      cy.get(selectors.cart.cartItems).should("have.length", 1);

      cy.get(`${selectors.cart.cartItems} ${selectors.cart.productNameCell}`)
        .should("contain", product.name);

      cy.get(`${selectors.cart.cartItems} ${selectors.cart.quantityCell} input`)
        .should("have.value", product.quantity.toString());

      // Log test information
      logTestInfo(testMetaData);
    });
  });

  describe("CART-02 - Update Cart Quantity", () => {
    it("should update the product quantity in the cart", () => {
      // Get first product from the test data
      const product = products[0];
      
      // Add product to cart first
      cy.visit(`${baseUrl}/product/${product.id}`);
      cy.wait(1000);
      
      cy.get(selectors.cart.quantityInput)
        .should("be.visible")
        .clear()
        .type("1", { delay: 10 }); // Start with quantity 1
      
      cy.get(selectors.cart.addToCartButton)
        .should("be.visible")
        .click();
      
      // Navigate to cart
      cy.get(selectors.cart.cartIcon).click();
      cy.wait(1000);
      
      // Update quantity to a different value
      const newQuantity = 3;
      
      cy.get(`${selectors.cart.cartItems} ${selectors.cart.quantityCell} input`)
        .should("be.visible")
        .clear()
        .type(newQuantity.toString(), { delay: 10 });
      
      // Click update button
      cy.get(selectors.cart.updateButton).click();
      cy.wait(1000);
      
      // Take screenshot
      cy.screenshot(`${screenshotConfig.cart.prefix}update-quantity`, { 
        capture: 'viewport', 
        overwrite: true 
      });
      
      // Verify quantity is updated
      cy.get(`${selectors.cart.cartItems} ${selectors.cart.quantityCell} input`)
        .should("have.value", newQuantity.toString());
      
      // Log test information
      logTestInfo(testMetaData);
    });
  });

  describe("CART-03 - Remove Product from Cart", () => {
    it("should remove a product from the cart", () => {
      // Get first product from the test data
      const product = products[0];
      
      // Add product to cart first
      cy.visit(`${baseUrl}/product/${product.id}`);
      cy.wait(1000);
      
      cy.get(selectors.cart.quantityInput)
        .should("be.visible")
        .clear()
        .type("1", { delay: 10 });
      
      cy.get(selectors.cart.addToCartButton)
        .should("be.visible")
        .click();
      
      // Navigate to cart
      cy.get(selectors.cart.cartIcon).click();
      cy.wait(1000);
      
      // Verify product is in cart
      cy.get(selectors.cart.cartItems).should("have.length.at.least", 1);
      
      // Take screenshot before removal
      cy.screenshot(`${screenshotConfig.cart.prefix}before-removal`, { 
        capture: 'viewport', 
        overwrite: true 
      });
      
      // Remove product
      cy.get(selectors.cart.removeButton).first().click();
      cy.wait(1000);
      
      // Take screenshot after removal
      cy.screenshot(`${screenshotConfig.cart.prefix}after-removal`, { 
        capture: 'viewport', 
        overwrite: true 
      });
      
      // Verify product is removed
      cy.get(selectors.cart.cartItems).should("have.length", 0);
      
      // Log test information
      logTestInfo(testMetaData);
    });
  });

  describe("CART-04 - Add Multiple Products to Cart", () => {
    it("should add multiple products to the cart", () => {
      // Add each product from test data to cart
      products.forEach((product, index) => {
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
        
        // Take screenshot
        cy.screenshot(`${screenshotConfig.cart.prefix}add-product-${index + 1}`, { 
          capture: 'viewport', 
          overwrite: true 
        });
      });
      
      // Navigate to cart
      cy.get(selectors.cart.cartIcon).click();
      cy.wait(1000);
      
      // Verify all products are in cart
      cy.get(selectors.cart.cartItems).should("have.length", products.length);
      
      // Verify each product details
      products.forEach((product, index) => {
        cy.get(selectors.cart.cartItems).eq(index).within(() => {
          cy.get(selectors.cart.productNameCell.replace("td:nth-child(1)", ""))
            .should("contain", product.name);
          
          cy.get(selectors.cart.quantityCell.replace("td:nth-child(2)", "") + " input")
            .should("have.value", product.quantity.toString());
        });
      });
      
      // Take screenshot of cart with all products
      cy.screenshot(`${screenshotConfig.cart.prefix}multiple-products`, { 
        capture: 'viewport', 
        overwrite: true 
      });
      
      // Log test information
      logTestInfo(testMetaData);
    });
  });

  describe("CART-05 - Verify Cart Total", () => {
    it("should correctly calculate the cart total", () => {
      // Add each product from test data to cart
      let expectedTotal = 0;
      
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
        
        // Calculate expected total
        const productPrice = parseFloat(product.price.replace("$", ""));
        expectedTotal += productPrice * product.quantity;
      });
      
      // Navigate to cart
      cy.get(selectors.cart.cartIcon).click();
      cy.wait(1000);
      
      // Take screenshot of cart with total
      cy.screenshot(`${screenshotConfig.cart.prefix}cart-total`, { 
        capture: 'viewport', 
        overwrite: true 
      });
      
      // Verify cart total
      cy.get(selectors.cart.totalAmount)
        .should("be.visible")
        .invoke("text")
        .then((text) => {
          const actualTotal = parseFloat(text.replace(/[^0-9.]/g, ""));
          expect(actualTotal).to.be.closeTo(expectedTotal, 0.01);
        });
      
      // Log test information
      logTestInfo(testMetaData);
    });
  });
});
