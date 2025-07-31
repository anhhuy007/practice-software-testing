// Import commands.js using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Add global configurations
beforeEach(() => {
  // Set viewport size
  cy.viewport(1280, 720);
  
  // Handle uncaught exceptions to prevent test failures due to app errors
  cy.on('uncaught:exception', (err, runnable) => {
    // Return false to prevent the error from failing the test
    // You can customize this to handle specific errors
    if (err.message.includes('ResizeObserver loop limit exceeded')) {
      return false;
    }
    if (err.message.includes('Non-Error promise rejection captured')) {
      return false;
    }
    // Let other errors fail the test
    return true;
  });
});

// Set default command timeout
Cypress.config('defaultCommandTimeout', 10000);
Cypress.config('pageLoadTimeout', 30000);

// Add custom configuration
Cypress.env('baseUrl', Cypress.env('baseUrl') || 'http://localhost:4200/#');
