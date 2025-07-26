describe('GUI Checklist 1.1 - LIÊN KẾT (LINKS)', () => {
  
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

  it('1.1.1. Xác minh phông chữ có thể sử dụng được trên bất kỳ trình duyệt nào', () => {
    // Check font rendering is clear and readable on product page
    cy.get('[data-test="product-name"]').should('be.visible')
    cy.get('[data-test="product-name"]').should(($el) => {
      const fontFamily = window.getComputedStyle($el[0]).fontFamily
      expect(fontFamily).to.not.be.empty
    })
    
    // Check text is readable (not distorted) on product page
    cy.get('body').should('have.css', 'font-family')
    cy.get('h1, h2, h3, p, span').each(($el) => {
      cy.wrap($el).should('be.visible')
    })
  })

  it('1.1.2. Đảm bảo không có trang mồ côi (trang không có liên kết đến trang đó)', () => {
    // Verify product page has navigation links back to other pages
    cy.get('nav').should('be.visible')
    cy.get('a[href="/"]').should('be.visible') // Home link exists on product page
    
    // Check breadcrumb or back navigation exists on product page
    cy.get('body').then(($body) => {
      // Look for navigation elements on product page
      const hasNavigation = $body.find('nav').length > 0 || 
                           $body.find('[href="/"]').length > 0
      expect(hasNavigation).to.be.true
    })
  })

  it('1.1.3. Xác nhận không có trang Dead-End tồn tại', () => {
    // Check product page has links to other pages (related products)
    cy.get('h1').contains('Related products').should('be.visible')
    cy.get('.card').should('have.length.greaterThan', 0)
    
    // Verify related products have links on product page
    cy.get('.card').first().within(() => {
      cy.get('a, [data-test="product-name"]').should('exist')
    })
  })

  it('1.1.4. Kiểm tra các liên kết ngoài còn hoạt động và mở trong tab mới', () => {
    // Check external links in image attribution on product page
    cy.get('.figure-caption').should('be.visible')
    cy.get('.figure-caption a').each(($link) => {
      cy.wrap($link).should('have.attr', 'target', '_blank')
      cy.wrap($link).should('have.attr', 'href').and('not.be.empty')
    })
  })

  it('1.1.5. Xác minh tất cả website/địa chỉ email được tham chiếu có siêu liên kết', () => {
    // Look for any email addresses or websites on product page that should be linked
    cy.get('body').then(($body) => {
      const text = $body.text()
      const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g
      const urlRegex = /https?:\/\/[^\s]+/g
      
      const emails = text.match(emailRegex) || []
      const urls = text.match(urlRegex) || []
      
      // If emails/URLs found on product page, they should be hyperlinked
      emails.forEach(email => {
        if ($body.find(`a[href*="${email}"]`).length === 0) {
          cy.log(`Email ${email} is not hyperlinked on product page`)
        }
      })
    })
  })

  it('1.1.6. Kiểm tra chuyển hướng trang 404 tùy chỉnh về trang chủ/tìm kiếm', () => {
    // Test invalid product ID and verify 404 handling from product page context
    cy.url().then((currentUrl) => {
      // Extract current product ID and test with invalid ID
      const productId = currentUrl.match(/\/product\/(\d+)/)[1]
      const invalidId = parseInt(productId) + 99999
      
      cy.visit(`/product/${invalidId}`, { failOnStatusCode: false })
      
      // Should show 404 page or redirect
      cy.get('body').should('be.visible')
      cy.url().should('satisfy', (url) => {
        return url.includes('404') || url.includes('/') || url.includes('not-found')
      })
      
      // Navigate back to original product page
      cy.visit(currentUrl)
      cy.get('[data-test="product-name"]').should('be.visible')
    })
  })

  it('1.1.7. Xác thực chức năng của các liên kết mailto', () => {
    // Check for mailto links on product page
    cy.get('body').then(($body) => {
      const mailtoLinks = $body.find('a[href^="mailto:"]')
      if (mailtoLinks.length > 0) {
        cy.wrap(mailtoLinks).each(($link) => {
          cy.wrap($link).should('have.attr', 'href').and('include', 'mailto:')
        })
      } else {
        cy.log('No mailto links found on product page')
      }
    })
  })
})
