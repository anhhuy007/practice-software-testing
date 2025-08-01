const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4200/#', // Local development server
    viewportWidth: 1280,
    viewportHeight: 720,
    defaultCommandTimeout: 10000,
    pageLoadTimeout: 60000,
    video: true,
    videosFolder: 'test-results/videos',
    screenshotsFolder: 'test-results/screenshots',
    screenshotOnRunFailure: true,
    
    setupNodeEvents(on, config) {
      // implement node event listeners here
      on('after:spec', (spec, results) => {
        // Copy artifacts to output directory
        if (results && results.video) {
          // Save video file with meaningful name
          const videoName = `${spec.name.replace('/', '-').replace('.cy.js', '')}-${Date.now()}.mp4`;
          return require('fs').renameSync(
            results.video,
            `test-results/videos/${videoName}`
          );
        }
      });
    },
    
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/e2e.js',
    
    env: {
      baseUrl: 'http://localhost:4200/#'
    },
    
    reporter: 'mochawesome',
    reporterOptions: {
      reportDir: 'test-results/reports',
      overwrite: false,
      html: true,
      json: true
    }
  },
});
