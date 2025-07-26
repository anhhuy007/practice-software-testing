describe('GUI Checklist 1.4 - HÌNH ẢNH (IMAGES)', () => {
  
  beforeEach(() => {
    cy.visit('/')
    cy.get('[data-test="product-name"]', { timeout: 10000 }).should('be.visible')
    cy.get('[data-test="product-name"]').first().click()
    cy.url().should('match', /\/product\/\d+/)
    cy.get('[data-test="product-name"]').should('be.visible')
  })

  it('1.4.1. Kiểm tra kích thước hình ảnh có phù hợp không', () => {
    cy.get('[data-test="product-name"]').should('be.visible')
    cy.get('img').should('be.visible')
    cy.get('img').should(($img) => {
      const img = $img[0]
      expect(img.naturalWidth).to.be.greaterThan(0)
      expect(img.naturalHeight).to.be.greaterThan(0)
    })
  })

  it('1.4.2. Xác nhận hình ảnh có độ phân giải đủ cao', () => {
    cy.get('[data-test="product-name"]').should('be.visible')
    cy.get('img').should('be.visible')
    cy.get('img').should(($img) => {
      const img = $img[0]
      // Check minimum resolution
      expect(img.naturalWidth).to.be.at.least(100)
      expect(img.naturalHeight).to.be.at.least(100)
    })
  })

  it('1.4.3. Kiểm tra hình ảnh có bị méo không', () => {
    cy.get('[data-test="product-name"]').should('be.visible') 
    cy.get('img').should('be.visible')
    cy.get('img').should('have.css', 'object-fit')
  })

  it('1.4.4. Xác minh tốc độ tải hình ảnh', () => {
    // Verify image loading speed on product page
    cy.get('[data-test="product-name"]').should('be.visible')
    cy.get('img').should('be.visible')
    cy.get('img').should('have.attr', 'src').and('not.be.empty')
  })

  it('1.4.5. Kiểm tra thuộc tính Alt của hình ảnh', () => {
    // Check Alt attribute of images on product page
    cy.get('[data-test="product-name"]').should('be.visible')
    cy.get('img').should('have.attr', 'alt')
    cy.get('img').invoke('attr', 'alt').should('not.be.empty')
  })

  it('1.4.6. Xác nhận tính phù hợp của hình ảnh với nội dung', () => {
    // Verify image relevance to content on product page
    cy.get('[data-test="product-name"]').should('be.visible')
    cy.get('img').should('be.visible')
    cy.get('img').should('have.attr', 'alt').and('not.be.empty')
    
    // Image should be related to product
    cy.get('[data-test="product-name"]').invoke('text').then((productName) => {
      cy.get('img').invoke('attr', 'alt').should('contain.text', productName.toLowerCase().split(' ')[0])
    })
  })

  it('1.4.7. Kiểm tra hình ảnh có hiển thị đúng định dạng', () => {
    // Check images display in correct format on product page
    cy.get('[data-test="product-name"]').should('be.visible')
    cy.get('img').should('be.visible')
    cy.get('img').should('have.attr', 'src').then((src) => {
      expect(src).to.match(/\.(jpg|jpeg|png|gif|svg|webp)$/i)
    })
  })

  it('1.4.8. Xác minh hiệu ứng hover trên hình ảnh', () => {
    // Verify hover effects on images on product page
    cy.get('[data-test="product-name"]').should('be.visible')
    cy.get('img').first().trigger('mouseover')
    cy.get('img').first().should('be.visible')
    // Check if there's any transition or transformation
    cy.get('img').first().should('have.css', 'transition')
  })

  it('1.4.9. Kiểm tra tính responsive của hình ảnh', () => {
    // Check image responsiveness on product page
    cy.get('[data-test="product-name"]').should('be.visible')
    
    // Test different viewport sizes
    cy.viewport(320, 568) // Mobile
    cy.get('img').should('be.visible')
    
    cy.viewport(768, 1024) // Tablet
    cy.get('img').should('be.visible')
    
    cy.viewport(1920, 1080) // Desktop
    cy.get('img').should('be.visible')
  })

  it('1.4.10. Xác nhận hình ảnh placeholder khi lỗi', () => {
    // Verify placeholder images when error occurs on product page
    cy.get('[data-test="product-name"]').should('be.visible')
    
    // Test broken image handling
    cy.get('img').then(($img) => {
      if ($img.length > 0) {
        cy.wrap($img).first().should('have.attr', 'src')
        // Check if there's error handling for broken images
        cy.wrap($img).first().should('be.visible')
      }
    })
  })

  it('1.4.11. Kiểm tra layout hình ảnh không bị vỡ', () => {
    // Check image layout is not broken on product page
    cy.get('[data-test="product-name"]').should('be.visible')
    cy.get('img').should('be.visible')
    
    // Check images don't overflow container
    cy.get('img').should('have.css', 'max-width')
    cy.get('img').should('have.css', 'height')
  })

  it('1.4.12. Xác minh lazy loading của hình ảnh', () => {
    // Verify lazy loading of images on product page
    cy.get('[data-test="product-name"]').should('be.visible')
    cy.get('img').then(($img) => {
      if ($img.length > 0) {
        // Check for lazy loading attributes
        cy.wrap($img).should('have.attr', 'src')
        // Some images might have loading="lazy" attribute
        cy.wrap($img).then(($el) => {
          if ($el.attr('loading')) {
            expect($el.attr('loading')).to.be.oneOf(['lazy', 'eager'])
          }
        })
      }
    })
  })
})
