const report = require("multiple-cucumber-html-reporter");
const os = require("os");
import * as dotenv from 'dotenv';
dotenv.config();


const browserName = process.env.BROWSER || "chrome";
const browserVersion = process.env.BROWSER_VERSION || "latest";

report.generate({
  jsonDir: "reports/",
  reportPath: "./reports/",
  screenshotsDirectory: "screenshots",
  screenshotPath: "./reports/screenshots/",
  screenshotOn: "failed",
  storeScreenshots: true,
  openReportInBrowser: true,
  displayDuration: true,
  // durationInMS: true,
  durationInSec: true,
  metadata: {
    browser: {
      // name: browserName,
      // version: browserVersion,
      name: browserVersion,
      version: browserName,
    },
    device: os.hostname(),
    platform: {
      name: os.platform(),
      version: os.release(),
    },
  },
  customData: {
    title: "Run info",
    data: [
      { label: "Project", value: "Custom project" },
      { label: "Release", value: "1.2.3" },
      { label: "Cycle", value: "B11221.34321" },
      { label: "Execution Start Time", value: new Date().toLocaleString() },
      { label: "Execution End Time", value: new Date().toLocaleString() },
    ],
  },
});