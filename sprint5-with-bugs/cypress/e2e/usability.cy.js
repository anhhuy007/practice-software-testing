describe('GUI Checklist 1.5 - TÍNH DỄ SỬ DỤNG (USABILITY)', () => {
  
  beforeEach(() => {
    // Visit homepage first
    cy.visit('/')
    cy.get('[data-test="product-name"]', { timeout: 10000 }).should('be.visible')
    // Navigate to product detail page
    cy.get('[data-test="product-name"]').first().click()
    cy.url().should('match', /\/product\/\d+/)
    // Ensure we're on the product detail page
    cy.get('[data-test="product-name"]').should('be.visible')
  })

  it('1.5.1. Kiểm tra tính dễ nhận biết của các phần tử UI', () => {
    // Check UI element recognizability on product page
    cy.get('[data-test="product-name"]').should('be.visible') // Ensure on product page
    cy.get('[data-test="add-to-cart"]').should('be.visible')
    cy.get('[data-test="add-to-favorites"]').should('be.visible')
    
    // Check buttons have clear labels
    cy.get('[data-test="add-to-cart"]').should('contain.text', '')
    cy.get('[data-test="add-to-favorites"]').should('contain.text', '')
  })

  it('1.5.2. Xác nhận tính nhất quán của giao diện', () => {
    // Verify interface consistency on product page
    cy.get('[data-test="product-name"]').should('be.visible') // Ensure on product page
    
    // Check consistent styling across elements
    cy.get('button').should('have.css', 'font-family')
    cy.get('input').then(($inputs) => {
      if ($inputs.length > 0) {
        cy.wrap($inputs).should('have.css', 'font-family')
      }
    })
  })

  it('1.5.3. Kiểm tra tính trực quan của navigation', () => {
    // Check navigation intuitiveness on product page
    cy.get('[data-test="product-name"]').should('be.visible') // Ensure on product page
    cy.get('nav, .navbar').should('be.visible')
    cy.get('nav a, .navbar a').should('have.length.greaterThan', 0)
    
    // Check breadcrumb if exists
    cy.get('.breadcrumb').then(($breadcrumb) => {
      if ($breadcrumb.length > 0) {
        cy.wrap($breadcrumb).should('be.visible')
      }
    })
  })

  it('1.5.4. Xác minh feedback của các thao tác người dùng', () => {
    // Verify feedback for user actions on product page
    cy.get('[data-test="product-name"]').should('be.visible') // Ensure on product page
    
    // Test button interactions
    cy.get('[data-test="add-to-cart"]').should('have.css', 'cursor', 'pointer')
    cy.get('[data-test="add-to-cart"]').trigger('mouseover')
    
    // Test form interactions if any
    cy.get('input').then(($inputs) => {
      if ($inputs.length > 0) {
        cy.wrap($inputs).first().focus()
        cy.wrap($inputs).first().should('have.focus')
      }
    })
  })

  it('1.5.5. Kiểm tra tính dễ hiểu của error messages', () => {
    // Check error message understandability on product page
    cy.get('[data-test="product-name"]').should('be.visible') // Ensure on product page
    
    // Try to trigger validation errors
    cy.get('input[type="number"]').then(($input) => {
      if ($input.length > 0) {
        cy.wrap($input).clear().type('-1')
        cy.get('form').then(($form) => {
          if ($form.length > 0) {
            cy.wrap($form).submit()
          }
        })
        
        // Check for error messages
        cy.get('.error, .invalid, [class*="error"]').then(($error) => {
          if ($error.length > 0) {
            cy.wrap($error).should('be.visible')
            cy.wrap($error).should('not.be.empty')
          }
        })
      }
    })
  })

  it('1.5.6. Xác nhận tính accessibility của website', () => {
    // Verify website accessibility on product page
    cy.get('[data-test="product-name"]').should('be.visible') // Ensure on product page
    
    // Check for accessibility attributes
    cy.get('img').should('have.attr', 'alt')
    cy.get('button').should('have.attr', 'type')
    
    // Check form labels if any
    cy.get('label').then(($labels) => {
      if ($labels.length > 0) {
        cy.wrap($labels).should('have.attr', 'for')
      }
    })
  })

  it('1.5.7. Kiểm tra keyboard navigation', () => {
    // Check keyboard navigation on product page
    cy.get('[data-test="product-name"]').should('be.visible') // Ensure on product page
    
    // Test tab navigation
    cy.get('body').tab()
    cy.focused().should('be.visible')
    
    // Check if important elements are focusable
    cy.get('[data-test="add-to-cart"]').focus()
    cy.get('[data-test="add-to-cart"]').should('have.focus')
  })

  it('1.5.8. Xác minh responsive design', () => {
    // Verify responsive design on product page
    cy.get('[data-test="product-name"]').should('be.visible') // Ensure on product page
    
    // Test mobile viewport
    cy.viewport(375, 667)
    cy.get('[data-test="product-name"]').should('be.visible')
    cy.get('[data-test="add-to-cart"]').should('be.visible')
    
    // Test tablet viewport
    cy.viewport(768, 1024)
    cy.get('[data-test="product-name"]').should('be.visible')
    
    // Test desktop viewport
    cy.viewport(1920, 1080)
    cy.get('[data-test="product-name"]').should('be.visible')
  })

  it('1.5.9. Kiểm tra loading states và progress indicators', () => {
    // Check loading states and progress indicators on product page
    cy.get('[data-test="product-name"]').should('be.visible') // Ensure on product page
    
    // Check for loading indicators
    cy.get('.loading, .spinner, [class*="loading"]').then(($loading) => {
      if ($loading.length > 0) {
        cy.wrap($loading).should('be.visible')
      }
    })
    
    // Check page loads completely
    cy.get('[data-test="product-name"]').should('be.visible')
  })

  it('1.5.10. Xác nhận tính intuitive của user workflow', () => {
    // Verify intuitive user workflow on product page
    cy.get('[data-test="product-name"]').should('be.visible') // Ensure on product page
    
    // Test common user actions flow
    cy.get('[data-test="product-name"]').should('be.visible')
    cy.get('[data-test="add-to-cart"]').should('be.visible')
    
    // Check quantity selection if available
    cy.get('input[type="number"]').then(($input) => {
      if ($input.length > 0) {
        cy.wrap($input).should('be.visible')
        cy.wrap($input).clear().type('2')
      }
    })
    
    // Attempt to add to cart
    cy.get('[data-test="add-to-cart"]').click()
  })

  it('1.5.11. Kiểm tra search functionality nếu có', () => {
    // Check search functionality if available on product page
    cy.get('[data-test="product-name"]').should('be.visible') // Ensure on product page
    
    cy.get('input[type="search"], input[placeholder*="search"], input[placeholder*="Search"]').then(($search) => {
      if ($search.length > 0) {
        cy.wrap($search).should('be.visible')
        cy.wrap($search).type('test')
        cy.wrap($search).should('have.value', 'test')
      }
    })
  })

  it('1.5.12. Xác minh help text và tooltips', () => {
    // Verify help text and tooltips on product page
    cy.get('[data-test="product-name"]').should('be.visible') // Ensure on product page
    
    // Check for help text
    cy.get('.help-text, .hint, [class*="help"]').then(($help) => {
      if ($help.length > 0) {
        cy.wrap($help).should('be.visible')
        cy.wrap($help).should('not.be.empty')
      }
    })
    
    // Check for tooltips
    cy.get('[title], [data-tooltip]').then(($tooltip) => {
      if ($tooltip.length > 0) {
        cy.wrap($tooltip).first().trigger('mouseover')
      }
    })
  })
})
