import { Given, When, Then, DataTable, setDefaultTimeout } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../hooks/world';
import { compareScreenshotToBaseline } from '../../visual-tests/compareSnapshots';
import * as dotenv from 'dotenv';
dotenv.config();
const timeout = parseInt(process.env.STEP_TIMEOUT || "60000");
setDefaultTimeout(timeout); // Set default timeout to 60 seconds

const gmailBody = `Hi,\n\nI am an ISTQB-certified Senior QA Engineer with 15+ years of experience in Test Automation (Selenium, Playwright, Gauge), API Testing, and GCP cloud environments across Investment Banking and Healthcare domains. I have led QA teams and worked individually as well, part of teams built BDD-Cucumber Playwright framework from scratch, and leveraged AI tools like GitHub Copilot and Claude Code to accelerate delivery.\n\nI am an immediate joiner with no notice period and am ready to contribute from day one. I would welcome the opportunity to discuss how my skills align with your team's goals.\n\nWarm regards,\n\nRohit Kurup\n\n+91 7757056536`;

Given('I am on url {string}', { timeout }, async function (this: CustomWorld, url: string) {
    console.log(`==================================`);
    console.log('testInfo title:', this.testInfo.title);
    console.log('testInfo scenarioName:', this.testInfo.scenarioName);
    console.log('testInfo browser:', this.testInfo.browser);
    console.log('testInfo object:');
    console.dir(this.testInfo, { depth: 3 });
    console.log(`I am on url ${url}`);
    await this.pageFixtures.basePage.navigateTo(url);
});

Given('I perform the TestMu simple form demo validation', { timeout }, async function (this: CustomWorld) {
    const testMuUrl = 'https://www.testmuai.com/selenium-playground/';
    const messageText = 'Welcome to TestMu AI';

    await this.pageFixtures.basePage.navigateTo(testMuUrl);
    await this.page.waitForURL(/selenium-playground\//);
    await this.page.getByRole('link', { name: 'Simple Form Demo' }).click();

    await expect(this.page).toHaveURL(/simple-form-demo/);

    const enterMessageInput = this.page.locator('input#user-message').first();
    await enterMessageInput.waitFor({ state: 'visible' });
    await enterMessageInput.fill(messageText);

    const getCheckedValueButton = this.page.getByRole('button', { name: 'Get Checked Value' });
    await getCheckedValueButton.click();

    const displayedMessage = this.page.locator('#message').first();
    await expect(displayedMessage).toBeVisible();
    await expect(displayedMessage).toContainText(messageText);
});

When('I enter {string} in Snacks field', { timeout }, async function (this: CustomWorld, fieldText: string ) {
    console.log(`I enter ${fieldText} in Snaks field`);
    await this.pageFixtures.shadowPage.enterTextInSnacksField(fieldText);
    const credentialsLog = `Credentials for ENV : ${process.env.ENVIRONMENT} :: ${JSON.stringify(this.credentials, null, 2)}`;
    const userDataLog = `User Data for USER : ${process.env.USER_NAME} :: ${JSON.stringify(this.userData, null, 2)}`;    
    this.logMessage(credentialsLog);
    this.logMessage(userDataLog);    
    // Attach logs to report
    // await this.attach(credentialsLog, 'text/plain');
    // await this.attach(userDataLog, 'text/plain');

    await this.page.waitForTimeout(2000);
});

Then('I see {string} in the Snacks field', async function (this: CustomWorld, fieldText: string) {
    const actualValue = await this.pageFixtures.shadowPage.getTextFromSnacksField();
    console.log(`I see Actual Value: ${actualValue} in the Snacks field`);
    expect(actualValue).toBe(fieldText);
});

Then('I compare the page screenshot with baseline {string}', async function (this: CustomWorld, snapshotName: string) {
    const screenshot = await this.page.screenshot();
    const result = await compareScreenshotToBaseline({
        screenshotBuffer: screenshot,
        name: snapshotName,
    });

    console.log(result.message);
    if (!result.passed) {
        throw new Error(`Visual difference detected. See ${result.diffPath}`);
    }
});

When('I enter text in Lunch Time and Coffee Time fields', { timeout }, async function (this: CustomWorld, dataTable: DataTable) {
    const rows = dataTable.hashes();
    for (const row of rows) {
        console.log(`I enter ${row['Lunch Time']} in Lunch Time field`);
        console.log(`I enter ${row['Coffee Time']} in Coffee Time field`);
        await this.pageFixtures.shadowPage.enterTextInLunchAndCoffeeTimeFields(row['Lunch Time'], row['Coffee Time']);
    }
});

Given('I am on Gmail inbox {string}', { timeout }, async function (this: CustomWorld, url: string) {
    await this.pageFixtures.gmailPage.openGmailInbox(url);
    await this.pageFixtures.gmailPage.loginToGmail(process.env.USER_EMAIL || '', process.env.USER_PASSWORD || '');
});

When('I click the compose button', { timeout }, async function (this: CustomWorld) {
    await this.pageFixtures.gmailPage.clickComposeButton();
});

When('I enter the email subject {string}', { timeout }, async function (this: CustomWorld, subject: string) {
    await this.pageFixtures.gmailPage.enterSubject(subject);
});

When('I enter the email body in the compose window', { timeout }, async function (this: CustomWorld) {
    await this.pageFixtures.gmailPage.enterBody(gmailBody);
});

Then('I should see the compose window with the filled subject and body', async function (this: CustomWorld) {
    await this.pageFixtures.gmailPage.assertComposeWindowFilled('QA: Playwright/Selenium-Immediate Joiner', gmailBody);
});