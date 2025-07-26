Write-Host "🚀 Running Cypress Tests with Report Generation" -ForegroundColor Green
Write-Host "==============================================" -ForegroundColor Green

# Run tests and generate reports
Write-Host "📋 Running tests..." -ForegroundColor Yellow
npm run cy:run

Write-Host ""
Write-Host "📊 Generating custom reports..." -ForegroundColor Yellow
npm run generate:custom

Write-Host ""
Write-Host "✅ Test execution complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📁 Check these locations for reports:" -ForegroundColor Cyan
Write-Host "   - HTML Reports: cypress/reports/" -ForegroundColor White
Write-Host "   - Custom Reports: test-results/" -ForegroundColor White
Write-Host "   - Videos: cypress/videos/" -ForegroundColor White
Write-Host "   - Screenshots: cypress/screenshots/" -ForegroundColor White
