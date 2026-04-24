import { Page, expect, Locator } from "@playwright/test";
import winston from "winston";
import * as dotenv from 'dotenv';
dotenv.config();

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
            return `${timestamp} [${level.toUpperCase()}]: ${message}`;
        })
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'logs/test.log' })
    ]
});


export class BasePage {
    protected page: Page;

    constructor(page: Page) {
        this.page = page;
        //define locators and other common properties here
        this.page = page;
        this.page.setDefaultTimeout(parseInt(process.env.TIMEOUT || "30000"));
    }

    async navigateTo(url: string) {
        logger.info(`Navigating to ${url}`);
        await this.page.goto(url);
    }

    async getPageTitle(): Promise<string> {
        logger.info("Getting page title");
        return await this.page.title();
    }

    async click(locator: Locator) {
        logger.info(`Clicking on element`);
        await locator.click();
        await this.page.waitForLoadState("networkidle");
    }

    async fill(locator: Locator, text: string) {
        logger.info(`Filling element with text: ${text}`);
        await locator.fill(text);
    }

    async getText(locator: Locator): Promise<string> {
        logger.info(`Getting text from element`);
        return await locator.textContent() || "";
    }

    async getInputValue(locator: Locator): Promise<string> {
        logger.info(`Getting input value from element`);
        return await locator.inputValue();
    }

    async isElementVisible(locator: Locator): Promise<boolean> {
        logger.info(`Checking visibility of element`);
        return await locator.isVisible();
    }

    async waitForElement(locator: Locator) {
        logger.info(`Waiting for element to be visible`);
        await locator.waitFor({ state: "visible" });
    }

    async waitForPageLoad() {
        logger.info("Waiting for page to load");
        await this.page.waitForLoadState("load");
    }

    async waitForDomContentLoaded() {
        logger.info("Waiting for DOM content to be loaded");
        await this.page.waitForLoadState("domcontentloaded");
    }

    async waitForTimeout(timeout: number) {
        logger.info(`Waiting for ${timeout} milliseconds`);
        await this.page.waitForTimeout(timeout);
    }

    async checkCheckbox(locator: Locator) {
        logger.info(`Checking checkbox`);
        await locator.check();
    }

    async uncheckCheckbox(locator: Locator) {
        logger.info(`Unchecking checkbox`);
        await locator.uncheck();
    }
    
    async isCheckboxChecked(locator: Locator): Promise<boolean> {
        logger.info(`Checking if checkbox is checked`);
        return await locator.isChecked();
    }

    async selectOption(locator: Locator, value: string) {
        logger.info(`Selecting option with value: ${value}`);
        await locator.selectOption(value);
    }

    async getSelectedOption(locator: Locator): Promise<string> {
        logger.info(`Getting selected option from dropdown`);
        const selectedOption = await locator.locator("option:checked");
        return await selectedOption?.textContent() || "";
    }

    async hover(locator: Locator) {
        logger.info(`Hovering over element`);
        await locator.hover();
    }

    async scrollTo(locator: Locator) {
        logger.info(`Scrolling to element`);
        await locator.scrollIntoViewIfNeeded();
    }

    async moveTo(locator: Locator) {
        logger.info(`Moving to element`);
        const box = await locator.boundingBox();
        if (box) {
            await this.page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
        }
    }

    async getValue(locator: Locator): Promise<string> {
        logger.info(`Getting value from element`);
        return await locator.inputValue();
    }

    async getAttribute(locator: Locator, attribute: string): Promise<string | null> {
        logger.info(`Getting attribute: ${attribute} from element`);
        return await locator.getAttribute(attribute);
    }

    async assertText(locator: Locator, expectedText: string) {
        logger.info(`Asserting text for element`);
        await expect(locator).toHaveText(expectedText);
    }

    async assertElementVisible(locator: Locator) {
        logger.info(`Asserting element is visible`);
        await expect(locator).toBeVisible();
    }

    async assertElementNotVisible(locator: Locator) {
        logger.info(`Asserting element is not visible`);
        await expect(locator).not.toBeVisible();
    }



}