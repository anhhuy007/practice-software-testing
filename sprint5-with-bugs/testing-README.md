# Cypress E2E Testing Suite

## CS423 - Software Testing
Student: anhhuy007  
Date: August 1, 2025

## Overview
This project contains a comprehensive set of Cypress E2E tests for validating the functionality of the application. The tests are organized into different categories focusing on admin features, cart functionality, checkout process, and payment methods.

## Test Categories
1. **Admin Tests**
   - Order List Tests
   - Order Detail Tests

2. **Cart Tests**
   - Cart Functionality Tests

3. **Checkout Tests**
   - Checkout Process Tests
   - Payment Method Tests (Bank Transfer, Credit Card)

## Directory Structure
```
cypress/
├── e2e/
│   ├── admin/
│   │   ├── order-list.cy.js
│   │   └── order-detail.cy.js
│   ├── checkout/
│   │   └── payment/
│   │       ├── bank-transfer.cy.js
│   │       └── credit-card.cy.js
│   ├── cart-functionality.cy.js
│   └── checkout.cy.js
├── fixtures/
│   └── data/
│       ├── admin-orders.json
│       ├── cart-checkout-data.json
│       ├── invoice-data.json
│       ├── payment-data.json
│       └── users.json
└── support/
    └── helpers/
        └── payment-test-utils.js
```

## Test Data
All tests use data-driven testing approach with test data separated into JSON fixtures located in `cypress/fixtures/data/` directory:

- `admin-orders.json`: Contains admin order list and detail test data
- `cart-checkout-data.json`: Contains product, address, and UI selector data for cart and checkout tests
- `invoice-data.json`: Contains realistic invoice data for testing order details
- `payment-data.json`: Contains payment method configuration for different payment types
- `users.json`: Contains user credentials for testing different user roles

## Running Tests

### Prerequisites
1. Ensure Node.js and npm are installed
2. Run `npm install` to install dependencies
3. Make sure the application is running at http://localhost:4200/#

### Run Commands

#### Run All Tests and Generate Reports
```bash
npm run full-test-suite
```

#### Run Only Admin Tests
```bash
npm run run:admin-tests
```

#### Run Only Checkout and Cart Tests
```bash
npm run run:checkout-tests
```

#### Open Cypress Test Runner
```bash
npm run cy:open
```

### Test Output

After running the tests, you'll find the following outputs in the `test-results` directory:

1. **Reports**: HTML reports showing test results
   - Location: `test-results/reports/`
   - Combined report: `test-results/combined-report/index.html`

2. **Videos**: Screen recordings of the test execution
   - Location: `test-results/videos/`

3. **Screenshots**: Screenshots taken during test execution
   - Location: `test-results/screenshots/`
   - These are especially useful for debugging failed tests

4. **Bugs Report**: Summary of bugs found during testing
   - Location: `test-results/bugs-report/bugs-report.md`

## Key Features
- Data-driven testing approach
- Cross-browser compatibility (Chrome, Firefox, Edge)
- Detailed reporting with screenshots and videos
- Robust error handling
- Reusable helper utilities

## Maintenance
To update or extend the tests:

1. Add new test data to the appropriate JSON files in `cypress/fixtures/data/`
2. Create new test files in the corresponding directory under `cypress/e2e/`
3. Add helper functions to `cypress/support/helpers/` as needed

## Known Issues
See the generated bugs report at `test-results/bugs-report/bugs-report.md` for details on any identified issues.
