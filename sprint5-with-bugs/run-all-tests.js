/**
 * Run All Tests Script
 * 
 * This script runs all Cypress tests in the admin and checkout folders
 * and generates comprehensive reports.
 * 
 * CS423 - Software Testing
 * Student: anhhuy007
 * Date: August 1, 2025
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Create output directories if they don't exist
const reportsDir = path.join(__dirname, 'test-results', 'reports');
const videosDir = path.join(__dirname, 'test-results', 'videos');
const screenshotsDir = path.join(__dirname, 'test-results', 'screenshots');
const bugsReportDir = path.join(__dirname, 'test-results', 'bugs-report');

[reportsDir, videosDir, screenshotsDir, bugsReportDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Test suites to run
const testSuites = [
  {
    name: 'Admin Order List Tests',
    spec: 'cypress/e2e/admin/order-list.cy.js',
    outputPrefix: 'admin-order-list'
  },
  {
    name: 'Admin Order Detail Tests',
    spec: 'cypress/e2e/admin/order-detail.cy.js',
    outputPrefix: 'admin-order-detail'
  },
  {
    name: 'Cart Functionality Tests',
    spec: 'cypress/e2e/cart-functionality.cy.js',
    outputPrefix: 'cart-functionality'
  },
  {
    name: 'Checkout Tests',
    spec: 'cypress/e2e/checkout.cy.js',
    outputPrefix: 'checkout'
  },
  {
    name: 'Bank Transfer Payment Tests',
    spec: 'cypress/e2e/checkout/payment/bank-transfer.cy.js',
    outputPrefix: 'payment-bank-transfer'
  },
  {
    name: 'Credit Card Payment Tests',
    spec: 'cypress/e2e/checkout/payment/credit-card.cy.js',
    outputPrefix: 'payment-credit-card'
  }
];

// Run all tests
console.log('Starting test execution...');
console.log('========================');

const startTime = new Date();
const testResults = [];

testSuites.forEach(suite => {
  console.log(`Running ${suite.name}...`);
  
  try {
    // Execute test with Cypress
    execSync(`npx cypress run --browser chrome --spec "${suite.spec}" --reporter mochawesome --reporter-options "reportDir=test-results/reports,reportFilename=${suite.outputPrefix}-report,overwrite=true,html=true,json=true"`, {
      stdio: 'inherit'
    });
    
    testResults.push({
      suite: suite.name,
      status: 'PASSED',
      spec: suite.spec,
      timestamp: new Date().toISOString()
    });
    
    console.log(`✅ ${suite.name} completed successfully`);
  } catch (error) {
    console.error(`❌ Error running ${suite.name}: ${error.message}`);
    
    testResults.push({
      suite: suite.name,
      status: 'FAILED',
      spec: suite.spec,
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
  
  console.log('------------------------');
});

// Generate summary report
const endTime = new Date();
const executionTimeMs = endTime - startTime;
const executionTimeSec = executionTimeMs / 1000;

// Count passed and failed tests
const passedTests = testResults.filter(result => result.status === 'PASSED').length;
const failedTests = testResults.filter(result => result.status === 'FAILED').length;

const summaryReport = {
  testExecution: {
    startTime: startTime.toISOString(),
    endTime: endTime.toISOString(),
    executionTimeSeconds: executionTimeSec,
    totalSuites: testResults.length,
    passedSuites: passedTests,
    failedSuites: failedTests
  },
  suiteResults: testResults,
  metadata: {
    date: startTime.toISOString().split('T')[0],
    tester: "anhhuy007",
    project: "CS423 - Software Testing"
  }
};

// Write summary report to file
fs.writeFileSync(
  path.join(bugsReportDir, 'test-summary-report.json'),
  JSON.stringify(summaryReport, null, 2)
);

// Generate bugs report in markdown format
const bugsReportContent = `# Cypress Test Execution - Bugs Report
> Generated: ${new Date().toLocaleString()}

## Test Summary
- **Start Time:** ${startTime.toLocaleString()}
- **End Time:** ${endTime.toLocaleString()}
- **Execution Duration:** ${executionTimeSec.toFixed(2)} seconds
- **Total Test Suites:** ${testResults.length}
- **Passed Suites:** ${passedTests}
- **Failed Suites:** ${failedTests}

## Test Results

${testResults.map(result => `
### ${result.suite}
- **Status:** ${result.status === 'PASSED' ? '✅ PASSED' : '❌ FAILED'}
- **Spec File:** \`${result.spec}\`
- **Timestamp:** ${new Date(result.timestamp).toLocaleString()}
${result.error ? `- **Error:** ${result.error}` : ''}
`).join('')}

## Notes
- Video recordings are available in the \`test-results/videos\` directory
- Screenshots are available in the \`test-results/screenshots\` directory
- Detailed HTML reports are available in the \`test-results/reports\` directory
`;

fs.writeFileSync(
  path.join(bugsReportDir, 'bugs-report.md'),
  bugsReportContent
);

console.log('========================');
console.log('Test execution complete!');
console.log(`Passed: ${passedTests}, Failed: ${failedTests}`);
console.log(`Total execution time: ${executionTimeSec.toFixed(2)} seconds`);
console.log(`Reports saved to: ${path.resolve(bugsReportDir)}`);
console.log('========================');
