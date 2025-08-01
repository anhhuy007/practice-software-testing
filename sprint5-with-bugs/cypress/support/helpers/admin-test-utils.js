/**
 * Admin Test Utilities
 * Contains helper functions for admin testing
 * 
 * CS423 - Software Testing
 * Student: anhhuy007
 * Date: August 1, 2025
 * Version: 1.1
 */

// Helper function to log test information
export function logTestInfo(testMetaData) {
  cy.log(`Test run at: ${testMetaData.currentDateTime}`);
  cy.log(`Current user: ${testMetaData.currentUser}`);
  cy.log(`Test type: ${testMetaData.testType || 'Not specified'}`);
  cy.log(`Version: ${testMetaData.version || 'Not specified'}`);
}

// Helper function to take screenshots with consistent naming and path
export function takeScreenshot(screenshotData, name, options = {}) {
  const path = screenshotData?.path || 'cypress/screenshots';
  const prefix = screenshotData?.prefix || '';
  const fullName = `${prefix}${name}`;
  
  const defaultOptions = { 
    capture: 'viewport', 
    overwrite: true 
  };
  
  return cy.screenshot(fullName, { ...defaultOptions, ...options });
}

// Helper function for admin login
export function adminLogin(baseUrl, adminCredentials) {
  cy.visit(`${baseUrl}/auth/login`);

  // Fill in admin credentials
  cy.get("body").then(() => {
    cy.get('[data-test="email"]', { timeout: 10000 })
      .should("be.visible")
      .click()
      .clear()
      .type(adminCredentials.email, { delay: 10 });
  });

  cy.wait(500);

  cy.get("body").then(() => {
    cy.get('[data-test="password"]', { timeout: 10000 })
      .should("be.visible")
      .click()
      .clear()
      .type(adminCredentials.password, { delay: 10 });
  });

  // Submit the login form
  cy.get('[data-test="login-submit"]').should("be.visible").click();

  cy.wait(2000);
}

// Helper function to navigate to a specific invoice detail page
export function navigateToInvoiceDetail(baseUrl, invoiceNumber) {
  cy.visit(`${baseUrl}/admin/dashboard`);
  cy.wait(2000);

  // Find the invoice and click on it
  cy.get("table tbody tr").each(($row) => {
    const rowInvoiceNumber = $row.find("td:first").text().trim();
    if (rowInvoiceNumber === invoiceNumber) {
      cy.wrap($row).find("td:last a").click();
      cy.wait(2000);
      return false; // Break the each loop
    }
  });
}
