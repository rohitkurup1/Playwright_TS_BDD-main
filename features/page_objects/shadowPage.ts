import { BasePage } from "./basePage";
import { Locator, FrameLocator, Page } from "@playwright/test";



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
}   
