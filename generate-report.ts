import { generate } from 'cucumber-html-reporter';
const options: {
    theme: 'bootstrap' | 'simple' | 'hierarchy' | 'foundation';
    jsonFile: string;
    output: string;
    reportSuiteAsScenarios: boolean;
    launchReport: boolean;
    metadata: {
        "App Version": string;
        "Test Environment": "STAGING" | "PRODUCTION" | "DEVELOPMENT";
        "Browser": string;
        "Platform": string;
        "Parallel Mode": string;
        "Executed": string;
    };
} = {
    theme: 'bootstrap',
    jsonFile: 'reports/cucumber_report.json',
    output: 'reports/cucumber_report.html',
    reportSuiteAsScenarios: true,
    launchReport: true,
    metadata: {
        "App Version": "0.3.2",
        "Test Environment": "STAGING",
        "Browser": "Chrome",
        "Platform": "Mac",
        "Parallel Mode": "Scenarios",
        "Executed": "Remote"
    }
};
generate(options);
