import { setWorldConstructor, IWorldOptions, World } from "@cucumber/cucumber";
import { Page, Browser, BrowserContext, chromium, webkit, firefox } from "playwright";
import { PageFixtures } from "../../fixtures/pageFixtures";
import { getCredentialsData, getUserData } from "../../utils/getData";
import { loadEnvironment } from "../../utils/envLoader";


export class CustomWorld extends World {
    page!: Page;
    browser!: Browser;
    context!: BrowserContext;
    pageFixtures!: PageFixtures;
    credentials: { [key: string]: any } = {};
    userData: { [key: string]: any } = {};
    logs: string[] = [];

    constructor(options: IWorldOptions) {
        super(options);
        
        // Load environment variables based on ENVIRONMENT variable
        loadEnvironment();
        
        this.page = options.parameters.page;
        this.browser = options.parameters.browser;
        this.pageFixtures = options.parameters.pageFixtures;
        this.credentials = getCredentialsData(process.env.ENVIRONMENT || "RSDEV1");
        this.userData = getUserData(process.env.USER_NAME || "user1");
        const path = require('path');
    }

    logMessage(message: string): void {
        console.log(message);
        this.logs.push(message);
    }

    async init(): Promise<void> {
        const browserType = process.env.BROWSER || 'chromium';
        const headless = process.env.HEADLESS === 'true';
        const viewportWidth = parseInt(process.env.VIEWPORT_WIDTH || '1920');
        const viewportHeight = parseInt(process.env.VIEWPORT_HEIGHT || '1080');

        switch (browserType.toLowerCase()) {
            case 'firefox':
                this.browser = await firefox.launch({ headless: headless });
                break;
            case 'webkit':
                this.browser = await webkit.launch({ headless: headless });
                break;
            case 'chromium':
            default:
                this.browser = await chromium.launch({ headless: headless });
                break;
        }
        this.context = await this.browser.newContext({
            viewport: { width: viewportWidth, height: viewportHeight }
        });
        this.page = await this.context.newPage();
        this.pageFixtures = new PageFixtures(this.page);
    }

    async close(): Promise<void> {
        await this.page.close();
        await this.context?.close();
        await this.browser.close();
    }
}

setWorldConstructor(CustomWorld);
