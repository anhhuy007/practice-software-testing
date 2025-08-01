/**
 * Combine Reports Script
 * 
 * This script combines all the generated test reports into one comprehensive report
 * 
 * CS423 - Software Testing
 * Student: anhhuy007
 * Date: August 1, 2025
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Create output directories if they don't exist
const reportsDir = path.join(__dirname, 'test-results', 'reports');
const outputDir = path.join(__dirname, 'test-results', 'combined-report');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Find all JSON reports
const jsonFiles = fs.readdirSync(reportsDir)
  .filter(file => file.endsWith('.json'))
  .map(file => path.join(reportsDir, file));

if (jsonFiles.length === 0) {
  console.error('No JSON reports found!');
  process.exit(1);
}

console.log(`Found ${jsonFiles.length} JSON report files.`);

// Create a combined JSON file
try {
  // Check if mochawesome-merge is available
  execSync('npx mochawesome-merge --version', { stdio: 'ignore' });
  
  console.log('Merging reports...');
  
  // Use mochawesome-merge to combine JSON reports
  const mergedJsonPath = path.join(outputDir, 'combined-report.json');
  const jsonFilePaths = jsonFiles.join(' ');
  
  execSync(`npx mochawesome-merge ${jsonFilePaths} > ${mergedJsonPath}`);
  
  console.log('JSON reports merged successfully!');
  
  // Generate HTML report from the merged JSON
  console.log('Generating HTML report...');
  execSync(`npx marge ${mergedJsonPath} --reportDir ${outputDir} --inline --charts --reportFilename index.html`);
  
  console.log('HTML report generated successfully!');
} catch (error) {
  console.error('Error generating combined report:', error.message);
  
  // Fallback method if mochawesome-merge fails
  console.log('Attempting alternative report generation method...');
  
  // Simple concatenation of test results
  const allResults = {
    stats: {
      suites: 0,
      tests: 0,
      passes: 0,
      pending: 0,
      failures: 0,
      start: '',
      end: '',
      duration: 0
    },
    results: [],
    meta: {
      mocha: {
        version: ''
      },
      mochawesome: {
        options: {},
        version: ''
      },
      marge: {
        options: {
          reportDir: outputDir,
          reportFilename: 'combined-report',
          charts: true
        },
        version: ''
      }
    }
  };
  
  // Combine results from each report
  jsonFiles.forEach(file => {
    try {
      const reportData = JSON.parse(fs.readFileSync(file, 'utf8'));
      
      // Update stats
      allResults.stats.suites += reportData.stats?.suites || 0;
      allResults.stats.tests += reportData.stats?.tests || 0;
      allResults.stats.passes += reportData.stats?.passes || 0;
      allResults.stats.pending += reportData.stats?.pending || 0;
      allResults.stats.failures += reportData.stats?.failures || 0;
      allResults.stats.duration += reportData.stats?.duration || 0;
      
      // Set start time if not set or if earlier
      if (!allResults.stats.start || new Date(reportData.stats?.start) < new Date(allResults.stats.start)) {
        allResults.stats.start = reportData.stats?.start || '';
      }
      
      // Set end time if not set or if later
      if (!allResults.stats.end || new Date(reportData.stats?.end) > new Date(allResults.stats.end)) {
        allResults.stats.end = reportData.stats?.end || '';
      }
      
      // Add results
      if (reportData.results) {
        allResults.results = allResults.results.concat(reportData.results);
      }
      
      // Set meta info if not set
      if (!allResults.meta.mocha.version && reportData.meta?.mocha?.version) {
        allResults.meta.mocha.version = reportData.meta.mocha.version;
      }
      if (!allResults.meta.mochawesome.version && reportData.meta?.mochawesome?.version) {
        allResults.meta.mochawesome.version = reportData.meta.mochawesome.version;
      }
    } catch (err) {
      console.error(`Error processing file ${file}: ${err.message}`);
    }
  });
  
  // Write the combined report
  const mergedJsonPath = path.join(outputDir, 'combined-report.json');
  fs.writeFileSync(mergedJsonPath, JSON.stringify(allResults, null, 2));
  
  try {
    console.log('Generating HTML report using alternative method...');
    execSync(`npx marge ${mergedJsonPath} --reportDir ${outputDir} --inline --charts --reportFilename index.html`);
    console.log('HTML report generated successfully!');
  } catch (htmlError) {
    console.error('Failed to generate HTML report:', htmlError.message);
    console.log('Combined JSON report is available at:', mergedJsonPath);
  }
}

console.log(`Combined report available at: ${path.join(outputDir, 'index.html')}`);
