describe('Sample Test Suite', () => {
  it('should visit the homepage', () => {
    cy.visit('/');
    cy.title().should('contain', 'Practice Software Testing');
  });

  it('should find navigation elements', () => {
    cy.visit('/');
    cy.get('nav').should('be.visible');
  });

  it('should demonstrate a failing test', () => {
    cy.visit('/');
    // This test will fail intentionally to show error reporting
    cy.get('.non-existent-element').should('exist');
  });
});
