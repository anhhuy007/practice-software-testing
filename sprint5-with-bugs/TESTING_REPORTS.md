# Cypress Test Result Reporting

This project is configured to save Cypress test results to files in multiple formats.

## Available Commands

### Basic Testing
```bash
npm run cy:open          # Open Cypress Test Runner (interactive)
npm run cy:run           # Run all tests in headless mode
```

### Testing with Reports
```bash
npm run cy:run:report    # Run tests and generate HTML report
npm run test:full        # Run tests and generate custom reports (JSON, TXT, CSV)
npm run generate:custom  # Generate custom reports from existing test data
```

## Generated Reports

After running tests, you'll find reports in these locations:

### HTML Reports (Mochawesome)
- **Location**: `cypress/reports/`
- **Files**: 
  - `*.html` - Beautiful HTML reports with charts and screenshots
  - `*.json` - Raw JSON data from test runs

### Custom Reports
- **Location**: `test-results/`
- **Files**:
  - `test-results-[timestamp].json` - Merged JSON with all test data
  - `test-summary-[timestamp].txt` - Simple text summary
  - `test-results-[timestamp].csv` - CSV format for spreadsheet analysis

### Media Files
- **Videos**: `cypress/videos/` - Screen recordings of test runs
- **Screenshots**: `cypress/screenshots/` - Screenshots of failures

## Report Features

### HTML Reports
- Interactive charts and graphs
- Test execution timeline
- Screenshots and videos embedded
- Detailed error messages and stack traces

### JSON Reports
- Complete test data for programmatic processing
- Test timing and performance metrics
- Detailed error information

### Text Summary
- Quick overview of test results
- Pass/fail counts
- List of failed tests with error messages

### CSV Reports
- Easy to import into Excel or Google Sheets
- Test-by-test breakdown
- Useful for trend analysis

## Configuration

The reporting is configured in:
- `cypress.config.js` - Main Cypress configuration
- `scripts/generate-reports.js` - Custom report generator
- `package.json` - NPM scripts for easy execution

## Alternative Reporter Options

You can switch to different reporters by modifying `cypress.config.js`:

### JUnit XML (for CI/CD integration)
```javascript
reporter: "junit",
reporterOptions: {
  mochaFile: "cypress/reports/test-results-[hash].xml",
  toConsole: true
}
```

### Simple JSON
```javascript
reporter: "json",
reporterOptions: {
  outputFile: "cypress/reports/test-results.json"
}
```

### TAP Format
```javascript
reporter: "tap",
reporterOptions: {
  outputFile: "cypress/reports/test-results.tap"
}
```
