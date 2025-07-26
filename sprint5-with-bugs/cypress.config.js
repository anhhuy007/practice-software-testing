const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "http://localhost:4200",
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
    
    // Set Chrome as default browser
    browser: "chrome",
    
    // Configure test result reporting
    setupNodeEvents(on, config) {
      // You can add custom event listeners here if needed
      return config;
    },
    
    // Save videos and screenshots
    video: true,
    videosFolder: "cypress/videos",
    screenshotsFolder: "cypress/screenshots",
    
    // Reporter configuration - mochawesome for HTML reports
    reporter: "mochawesome",
    reporterOptions: {
      reportDir: "cypress/reports",
      overwrite: false,
      html: true,
      json: true,
      timestamp: "mmddyyyy_HHMMss"
    }
  },
  
  // Alternative reporter configurations you can use:
  // For JUnit XML format (uncomment to use):
  // reporter: "junit",
  // reporterOptions: {
  //   mochaFile: "cypress/reports/test-results-[hash].xml",
  //   toConsole: true
  // }
  
  // For JSON format (uncomment to use):
  // reporter: "json",
  // reporterOptions: {
  //   outputFile: "cypress/reports/test-results.json"
  // }
});