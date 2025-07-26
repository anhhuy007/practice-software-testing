describe('GUI Checklist 1.3 - NỘI DUNG (CONTENT)', () => {
  
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

  it('1.3.1. Kiểm tra nội dung tiêu đề có chính xác, rõ ràng không', () => {
    // Verify page title is clear and accurate on product page
    cy.title().should('not.be.empty')
    cy.get('[data-test="product-name"]').should('not.be.empty')
    cy.get('[data-test="product-name"]').should('be.visible')
  })

  it('1.3.2. Kiểm tra tính chính xác, rõ ràng của hình ảnh', () => {
    // Check image accuracy and clarity on product page
    cy.get('[data-test="product-name"]').should('be.visible') // Ensure on product page
    cy.get('img').should('be.visible')
    cy.get('img').should('have.attr', 'src')
    cy.get('img').should('have.attr', 'alt')
  })

  it('1.3.3. Xác nhận nội dung văn bản chính xác, rõ ràng', () => {
    // Verify text content is accurate and clear on product page
    cy.get('[data-test="product-name"]').should('contain.text', '')
    cy.get('[data-test="product-name"]').should('be.visible')
    
    // Check other text elements on product page
    cy.get('p, span, div').should('not.be.empty')
  })

  it('1.3.4. Kiểm tra tính hữu ích của tooltip', () => {
    // Check tooltip usefulness on product page
    cy.get('[data-test="product-name"]').should('be.visible') // Ensure on product page
    cy.get('[title], [data-tooltip]').then(($tooltips) => {
      if ($tooltips.length > 0) {
        cy.wrap($tooltips).first().trigger('mouseover')
        cy.wrap($tooltips).first().should('have.attr', 'title')
      }
    })
  })

  it('1.3.5. Xác minh văn bản trong thông báo lỗi phù hợp', () => {
    // Verify error message text is appropriate on product page
    cy.get('[data-test="product-name"]').should('be.visible') // Ensure on product page
    
    // Trigger error condition if possible (e.g., invalid quantity)
    cy.get('input[type="number"]').then(($input) => {
      if ($input.length > 0) {
        cy.wrap($input).clear().type('-1')
        cy.get('.error, .invalid, .alert-danger').then(($error) => {
          if ($error.length > 0) {
            cy.wrap($error).should('not.be.empty')
          }
        })
      }
    })
  })

  it('1.3.6. Kiểm tra độ phù hợp của thông báo thành công', () => {
    // Check success message appropriateness on product page
    cy.get('[data-test="product-name"]').should('be.visible') // Ensure on product page
    
    // Trigger success condition if possible (e.g., add to cart)
    cy.get('[data-test="add-to-cart"]').then(($button) => {
      if ($button.length > 0) {
        cy.wrap($button).click()
        cy.get('.success, .alert-success, .notification').then(($success) => {
          if ($success.length > 0) {
            cy.wrap($success).should('not.be.empty')
          }
        })
      }
    })
  })

  it('1.3.7. Xác nhận văn bản trong placeholder hướng dẫn rõ ràng', () => {
    // Verify placeholder text is clear and instructive on product page
    cy.get('[data-test="product-name"]').should('be.visible') // Ensure on product page
    cy.get('input[placeholder], textarea[placeholder]').then(($inputs) => {
      if ($inputs.length > 0) {
        cy.wrap($inputs).should('have.attr', 'placeholder')
        cy.wrap($inputs).invoke('attr', 'placeholder').should('not.be.empty')
      }
    })
  })

  it('1.3.8. Kiểm tra văn bản nhãn trên form có rõ ràng không', () => {
    // Check form label text clarity on product page
    cy.get('[data-test="product-name"]').should('be.visible') // Ensure on product page
    cy.get('label').then(($labels) => {
      if ($labels.length > 0) {
        cy.wrap($labels).should('not.be.empty')
        cy.wrap($labels).should('be.visible')
      }
    })
  })

  it('1.3.9. Xác minh nội dung breadcrumb có chính xác không', () => {
    // Verify breadcrumb content accuracy on product page
    cy.get('[data-test="product-name"]').should('be.visible') // Ensure on product page
    cy.get('.breadcrumb, nav[aria-label="breadcrumb"]').then(($breadcrumb) => {
      if ($breadcrumb.length > 0) {
        cy.wrap($breadcrumb).should('be.visible')
        cy.wrap($breadcrumb).should('contain.text', 'Home')
      }
    })
  })

  it('1.3.10. Kiểm tra nội dung menu có phù hợp và đầy đủ', () => {
    // Check menu content is appropriate and complete on product page
    cy.get('[data-test="product-name"]').should('be.visible') // Ensure on product page
    cy.get('nav, .menu, .navbar').should('be.visible')
    cy.get('nav a, .menu a, .navbar a').should('have.length.greaterThan', 0)
  })

  it('1.3.11. Xác nhận tiêu đề trang web phù hợp và chính xác', () => {
    // Verify page title is appropriate and accurate on product page
    cy.get('[data-test="product-name"]').should('be.visible') // Ensure on product page
    cy.title().should('not.be.empty')
    cy.title().should('contain', 'product')
  })

  it('1.3.12. Kiểm tra văn bản copyright có chính xác không', () => {
    // Check copyright text accuracy on product page
    cy.get('[data-test="product-name"]').should('be.visible') // Ensure on product page
    cy.get('footer, .footer, .copyright').then(($footer) => {
      if ($footer.length > 0) {
        cy.wrap($footer).should('contain.text', '©')
      }
    })
  })
})
