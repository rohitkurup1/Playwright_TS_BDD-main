# Real-World Structure for Custom World, Hooks, and Fixtures

This document shows the clean way to structure a Playwright + Cucumber project in a real-world setup.

The main idea is simple:
- Custom World stores scenario-level data
- Hooks manage the lifecycle of browser and context
- Fixtures are used for test-specific reusable helpers such as login, API calls, or test data

You should not create browser and context in both hooks and fixtures at the same time. In a real project, browser and context setup usually belong in hooks because they are part of the scenario lifecycle.

---

## 1. Custom World

Custom World is used to share values across all step definitions in one scenario.

```ts
// features/support/world.ts
import { setWorldConstructor, World, IWorldOptions } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page } from '@playwright/test';

export class CustomWorld extends World {
  browser!: Browser;
  context!: BrowserContext;
  page!: Page;
  token!: string;
  userName!: string;

  constructor(options: IWorldOptions) {
    super(options);
  }
}

setWorldConstructor(CustomWorld);
```

### Why this is needed

This allows different step definitions to access the same objects and values:
- browser
- context
- page
- token
- user details

---

## 2. Hooks: Where Browser and Context Are Created

In a real project, browser and context creation should happen in hooks.

```ts
// features/support/hooks.ts
import { BeforeAll, Before, After, AfterAll, Status } from '@cucumber/cucumber';
import { chromium, Browser, BrowserContext } from '@playwright/test';
import { CustomWorld } from './world';

let browser: Browser;

BeforeAll(async function () {
  browser = await chromium.launch({ headless: true });
});

Before(async function (this: CustomWorld) {
  const context: BrowserContext = await browser.newContext();
  this.browser = browser;
  this.context = context;
  this.page = await context.newPage();
});

After(async function (this: CustomWorld, scenario) {
  if (scenario.result?.status === Status.FAILED) {
    await this.page.screenshot({ path: `reports/${scenario.pickle.name}.png` });
  }

  await this.context.close();
});

AfterAll(async function () {
  await browser.close();
});
```

### What hooks are doing here

- BeforeAll: launch browser once
- Before: create a fresh context and page for each scenario
- After: close context and capture screenshot on failure
- AfterAll: close browser at the end

This is the correct place for browser and context lifecycle management.

---

## 3. How Fixtures Fit In

Fixtures are not used for browser or context lifecycle in this design.

Why?
- Browser and context are scenario-level setup
- They should be created and cleaned up by hooks
- Fixtures are better for reusable test-specific helpers

### Good use of fixtures

Use fixtures for things like:
- login fixture
- API fixture
- test data fixture
- page object fixture

These are not the core browser lifecycle; they are reusable helpers for the test logic.

---

## 4. Example: Login Fixture

This fixture is used directly in step definitions because it is action-specific.

```ts
// fixtures/loginFixture.ts
export async function loginFixture(page: Page, username: string, password: string) {
  await page.goto('https://example.com/login');
  await page.fill('#username', username);
  await page.fill('#password', password);
  await page.click('#login');
}
```

### Where this fits

- Hooks: no
- Step definitions: yes

Because login is an action that happens inside the scenario, not part of browser startup.

---

## 5. Example: API Fixture

This fixture is used when the test needs API calls.

```ts
// fixtures/apiFixture.ts
export async function apiFixture() {
  return {
    getUser: async (id: string) => ({ id, name: 'John' }),
  };
}
```

### Where this fits

- Hooks: no
- Step definitions: yes

Because API setup is usually needed during the scenario and depends on the test flow.

---

## 6. Example: Test Data Fixture

This fixture provides reusable test data.

```ts
// fixtures/testDataFixture.ts
export function testDataFixture() {
  return {
    username: 'admin@example.com',
    password: 'Password123',
  };
}
```

### Where this fits

- Hooks: no
- Step definitions: yes

Because test data is passed into the step logic, not used to manage browser lifecycle.

---

## 7. Step Definition Example

Here is how everything works together in real usage.

```ts
// step_definitions/login.steps.ts
import { Given, When, Then } from '@cucumber/cucumber';
import { CustomWorld } from '../features/support/world';
import { loginFixture } from '../fixtures/loginFixture';
import { testDataFixture } from '../fixtures/testDataFixture';

Given('I open the login page', async function (this: CustomWorld) {
  await this.page.goto('https://example.com/login');
});

When('I login with valid credentials', async function (this: CustomWorld) {
  const data = testDataFixture();
  await loginFixture(this.page, data.username, data.password);
  this.userName = data.username;
});

Then('I should see the dashboard', async function (this: CustomWorld) {
  await this.page.waitForSelector('#dashboard');
});
```

---

## 8. End-to-End Mapping

Here is the real mapping:

- Custom World → stores shared data for the scenario
- Hooks → create and destroy browser and context
- Step definitions → use the world object and fixtures
- Fixtures → provide reusable login/API/test data helpers

### Simple rule

- Browser and context lifecycle → hooks
- Login, API, test data → step definitions / fixtures

### In one sentence

“In a real project, hooks manage the browser lifecycle, custom world holds scenario state, and fixtures provide reusable test actions or data.”

---

## 9. Support and Utils Folders

### Support folder
Used for:
- world
- hooks
- global config
- shared setup logic

### Utils folder
Used for:
- reading JSON files
- helper methods
- wait functions
- data formatting

This keeps the framework organized and easy to maintain.

