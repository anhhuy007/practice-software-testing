// Custom commands for cart functionality testing

// Command to add product to cart with error handling
Cypress.Commands.add('addProductToCart', (productId = 1) => {
  cy.visit(`/product/${productId}`);
  
  // Wait for page to load and find add to cart button with multiple possible selectors
  const addToCartSelectors = [
    '[data-test="add-to-cart"]',
    '[data-testid="add-to-cart"]',
    '[id*="add-to-cart"]',
    '[class*="add-to-cart"]',
    'button:contains("Add to cart")',
    'button:contains("Add to Cart")',
    '.btn-primary:contains("Add")',
    '#add-to-cart',
    '.add-to-cart-btn'
  ];
  
  let buttonFound = false;
  
  addToCartSelectors.forEach((selector) => {
    if (!buttonFound) {
      cy.get('body').then(($body) => {
        if ($body.find(selector).length > 0) {
          cy.get(selector).first().click();
          buttonFound = true;
        }
      });
    }
  });
  
  // Wait for cart update (success message, cart count, etc.)
  cy.wait(1000);
});

// Command to navigate to cart page
Cypress.Commands.add('goToCart', () => {
  const cartNavSelectors = [
    '[data-test="nav-cart"]',
    '[data-testid="nav-cart"]',
    '[data-test="cart"]',
    'a[href*="/cart"]',
    'a[href*="/checkout"]',
    '.cart-icon',
    '#cart-link',
    'nav a:contains("Cart")',
    '.fa-shopping-cart'
  ];
  
  let navFound = false;
  
  cartNavSelectors.forEach((selector) => {
    if (!navFound) {
      cy.get('body').then(($body) => {
        if ($body.find(selector).length > 0) {
          cy.get(selector).first().click();
          navFound = true;
        }
      });
    }
  });
  
  // Alternative: direct navigation if nav not found
  cy.url().then((currentUrl) => {
    const baseUrl = currentUrl.split('/product')[0];
    if (!navFound) {
      cy.visit(`${baseUrl}/checkout`);
    }
  });
});

// Command to get cart item count
Cypress.Commands.add('getCartItemCount', () => {
  const cartItemSelectors = [
    '[data-test="cart-item"]',
    '[data-testid="cart-item"]',
    '.cart-item',
    '.checkout-item',
    'tr[class*="item"]',
    '[class*="product-row"]'
  ];
  
  return cy.get('body').then(($body) => {
    for (const selector of cartItemSelectors) {
      const items = $body.find(selector);
      if (items.length > 0) {
        return items.length;
      }
    }
    return 0;
  });
});

// Command to clear cart
Cypress.Commands.add('clearCart', () => {
  cy.window().then((win) => {
    win.localStorage.clear();
    win.sessionStorage.clear();
  });
  
  // If cart has items, remove them
  cy.visit('/checkout');
  cy.get('body').then(($body) => {
    const removeSelectors = [
      '[data-test="remove-product"]',
      '[data-testid="remove-product"]',
      '.remove-item',
      '.delete-item',
      '[title*="remove"]',
      '[title*="delete"]',
      'button:contains("Remove")',
      'button:contains("Delete")'
    ];
    
    removeSelectors.forEach((selector) => {
      if ($body.find(selector).length > 0) {
        cy.get(selector).each(($el) => {
          cy.wrap($el).click();
          cy.wait(500);
        });
      }
    });
  });
});

// Command to get element with multiple possible selectors
Cypress.Commands.add('getByTestId', (testIds, options = {}) => {
  const selectors = Array.isArray(testIds) ? testIds : [testIds];
  const selectorQueries = selectors.flatMap(id => [
    `[data-test="${id}"]`,
    `[data-testid="${id}"]`,
    `#${id}`,
    `.${id}`
  ]);
  
  return cy.get('body').then(($body) => {
    for (const selector of selectorQueries) {
      const element = $body.find(selector);
      if (element.length > 0) {
        return cy.get(selector, options);
      }
    }
    // If no element found, return empty jQuery object
    return cy.wrap($body.find('[data-test-not-found]'));
  });
});

// Command to extract numeric value from text (for prices, quantities)
Cypress.Commands.add('getNumericValue', { prevSubject: true }, (subject) => {
  return cy.wrap(subject).invoke('text').then((text) => {
    const numericValue = parseFloat(text.replace(/[^\d.-]/g, ''));
    return isNaN(numericValue) ? 0 : numericValue;
  });
});

// Command to set quantity with various input methods
Cypress.Commands.add('setQuantity', (quantity) => {
  const quantitySelectors = [
    '[data-test="product-quantity"]',
    '[data-testid="quantity"]',
    'input[name*="quantity"]',
    '.quantity-input',
    '#quantity',
    'input[type="number"]'
  ];
  
  quantitySelectors.forEach((selector) => {
    cy.get('body').then(($body) => {
      if ($body.find(selector).length > 0) {
        cy.get(selector).first().clear().type(quantity.toString());
        cy.get(selector).first().trigger('change').blur();
      }
    });
  });
  
  cy.wait(1000); // Allow time for updates
});
