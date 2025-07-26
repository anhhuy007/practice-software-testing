#!/bin/bash

echo "🚀 Running Cypress Tests with Report Generation"
echo "=============================================="

# Run tests and generate reports
echo "📋 Running tests..."
npm run cy:run

echo ""
echo "📊 Generating custom reports..."
npm run generate:custom

echo ""
echo "✅ Test execution complete!"
echo ""
echo "📁 Check these locations for reports:"
echo "   - HTML Reports: cypress/reports/"
echo "   - Custom Reports: test-results/"
echo "   - Videos: cypress/videos/"
echo "   - Screenshots: cypress/screenshots/"
