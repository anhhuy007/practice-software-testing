const fs = require('fs');
const path = require('path');

/**
 * Extract all failed tests from all JSON report files
 */

const reportsDir = path.join(__dirname, '..', 'cypress', 'reports');
const outputDir = path.join(__dirname, '..', 'comprehensive-bug-reports');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function extractFailuresFromAllReports() {
  try {
    // Get all JSON files
    const files = fs.readdirSync(reportsDir).filter(file => file.endsWith('.json'));
    
    if (files.length === 0) {
      console.log('No JSON report files found');
      return;
    }

    let allFailures = [];
    let allTests = [];
    let testSuites = new Set();
    
    console.log(`Processing ${files.length} report files...`);

    files.forEach(file => {
      const filePath = path.join(reportsDir, file);
      console.log(`Reading: ${file}`);
      
      try {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        
        if (data.results && Array.isArray(data.results)) {
          data.results.forEach(result => {
            if (result.suites && Array.isArray(result.suites)) {
              result.suites.forEach(suite => {
                testSuites.add(suite.title);
                
                if (suite.tests && Array.isArray(suite.tests)) {
                  suite.tests.forEach(test => {
                    allTests.push({
                      file: result.file || result.fullFile,
                      suite: suite.title,
                      title: test.title,
                      fullTitle: test.fullTitle,
                      state: test.state,
                      duration: test.duration,
                      error: test.err,
                      code: test.code,
                      uuid: test.uuid,
                      reportFile: file,
                      stats: data.stats
                    });

                    if (test.state === 'failed') {
                      allFailures.push({
                        file: result.file || result.fullFile,
                        suite: suite.title,
                        title: test.title,
                        fullTitle: test.fullTitle,
                        duration: test.duration,
                        error: test.err,
                        code: test.code,
                        uuid: test.uuid,
                        reportFile: file,
                        stats: data.stats
                      });
                    }
                  });
                }
              });
            }
          });
        }
      } catch (error) {
        console.error(`Error processing ${file}:`, error.message);
      }
    });

    // Generate comprehensive bug report
    let bugReport = `# COMPREHENSIVE BUG REPORT - Chrome Testing Session
**Generated:** ${new Date().toISOString()}
**Total Report Files Processed:** ${files.length}
**Test Suites Found:** ${Array.from(testSuites).length}
**Total Tests:** ${allTests.length}
**Total Failures:** ${allFailures.length}

---

## EXECUTIVE SUMMARY

**Test Suites Analyzed:**
${Array.from(testSuites).map(suite => `- ${suite}`).join('\n')}

**Overall Results:**
- Total Unique Tests: ${allTests.length}
- Total Failures: ${allFailures.length}
- Pass Rate: ${((allTests.length - allFailures.length) / allTests.length * 100).toFixed(2)}%

---

## DETAILED BUG REPORTS

`;

    // Generate individual bug reports
    allFailures.forEach((failure, index) => {
      const bugId = `BUG-${String(index + 1).padStart(3, '0')}`;
      
      // Determine priority based on test type and error
      let priority = 'Medium';
      let severity = 'Major';
      
      if (failure.suite.includes('SECURITY') || failure.suite.includes('ACCESSIBILITY')) {
        priority = 'High';
        severity = 'Critical';
      } else if (failure.suite.includes('PERFORMANCE') || failure.suite.includes('USABILITY')) {
        priority = 'High';
        severity = 'Major';
      } else if (failure.suite.includes('CONTENT') || failure.suite.includes('COLORS')) {
        priority = 'Medium';
        severity = 'Minor';
      }

      bugReport += `### ${bugId}
**○ Summary**  
${failure.title}

**○ Steps to Reproduce**  
1. Navigate to the application page
2. Execute test: "${failure.title}"
3. Observe the failure condition
\`\`\`javascript
${failure.code || 'Test code not available'}
\`\`\`

**○ Actual Result vs Expected Result**  
- **Actual Result:** ${failure.error?.message || 'Test failed without specific error message'}
- **Expected Result:** Test should pass according to the GUI checklist requirement

**○ Screenshot**  
Screenshot available in: \`cypress/screenshots/${failure.file}/${failure.fullTitle} (failed).png\`

**○ Priority and Severity**  
- **Priority:** ${priority}
- **Severity:** ${severity}
- **Test Duration:** ${failure.duration}ms

**○ Affected Feature / Version**  
- **Feature:** ${failure.suite}
- **Test File:** ${failure.file}
- **Test UUID:** ${failure.uuid}
- **Report File:** ${failure.reportFile}

**○ Technical Details**  
\`\`\`
Error Message: ${failure.error?.message || 'No error message'}
Error Stack: ${failure.error?.estack || 'No stack trace'}
\`\`\`

---

`;
    });

    // Add summary statistics
    bugReport += `## TEST SUITE STATISTICS

`;

    // Group failures by suite
    const failuresBySuite = {};
    allFailures.forEach(failure => {
      if (!failuresBySuite[failure.suite]) {
        failuresBySuite[failure.suite] = [];
      }
      failuresBySuite[failure.suite].push(failure);
    });

    Object.keys(failuresBySuite).forEach(suite => {
      bugReport += `### ${suite}
- **Total Failures:** ${failuresBySuite[suite].length}
- **Failed Tests:**
${failuresBySuite[suite].map(f => `  - ${f.title}`).join('\n')}

`;
    });

    // Save the comprehensive report
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const reportPath = path.join(outputDir, `comprehensive-bug-report-${timestamp}.md`);
    fs.writeFileSync(reportPath, bugReport);

    // Save raw data as JSON
    const jsonPath = path.join(outputDir, `all-failures-${timestamp}.json`);
    fs.writeFileSync(jsonPath, JSON.stringify({
      generatedAt: new Date().toISOString(),
      totalFiles: files.length,
      totalTests: allTests.length,
      totalFailures: allFailures.length,
      testSuites: Array.from(testSuites),
      failures: allFailures
    }, null, 2));

    console.log('✅ Comprehensive bug report generated successfully:');
    console.log(`📄 Markdown Report: ${reportPath}`);
    console.log(`📊 JSON Data: ${jsonPath}`);
    console.log(`\n📈 Summary:`);
    console.log(`  - Total Tests: ${allTests.length}`);
    console.log(`  - Total Failures: ${allFailures.length}`);
    console.log(`  - Pass Rate: ${((allTests.length - allFailures.length) / allTests.length * 100).toFixed(2)}%`);

  } catch (error) {
    console.error('❌ Error generating comprehensive report:', error.message);
  }
}

// Run the comprehensive analysis
extractFailuresFromAllReports();
