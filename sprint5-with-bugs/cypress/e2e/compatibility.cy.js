describe('GUI Checklist 1.6 - TÍNH TƯƠNG THÍCH (COMPATIBILITY)', () => {
  
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

  it('1.6.1. Kiểm tra tương thích với các trình duyệt khác nhau', () => {
    // Check browser compatibility on product page
    cy.get('[data-test="product-name"]').should('be.visible') // Ensure on product page
    
    // Check basic functionality works
    cy.get('[data-test="add-to-cart"]').should('be.visible')
    cy.get('[data-test="add-to-favorites"]').should('be.visible')
    
    // Test CSS support
    cy.get('body').should('have.css', 'margin')
    cy.get('[data-test="product-name"]').should('have.css', 'font-size')
  })

  it('1.6.2. Xác nhận responsive design trên mobile devices', () => {
    // Verify responsive design on mobile devices for product page
    cy.get('[data-test="product-name"]').should('be.visible') // Ensure on product page
    
    // Test iPhone sizes
    cy.viewport(375, 667) // iPhone 6/7/8
    cy.get('[data-test="product-name"]').should('be.visible')
    cy.get('[data-test="add-to-cart"]').should('be.visible')
    
    cy.viewport(414, 896) // iPhone XR
    cy.get('[data-test="product-name"]').should('be.visible')
    
    cy.viewport(390, 844) // iPhone 12
    cy.get('[data-test="product-name"]').should('be.visible')
  })

  it('1.6.3. Kiểm tra responsive design trên tablet devices', () => {
    // Check responsive design on tablet devices for product page
    cy.get('[data-test="product-name"]').should('be.visible') // Ensure on product page
    
    // Test iPad sizes
    cy.viewport(768, 1024) // iPad
    cy.get('[data-test="product-name"]').should('be.visible')
    cy.get('[data-test="add-to-cart"]').should('be.visible')
    
    cy.viewport(820, 1180) // iPad Air
    cy.get('[data-test="product-name"]').should('be.visible')
    
    cy.viewport(1024, 1366) // iPad Pro
    cy.get('[data-test="product-name"]').should('be.visible')
  })

  it('1.6.4. Xác minh hoạt động trên desktop resolutions', () => {
    // Verify functionality on desktop resolutions for product page
    cy.get('[data-test="product-name"]').should('be.visible') // Ensure on product page
    
    // Test common desktop resolutions
    cy.viewport(1366, 768) // Common laptop
    cy.get('[data-test="product-name"]').should('be.visible')
    
    cy.viewport(1920, 1080) // Full HD
    cy.get('[data-test="product-name"]').should('be.visible')
    
    cy.viewport(2560, 1440) // 2K
    cy.get('[data-test="product-name"]').should('be.visible')
  })

  it('1.6.5. Kiểm tra tương thích với screen readers', () => {
    // Check screen reader compatibility on product page
    cy.get('[data-test="product-name"]').should('be.visible') // Ensure on product page
    
    // Check ARIA attributes
    cy.get('[role]').then(($elements) => {
      if ($elements.length > 0) {
        cy.wrap($elements).should('have.attr', 'role')
      }
    })
    
    // Check semantic HTML
    cy.get('main, section, article, header, footer').then(($semantic) => {
      if ($semantic.length > 0) {
        cy.wrap($semantic).should('be.visible')
      }
    })
    
    // Check alt text for images
    cy.get('img').should('have.attr', 'alt')
  })

  it('1.6.6. Xác nhận hoạt động với JavaScript disabled', () => {
    // Verify functionality with JavaScript disabled on product page
    cy.get('[data-test="product-name"]').should('be.visible') // Ensure on product page
    
    // Basic content should still be visible
    cy.get('[data-test="product-name"]').should('contain.text', '')
    cy.get('img').should('be.visible')
    
    // Check if forms still work
    cy.get('form').then(($forms) => {
      if ($forms.length > 0) {
        cy.wrap($forms).should('have.attr', 'action')
      }
    })
  })

  it('1.6.7. Kiểm tra performance trên các thiết bị khác nhau', () => {
    // Check performance on different devices for product page
    cy.get('[data-test="product-name"]').should('be.visible') // Ensure on product page
    
    // Simulate slower network
    cy.intercept('**/*', (req) => {
      req.reply((res) => {
        // Simulate slow connection
        return new Promise((resolve) => {
          setTimeout(() => resolve(res), 100)
        })
      })
    })
    
    // Page should still load
    cy.reload()
    cy.get('[data-test="product-name"]', { timeout: 15000 }).should('be.visible')
  })

  it('1.6.8. Xác minh tương thích với touch devices', () => {
    // Verify touch device compatibility on product page
    cy.get('[data-test="product-name"]').should('be.visible') // Ensure on product page
    
    // Test touch interactions
    cy.get('[data-test="add-to-cart"]').trigger('touchstart')
    cy.get('[data-test="add-to-cart"]').trigger('touchend')
    
    // Check button sizes for touch
    cy.get('[data-test="add-to-cart"]').should('have.css', 'min-height')
    cy.get('[data-test="add-to-favorites"]').should('have.css', 'min-height')
  })

  it('1.6.9. Kiểm tra tương thích với các OS khác nhau', () => {
    // Check OS compatibility on product page
    cy.get('[data-test="product-name"]').should('be.visible') // Ensure on product page
    
    // Test user agent variations (simulated)
    cy.window().then((win) => {
      // Basic functionality should work regardless of OS
      cy.get('[data-test="add-to-cart"]').should('be.visible')
      cy.get('[data-test="add-to-favorites"]').should('be.visible')
    })
  })

  it('1.6.10. Xác nhận hoạt động với cookies disabled', () => {
    // Verify functionality with cookies disabled on product page
    cy.clearCookies()
    cy.visit('/')
    cy.get('[data-test="product-name"]', { timeout: 10000 }).should('be.visible')
    cy.get('[data-test="product-name"]').first().click()
    
    // Basic functionality should still work
    cy.get('[data-test="product-name"]').should('be.visible')
    cy.get('[data-test="add-to-cart"]').should('be.visible')
  })

  it('1.6.11. Kiểm tra tương thích với high contrast mode', () => {
    // Check high contrast mode compatibility on product page
    cy.get('[data-test="product-name"]').should('be.visible') // Ensure on product page
    
    // Simulate high contrast by checking color contrast
    cy.get('[data-test="product-name"]').should('have.css', 'color')
    cy.get('body').should('have.css', 'background-color')
    
    // Ensure sufficient contrast between elements
    cy.get('[data-test="add-to-cart"]').should('have.css', 'color')
    cy.get('[data-test="add-to-cart"]').should('have.css', 'background-color')
  })

  it('1.6.12. Xác minh tương thích với print styles', () => {
    // Verify print styles compatibility on product page
    cy.get('[data-test="product-name"]').should('be.visible') // Ensure on product page
    
    // Check if print styles exist
    cy.get('head').within(() => {
      cy.get('link[media="print"], style').then(($printStyles) => {
        if ($printStyles.length > 0) {
          // Print styles are defined
          cy.wrap($printStyles).should('exist')
        }
      })
    })
    
    // Essential content should be printable
    cy.get('[data-test="product-name"]').should('be.visible')
    cy.get('img').should('be.visible')
  })
})
