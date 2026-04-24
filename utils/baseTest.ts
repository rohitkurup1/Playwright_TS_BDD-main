import {test as baseTest, expect} from "@playwright/test";
import { PageFixtures } from "../fixtures/pageFixtures";

type TestFixtures = {
    pageFixtures: PageFixtures;
}

export const test = baseTest.extend<TestFixtures>({
    pageFixtures: async ({ page }, use) => {
        const pageFixtures = new PageFixtures(page);
        await use(pageFixtures);
    }
});

export { expect };