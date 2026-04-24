import { Given, When, Then, DataTable, setDefaultTimeout } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../hooks/world';
import * as dotenv from 'dotenv';
dotenv.config();
const timeout = parseInt(process.env.STEP_TIMEOUT || "60000");
setDefaultTimeout(timeout); // Set default timeout to 60 seconds

Given('I am on url {string}', { timeout }, async function (this: CustomWorld, url: string) {
    console.log(`==================================`);
    console.log(`I am on url ${url}`);
    await this.pageFixtures.basePage.navigateTo(url);
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

When('I enter text in Lunch Time and Coffee Time fields', { timeout }, async function (this: CustomWorld, dataTable: DataTable) {
    const rows = dataTable.hashes();
    for (const row of rows) {
        console.log(`I enter ${row['Lunch Time']} in Lunch Time field`);
        console.log(`I enter ${row['Coffee Time']} in Coffee Time field`);
        await this.pageFixtures.shadowPage.enterTextInLunchAndCoffeeTimeFields(row['Lunch Time'], row['Coffee Time']);
    }
});