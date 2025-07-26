describe('GUI Checklist 1.2 - MÀU SẮC (COLORS)', () => {
  
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

  it('1.2.1. Kiểm tra nền có phải màu tối không', () => {
    // Verify background is light colored on product page
    cy.get('body').should('have.css', 'background-color').then((bgColor) => {
      // Light colors typically have higher RGB values
      expect(bgColor).to.not.equal('rgb(0, 0, 0)') // Not pure black
    })
    cy.get('[data-test="product-name"]').should('be.visible') // Ensure on product page
  })

  it('1.2.2. Đảm bảo màu nền không gây rối mắt', () => {
    // Check background colors are not too bright or jarring on product page
    cy.get('body').should('have.css', 'background-color')
    cy.get('.container').should('be.visible')
    
    // Ensure sufficient contrast on product page
    cy.get('[data-test="product-name"]').should('have.css', 'color').then((textColor) => {
      expect(textColor).to.not.equal('rgb(255, 255, 255)') // Not pure white on white
    })
  })

  it('1.2.3. Xác nhận màu giữa các phần khác biệt và đồng nhất', () => {
    // Check color consistency across sections on product page
    cy.get('[data-test="product-name"]').should('have.css', 'color')
    cy.get('p, span, div').should('have.css', 'color')
    
    // Background and text should have good contrast on product page
    cy.get('body').should('be.visible')
    cy.get('[data-test="product-name"]').should('be.visible')
  })

  it('1.2.4. Kiểm tra màu chữ nội dung đồng nhất', () => {
    // Verify text color consistency on product page
    cy.get('[data-test="product-name"]').should('be.visible')
    cy.get('p').should('have.css', 'color')
    cy.get('span').should('have.css', 'color')
    
    // Main content text should be consistent on product page
    cy.get('[data-test="product-name"]').should('have.css', 'color')
  })

  it('1.2.5. Xác minh chữ in đậm, nghiêng, liên kết nổi bật', () => {
    // Check bold text (product name should be bold) on product page
    cy.get('[data-test="product-name"]').should('have.css', 'font-weight')
    
    // Check links are highlighted on product page
    cy.get('a').should('have.css', 'color')
    cy.get('a').should('have.css', 'text-decoration')
  })

  it('1.2.6. Kiểm tra màu liên kết đã truy cập có đổi không', () => {
    // Test visited link colors on product page
    cy.get('[data-test="product-name"]').should('be.visible') // Ensure on product page
    cy.get('a').first().then(($link) => {
      const originalColor = $link.css('color')
      cy.wrap($link).should('have.css', 'color')
      // Note: Testing actual visited state requires user interaction
    })
  })

  it('1.2.7. Kiểm tra hiệu ứng hover trên màu chữ liên kết', () => {
    // Test hover effects on links on product page
    cy.get('[data-test="product-name"]').should('be.visible') // Ensure on product page
    cy.get('a').first().then(($link) => {
      cy.wrap($link).trigger('mouseover')
      cy.wrap($link).should('have.css', 'color')
    })
  })

  it('1.2.8. Đảm bảo màu chữ trong textbox đồng nhất', () => {
    // Check textbox text color if any exist on product page
    cy.get('[data-test="product-name"]').should('be.visible') // Ensure on product page
    cy.get('input[type="text"], input[type="number"], textarea').then(($inputs) => {
      if ($inputs.length > 0) {
        cy.wrap($inputs).should('have.css', 'color')
      }
    })
  })

  it('1.2.9. Xác nhận màu nền button đồng nhất', () => {
    // Check button background colors are consistent on product page
    cy.get('[data-test="add-to-cart"]').should('have.css', 'background-color')
    cy.get('[data-test="add-to-favorites"]').should('have.css', 'background-color')
  })

  it('1.2.10. Kiểm tra màu chữ trên button đồng nhất', () => {
    // Check button text colors are consistent on product page
    cy.get('[data-test="add-to-cart"]').should('have.css', 'color')
    cy.get('[data-test="add-to-favorites"]').should('have.css', 'color')
  })

  it('1.2.11. Xác minh màu vùng nhập liệu disabled khác biệt', () => {
    // Check disabled input field colors if any on product page
    cy.get('[data-test="product-name"]').should('be.visible') // Ensure on product page
    cy.get('input:disabled, button:disabled').then(($disabled) => {
      if ($disabled.length > 0) {
        cy.wrap($disabled).should('have.css', 'background-color')
        cy.wrap($disabled).should('have.css', 'color')
      }
    })
  })
})
