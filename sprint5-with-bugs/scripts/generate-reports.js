const fs = require('fs');
const path = require('path');

/**
 * Custom script to generate additional test result formats
 * Run this after cypress tests complete
 */

const reportsDir = path.join(__dirname, '..', 'cypress', 'reports');
const outputDir = path.join(__dirname, '..', 'test-results');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Function to merge and process mochawesome JSON reports
function processReports() {
  try {
    // Look for JSON report files
    const files = fs.readdirSync(reportsDir).filter(file => file.endsWith('.json'));
    
    if (files.length === 0) {
      console.log('No JSON report files found');
      return;
    }

    // Merge all JSON reports
    let mergedResults = {
      tests: [],
      passes: 0,
      failures: 0,
      pending: 0,
      skipped: 0,
      duration: 0,
      suites: []
    };

    files.forEach(file => {
      const filePath = path.join(reportsDir, file);
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      
      if (data.tests) {
        mergedResults.tests = mergedResults.tests.concat(data.tests);
        mergedResults.passes += data.stats?.passes || 0;
        mergedResults.failures += data.stats?.failures || 0;
        mergedResults.pending += data.stats?.pending || 0;
        mergedResults.skipped += data.stats?.skipped || 0;
        mergedResults.duration += data.stats?.duration || 0;
        
        if (data.suites) {
          mergedResults.suites = mergedResults.suites.concat(data.suites);
        }
      }
    });

    // Save merged JSON report
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const jsonOutputPath = path.join(outputDir, `test-results-${timestamp}.json`);
    fs.writeFileSync(jsonOutputPath, JSON.stringify(mergedResults, null, 2));

    // Generate simple text summary
    const summary = `
Test Results Summary
===================
Total Tests: ${mergedResults.tests.length}
Passed: ${mergedResults.passes}
Failed: ${mergedResults.failures}
Pending: ${mergedResults.pending}
Skipped: ${mergedResults.skipped}
Duration: ${(mergedResults.duration / 1000).toFixed(2)}s
Generated: ${new Date().toISOString()}

Failed Tests:
${mergedResults.tests
  .filter(test => test.err)
  .map(test => `- ${test.fullTitle}: ${test.err.message}`)
  .join('\n')}
`;

    const txtOutputPath = path.join(outputDir, `test-summary-${timestamp}.txt`);
    fs.writeFileSync(txtOutputPath, summary);

    // Generate CSV for easy spreadsheet import
    const csvHeader = 'Test Title,Status,Duration (ms),Error Message\n';
    const csvContent = mergedResults.tests.map(test => {
      const title = `"${test.fullTitle?.replace(/"/g, '""') || ''}"`;
      const status = test.err ? 'FAILED' : 'PASSED';
      const duration = test.duration || 0;
      const error = test.err ? `"${test.err.message.replace(/"/g, '""')}"` : '';
      return `${title},${status},${duration},${error}`;
    }).join('\n');

    const csvOutputPath = path.join(outputDir, `test-results-${timestamp}.csv`);
    fs.writeFileSync(csvOutputPath, csvHeader + csvContent);

    console.log('✅ Test reports generated successfully:');
    console.log(`📄 JSON: ${jsonOutputPath}`);
    console.log(`📝 Summary: ${txtOutputPath}`);
    console.log(`📊 CSV: ${csvOutputPath}`);

  } catch (error) {
    console.error('❌ Error processing reports:', error.message);
  }
}

// Run the report processing
processReports();
