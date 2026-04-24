import { Before, BeforeAll, After, AfterAll, Status, AfterStep } from '@cucumber/cucumber';
import fs from 'fs';
import path from 'path';
import { CustomWorld } from './world';

BeforeAll(function () {
    console.log(`$$$$$ BeforeAll hook executed $$$$$`);    
    const tracesDir = path.join(process.cwd(), 'test-results/traces');
    if (fs.existsSync(tracesDir)) {
        fs.rmSync(tracesDir, { recursive: true, force: true });
        console.log(`Cleaned up old traces`);
    }
});

Before(async function (this: CustomWorld) {
    console.log(`###### Before hook executed ######`);
    await this.init();
    await this.context.tracing.start({ screenshots: true, snapshots: true });
});

After(async function (this: CustomWorld, scenario) {
    console.log(`###### After hook executed for scenario: ${scenario.pickle.name} with status: ${scenario.result?.status} ######`);
    
    if (scenario.result?.status === Status.FAILED && this.page) {
        const tracePath = `test-results/traces/${scenario.pickle.name.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}.zip`;
        await this.context.tracing.stop({ path: tracePath });
        console.log(`Trace saved at: ${tracePath}`);
        
        const screenshot = await this.page.screenshot({ fullPage: true });
        this.attach(screenshot, 'image/png');
        
        if (scenario.result?.message) {
            const cleanError = scenario.result.message
                .replace(/\u001b\[[0-9;]*m/g, '')
                .replace(/\[\d+m/g, '')
                .replace(/\[22m|\[2m|\[31m|\[39m|\[32m|\[7m|\[27m/g, '');
            this.attach(`Error: ${cleanError}`, 'text/plain');
        }
        
        console.log(`Screenshot attached to report`);
    } else {
        await this.context.tracing.stop();
    }
    await this.close();
});
 AfterStep(async function (this: CustomWorld, step) {
    if (this.logs.length > 0) {
        this.attach(this.logs.join('\n'), 'text/plain');
    }
    this.logs = [];
});

AfterAll(function () {
    // Write code here that will be executed after all scenarios
    console.log(`$$$$$ AfterAll hook executed $$$$$`);
});