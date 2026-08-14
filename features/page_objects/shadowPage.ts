import { BasePage } from "./basePage";
import { Locator, FrameLocator, Page, expect } from "@playwright/test";



export class ShadowPage extends BasePage {
    //Constructor
    constructor(page: Page) {
        super(page);
    }

    //Locators Definition
    private get frame(): FrameLocator {
        return this.page.frameLocator("#pact").first();
    }

    private get snacksField(): Locator {
        return this.frame.locator("#snacktime #tea");
    }

    private get lunchTimeField(): Locator {
        return this.frame.locator("#snacktime #app2 #pizza");
    }

    private get coffeeTimeField(): Locator {
        return this.frame.locator("#jest").getByTitle("Coffee is coffee");
    }

    private get simpleFormInput(): Locator {
        return this.page.locator('input#user-message').first();
    }

    private get getCheckedValueButton(): Locator {
        return this.page.getByRole('button', { name: 'Get Checked Value' });
    }

    private get simpleFormMessage(): Locator {
        return this.page.locator('#message').first();
    }


    //Methods Definition
    async enterTextInSnacksField(fieldText: string): Promise<void> {
        await this.fill(this.snacksField, fieldText);
    }

    async getTextFromSnacksField(): Promise<string | null> {
        return await this.getInputValue(this.snacksField);
    }

    async enterTextInLunchAndCoffeeTimeFields(lunchTime: string, coffeeTime: string): Promise<void> {
        await this.lunchTimeField.clear();
        await this.fill(this.lunchTimeField, lunchTime);
        // await this.coffeeTimeField?.clear();
        // await this.coffeeTimeField?.fill(coffeeTime);
        await this.page.waitForTimeout(2000);
    }

    async validateSimpleFormDemoFlow(messageText: string): Promise<void> {
        await this.page.goto('https://www.testmuai.com/selenium-playground/');
        await this.page.waitForURL(/selenium-playground\//);
        await this.page.getByRole('link', { name: 'Simple Form Demo' }).click();
        await expect(this.page).toHaveURL(/simple-form-demo/);
        await this.simpleFormInput.waitFor({ state: 'visible' });
        await this.fill(this.simpleFormInput, messageText);
        await this.click(this.getCheckedValueButton);
        await expect(this.simpleFormMessage).toContainText(messageText);
    }
}   
