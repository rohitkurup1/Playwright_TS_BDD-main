import { Page } from "playwright";
import { BasePage } from "../features/page_objects/basePage";
import { GmailPage } from "../features/page_objects/gmailPage";
import { ShadowPage } from "../features/page_objects/shadowPage";
// import { HomePage } from "../features/page_objects/homePage";
// import { LoginPage } from "../features/page_objects/loginPage";


export class PageFixtures {
    private page: Page;
    readonly shadowPage: ShadowPage;
    readonly basePage: BasePage;
    readonly gmailPage: GmailPage;
    // readonly homePage: HomePage;
    // readonly loginPage: LoginPage;

    constructor(page: Page) {
        this.page = page;
        this.shadowPage = new ShadowPage(page);
        this.basePage = new BasePage(page);
        this.gmailPage = new GmailPage(page);
        // this.homePage = new HomePage(page);
        // this.loginPage = new LoginPage(page);
    }

}
