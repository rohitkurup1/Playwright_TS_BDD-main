import { Locator, Page } from "@playwright/test";
import { BasePage } from "./basePage";

export class GmailPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    private get emailInput(): Locator {
        return this.page.locator('input[type="email"], input[name="identifier"], input[aria-label*="Email"], input[aria-label*="email"]').first();
    }

    private get passwordInput(): Locator {
        return this.page.locator('input[type="password"], input[name="password"], input[aria-label*="Password"]').first();
    }

    private get nextButton(): Locator {
        return this.page.getByRole('button', { name: /next/i }).first();
    }

    private get composeButton(): Locator {
        return this.page.getByRole('button', { name: /compose/i }).first();
    }

    private get composeWindow(): Locator {
        return this.page.locator('div[role="dialog"], div[aria-label*="New Message"], div[aria-label*="Compose"]').first();
    }

    private get subjectInput(): Locator {
        return this.page.locator('input[name="subjectbox"], input[aria-label*="Subject"], textarea[aria-label*="Subject"]').first();
    }

    private get bodyEditor(): Locator {
        return this.page.locator('div[aria-label="Message Body"], div[role="textbox"]').filter({ hasText: '' }).first();
    }

    async openGmailInbox(url: string): Promise<void> {
        await this.navigateTo(url);
        await this.page.waitForLoadState('networkidle');
    }

    async loginToGmail(email: string, password: string): Promise<void> {
        await this.page.waitForTimeout(2000);
        if (await this.emailInput.isVisible().catch(() => false)) {
            await this.fill(this.emailInput, email);
            await this.click(this.nextButton);
        }

        await this.page.waitForTimeout(2000);
        if (await this.passwordInput.isVisible().catch(() => false)) {
            await this.fill(this.passwordInput, password);
            await this.click(this.nextButton);
        }

        await this.page.waitForTimeout(5000);
    }

    async clickComposeButton(): Promise<void> {
        await this.click(this.composeButton);
        await this.waitForElement(this.composeWindow);
    }

    async enterSubject(subject: string): Promise<void> {
        await this.fill(this.subjectInput, subject);
    }

    async enterBody(body: string): Promise<void> {
        await this.page.locator('div[role="textbox"]').first().click();
        await this.page.keyboard.type(body);
    }

    async assertComposeWindowFilled(subject: string, body: string): Promise<void> {
        const enteredSubject = await this.subjectInput.inputValue();
        const enteredBody = await this.page.locator('div[role="textbox"]').first().textContent();
        if (enteredSubject !== subject) {
            throw new Error(`Expected subject '${subject}' but found '${enteredSubject}'`);
        }
        if (!enteredBody?.includes(body)) {
            throw new Error(`Expected body to include '${body}' but found '${enteredBody}'`);
        }
    }
}
