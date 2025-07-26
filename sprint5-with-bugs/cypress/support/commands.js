// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// Custom command to navigate to a product detail page
Cypress.Commands.add('visitProduct', (productId) => {
  cy.visit(`/product/${productId}`)
  cy.get('[data-test="product-name"]', { timeout: 10000 }).should('be.visible')
})

// Custom command to add product to cart with quantity
Cypress.Commands.add('addToCart', (quantity = 1) => {
  if (quantity > 1) {
    cy.get('body').then($body => {
      if ($body.find('[data-test="quantity"]').length > 0) {
        cy.get('[data-test="quantity"]').clear().type(quantity.toString())
      }
    })
  }
  
  cy.get('[data-test="add-to-cart"]').click()
  cy.get('.toast', { timeout: 5000 }).should('be.visible')
})

// Custom command to check if product is in stock
Cypress.Commands.add('checkProductStock', () => {
  cy.get('body').then($body => {
    const isOutOfStock = $body.find('[data-test="out-of-stock"]').length > 0
    return cy.wrap(isOutOfStock)
  })
})

// Custom command to navigate through product images (if carousel exists)
Cypress.Commands.add('navigateProductImages', () => {
  cy.get('.figure-img').should('be.visible')
  // Add logic for image navigation if carousel exists
})

// Custom command to verify product information completeness
Cypress.Commands.add('verifyProductInfo', () => {
  cy.get('[data-test="product-name"]').should('be.visible').and('not.be.empty')
})

// Custom command to handle toast messages
Cypress.Commands.add('waitForToast', (expectedText = null) => {
  cy.get('.toast', { timeout: 5000 }).should('be.visible')
  
  if (expectedText) {
    cy.get('.toast').should('contain.text', expectedText)
  }
  
  // Optionally wait for toast to disappear
  cy.get('.toast').should('not.exist')
})

// Custom command to check responsive design
Cypress.Commands.add('checkResponsive', (viewport) => {
  cy.viewport(viewport)
  cy.get('[data-test="product-name"]').should('be.visible')
})

// Custom command for keyboard navigation testing
Cypress.Commands.add('tab', () => {
  cy.focused().tab()
})