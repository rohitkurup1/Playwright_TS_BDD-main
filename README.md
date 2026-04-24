# Playwright BDD Test Automation Framework

A robust test automation framework built with Playwright and Cucumber BDD for end-to-end testing.

## 🚀 Features

- **BDD with Cucumber**: Write tests in Gherkin syntax
- **Playwright Integration**: Cross-browser testing (Chromium, Firefox, WebKit)
- **TypeScript**: Type-safe test development
- **Page Object Model**: Maintainable and reusable page objects
- **Parallel Execution**: Run tests in parallel for faster execution
- **Multiple Reports**: HTML reports with screenshots and traces
- **Environment Configuration**: Support for multiple environments
- **CI/CD Ready**: GitLab CI/CD pipeline configuration included
- **Tracing & Screenshots**: Automatic capture on test failures
- **Custom Logging**: Built-in logging with report attachments

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## 🛠️ Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Playwright_BDD
```

2. Install dependencies:
```bash
npm install
```

3. Install Playwright browsers:
```bash
npx playwright install
```

## 📁 Project Structure

```
Playwright_BDD/
├── features/
│   ├── step_definitions/     # Step definition files
│   ├── page_objects/         # Page Object Model classes
│   ├── hooks/                # Before/After hooks and World
│   └── *.feature             # Feature files (Gherkin)
├── fixtures/                 # Page fixtures
├── utils/                    # Utility functions
├── test_data/                # Test data (JSON files)
├── reports/                  # Test reports
├── test-results/             # Screenshots and traces
├── cucumber.json             # Cucumber configuration
├── .env                      # Environment variables
└── package.json              # Project dependencies
```

## ⚙️ Configuration

### Environment Variables (.env)

```env
# Browser Configuration
BROWSER=chromium              # Options: chromium, firefox, webkit
HEADLESS=false
VIEWPORT_WIDTH=1920
VIEWPORT_HEIGHT=1080

# Test Configuration
ENVIRONMENT=QA1
USER_NAME=user1
STEP_TIMEOUT=60000
```

## 🧪 Running Tests

### Basic Commands

```bash
# Run all tests
npm test

# Run tests in specific browser
npm run test:chromium
npm run test:firefox
npm run test:webkit

# Run tests in parallel (2 workers)
npm run test:parallel

# Run tests in parallel (4 workers)
npm run test:parallel:4

# Run tests and generate report
npm run test:report
npm run test:report_multi
```

### Run with Environment Variables

```bash
# Run in headless mode
HEADLESS=true npm test

# Run in Firefox
BROWSER=firefox npm test

# Run with specific environment
ENVIRONMENT=STAGING npm test
```

## 📊 Reports

### Generate Reports

```bash
# Generate single HTML report
npm run report

# Generate multiple cucumber HTML report
npm run report_multi
```

Reports are generated in the `reports/` directory:
- `cucumber_report.html` - Single page report
- `index.html` - Multiple cucumber HTML report with screenshots

### View Traces

```bash
npx playwright show-trace test-results/traces/<trace-file>.zip
```

## 📝 Writing Tests

### Feature File Example

```gherkin
Feature: Login functionality
  
  @smoke
  Scenario: Successful login
    Given I am on url "https://example.com"
    When I enter "username" in username field
    And I enter "password" in password field
    And I click login button
    Then I should see dashboard
```

### Step Definition Example

```typescript
import { Given, When, Then } from '@cucumber/cucumber';
import { CustomWorld } from '../hooks/world';

Given('I am on url {string}', async function (this: CustomWorld, url: string) {
    await this.pageFixtures.basePage.navigateTo(url);
});
```

### Page Object Example

```typescript
export class LoginPage extends BasePage {
    private get usernameField() {
        return this.page.locator('#username');
    }

    async enterUsername(username: string) {
        await this.fill(this.usernameField, username);
    }
}
```

## 🎯 Best Practices

1. **Use Page Object Model**: Keep locators and actions in page objects
2. **Use Getters for Locators**: Define locators as getters for lazy evaluation
3. **Use Custom Logging**: Use `this.logMessage()` for logs in reports
4. **Handle Waits**: Use Playwright's auto-waiting features
5. **Clean Test Data**: Use hooks to clean up test data
6. **Parallel Execution**: Design tests to run independently

## 🔧 Troubleshooting

### Common Issues

**Issue**: `ts-node command not found`
```bash
npm install
npx ts-node <file>
```

**Issue**: Browser not found
```bash
npx playwright install
```

**Issue**: Tests timing out
- Increase timeout in `.env`: `STEP_TIMEOUT=120000`
- Or in step definition: `{ timeout: 120000 }`

## 🚀 CI/CD Integration

### GitLab CI/CD

The project includes `.gitlab-ci.yml` for GitLab pipelines:
- Runs tests in multiple browsers
- Generates and archives reports
- Saves screenshots and traces as artifacts

## 📚 Additional Resources

- [Playwright Documentation](https://playwright.dev/)
- [Cucumber Documentation](https://cucumber.io/docs/cucumber/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Write/update tests
4. Submit a pull request

## 📄 License

ISC

## 👥 Authors

- Your Name

## 📞 Support

For issues and questions, please open an issue in the repository.
