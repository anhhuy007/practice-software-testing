// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

// Global setup for handling authentication API calls
beforeEach(() => {
  // Intercept the user authentication check that returns 401 when not logged in
  // This prevents test failures due to expected authentication failures
  cy.intercept('GET', '**/users/me', { statusCode: 401, body: { message: 'Unauthorized' } }).as('globalGetUserMe')
  
  // Optionally intercept other auth-related endpoints that might cause similar issues
  cy.intercept('GET', '**/auth/verify', { statusCode: 401, body: { message: 'Unauthorized' } }).as('globalAuthVerify')
})