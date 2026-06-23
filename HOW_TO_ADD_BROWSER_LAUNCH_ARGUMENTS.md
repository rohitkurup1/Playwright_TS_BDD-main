# How to Add Browser Launch Arguments in Playwright - Complete Guide

## Quick Answer

Browser launch arguments are passed in the `.launch()` method's options object:

```typescript
this.browser = await chromium.launch({
    headless: true,
    args: [
        '--disable-blink-features=AutomationControlled',
        '--start-maximized',
        '--disable-notifications'
    ]
});
```

---

## Part 1: Current Code vs Enhanced Code

### **Current Code (In your world.ts)**

```typescript
async init(): Promise<void> {
    const browserType = process.env.BROWSER || 'chromium';
    const headless = process.env.HEADLESS === 'true';
    
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
}
```

**What's missing:** No additional launch arguments!

### **Enhanced Code (With Launch Arguments)**

```typescript
async init(): Promise<void> {
    const browserType = process.env.BROWSER || 'chromium';
    const headless = process.env.HEADLESS === 'true';
    
    // Define common launch arguments
    const launchArgs = [
        '--disable-blink-features=AutomationControlled',
        '--start-maximized',
        '--disable-notifications',
        '--disable-popup-blocking'
    ];
    
    switch (browserType.toLowerCase()) {
        case 'firefox':
            this.browser = await firefox.launch({
                headless: headless,
                args: launchArgs  // ← Add arguments
            });
            break;
        case 'webkit':
            this.browser = await webkit.launch({
                headless: headless,
                args: launchArgs
            });
            break;
        case 'chromium':
        default:
            this.browser = await chromium.launch({
                headless: headless,
                args: launchArgs  // ← Add arguments
            });
            break;
    }
}
```

---

## Part 2: Browser Launch Options Structure

### **Complete Launch Options Object**

```typescript
await chromium.launch({
    // Basic options
    headless: true,              // Run without UI
    devtools: false,             // Open DevTools
    
    // Launch arguments (Chrome/Chromium specific)
    args: [
        '--start-maximized',
        '--disable-notifications'
    ],
    
    // Executable path
    executablePath: '/path/to/chromium',
    
    // Timeout
    timeout: 30000,
    
    // Environment variables
    env: {
        CUSTOM_VAR: 'value'
    },
    
    // Firefox/WebKit specific
    firefoxUserPrefs: {
        'network.cookie.cookieBehavior': 0
    },
    
    // Logging
    logger: {
        isEnabled: (name, severity) => true,
        log: (name, severity, message, args) => {}
    }
});
```

---

## Part 3: Common Browser Launch Arguments

### **For Chromium/Chrome**

```typescript
const chromiumArgs = [
    // Window management
    '--start-maximized',                      // Start maximized
    '--new-window',                           // Open new window
    '--window-size=1920,1080',               // Set window size
    
    // Disable features
    '--disable-blink-features=AutomationControlled',  // Hide automation
    '--disable-notifications',               // Disable notifications
    '--disable-popup-blocking',              // Disable popup blocker
    '--disable-sync',                        // Disable sync
    '--disable-extensions',                  // Disable extensions
    '--disable-default-apps',                // Disable default apps
    '--disable-preconnect',                  // Disable preconnect
    
    // User experience
    '--disable-translate',                   // Disable translation
    '--disable-background-networking',       // Disable background network
    '--disable-background-timer-throttling', // Disable timer throttling
    
    // Performance
    '--disable-renderer-backgrounding',      // Disable renderer backgrounding
    '--disable-device-discovery-notifications', // No device discovery
    
    // Security & Privacy
    '--no-first-run',                        // Skip first run wizard
    '--no-default-browser-check',            // No browser check
    '--disable-plugins-power-saver',         // Disable plugin saver
    
    // Proxy
    '--proxy-server=http://proxy.example.com:8080',  // Set proxy
    
    // User data
    '--user-data-dir=/path/to/profile',      // Custom profile
    
    // Remote debugging
    '--remote-debugging-port=9222',          // Remote debug port
    
    // GPU & rendering
    '--disable-gpu',                         // Disable GPU
    '--no-gpu',                              // No GPU
    '--disable-software-rasterizer'          // Disable software rendering
];
```

### **For Firefox**

```typescript
const firefoxArgs = [
    // Window
    '-width=1920',
    '-height=1080',
    
    // Profile
    '-profile=/path/to/profile',
    
    // Various options are handled through firefoxUserPrefs instead
];

// Firefox preferences (not args)
const firefoxPrefs = {
    'browser.startup.homepage': 'about:blank',
    'browser.startup.page': 0,
    'network.cookie.cookieBehavior': 0,
    'privacy.trackingprotection.enabled': true
};
```

### **For WebKit (Safari)**

```typescript
const webkitArgs = [
    // WebKit has limited launch args
    '--enable-automation',
    '--disable-web-resources'
];
```

---

## Part 4: Practical Example - Adding Arguments

### **Update Your world.ts**

Replace the `init()` method:

```typescript
async init(): Promise<void> {
    const browserType = process.env.BROWSER || 'chromium';
    const headless = process.env.HEADLESS === 'true';
    const viewportWidth = parseInt(process.env.VIEWPORT_WIDTH || '1920');
    const viewportHeight = parseInt(process.env.VIEWPORT_HEIGHT || '1080');

    // Common launch arguments (optional, can be empty)
    const launchArgs = [
        '--disable-blink-features=AutomationControlled',
        '--disable-notifications',
        '--disable-popup-blocking',
        '--start-maximized'
    ];

    switch (browserType.toLowerCase()) {
        case 'firefox':
            this.browser = await firefox.launch({
                headless: headless,
                args: launchArgs
            });
            break;
        case 'webkit':
            this.browser = await webkit.launch({
                headless: headless,
                args: launchArgs
            });
            break;
        case 'chromium':
        default:
            this.browser = await chromium.launch({
                headless: headless,
                args: launchArgs,
                devtools: false  // Set to true to open DevTools
            });
            break;
    }

    this.context = await this.browser.newContext({
        viewport: { width: viewportWidth, height: viewportHeight }
    });
    this.page = await this.context.newPage();
    this.pageFixtures = new PageFixtures(this.page);
}
```

---

## Part 5: Environment Variable Approach (Better!)

### **Why This is Better:**

Instead of hardcoding arguments, load them from `.env` file!

**In your .env file:**

```env
# Browser arguments (comma-separated)
BROWSER_ARGS=--disable-blink-features=AutomationControlled,--disable-notifications,--disable-popup-blocking,--start-maximized
```

**In world.ts:**

```typescript
async init(): Promise<void> {
    const browserType = process.env.BROWSER || 'chromium';
    const headless = process.env.HEADLESS === 'true';
    
    // Get launch arguments from environment
    const browserArgsEnv = process.env.BROWSER_ARGS || '';
    const launchArgs = browserArgsEnv
        ? browserArgsEnv.split(',').map(arg => arg.trim())
        : [];  // Empty if not set

    switch (browserType.toLowerCase()) {
        case 'firefox':
            this.browser = await firefox.launch({
                headless: headless,
                args: launchArgs
            });
            break;
        case 'webkit':
            this.browser = await webkit.launch({
                headless: headless,
                args: launchArgs
            });
            break;
        case 'chromium':
        default:
            this.browser = await chromium.launch({
                headless: headless,
                args: launchArgs
            });
            break;
    }

    this.context = await this.browser.newContext({
        viewport: { width: viewportWidth, height: viewportHeight }
    });
    this.page = await this.context.newPage();
    this.pageFixtures = new PageFixtures(this.page);
}
```

---

## Part 6: Helper Function Approach (Best!)

### **Create a utility function to manage launch arguments**

**File: utils/browserLauncher.ts** (NEW FILE)

```typescript
import { chromium, firefox, webkit, Browser } from 'playwright';

export interface BrowserLaunchConfig {
    browserType: 'chromium' | 'firefox' | 'webkit';
    headless: boolean;
    args?: string[];
    devtools?: boolean;
    timeout?: number;
}

/**
 * Launch browser with arguments
 */
export async function launchBrowser(config: BrowserLaunchConfig): Promise<Browser> {
    const { browserType, headless, args = [], devtools = false, timeout = 30000 } = config;

    // Common arguments for all browsers
    const commonArgs = [
        '--disable-blink-features=AutomationControlled',
        '--disable-notifications',
        '--disable-popup-blocking'
    ];

    // Merge with custom args
    const allArgs = [...commonArgs, ...args];

    switch (browserType.toLowerCase()) {
        case 'firefox':
            return await firefox.launch({
                headless,
                args: allArgs,
                timeout
            });

        case 'webkit':
            return await webkit.launch({
                headless,
                args: allArgs,
                timeout
            });

        case 'chromium':
        default:
            return await chromium.launch({
                headless,
                args: allArgs,
                devtools,
                timeout
            });
    }
}

/**
 * Get launch arguments from environment or use defaults
 */
export function getLaunchArgs(): string[] {
    const envArgs = process.env.BROWSER_ARGS || '';
    
    if (envArgs) {
        return envArgs.split(',').map(arg => arg.trim());
    }
    
    // Default arguments if none specified
    return [
        '--disable-blink-features=AutomationControlled',
        '--disable-notifications',
        '--disable-popup-blocking'
    ];
}
```

### **Update world.ts to use the helper:**

```typescript
import { launchBrowser, getLaunchArgs } from '../../utils/browserLauncher';

export class CustomWorld extends World {
    // ... other properties ...

    async init(): Promise<void> {
        const browserType = process.env.BROWSER || 'chromium';
        const headless = process.env.HEADLESS === 'true';
        const viewportWidth = parseInt(process.env.VIEWPORT_WIDTH || '1920');
        const viewportHeight = parseInt(process.env.VIEWPORT_HEIGHT || '1080');
        const devtools = process.env.DEVTOOLS === 'true';

        // Get launch arguments
        const launchArgs = getLaunchArgs();

        // Launch browser using helper
        this.browser = await launchBrowser({
            browserType: browserType as 'chromium' | 'firefox' | 'webkit',
            headless,
            args: launchArgs,
            devtools,
            timeout: 30000
        });

        this.context = await this.browser.newContext({
            viewport: { width: viewportWidth, height: viewportHeight }
        });
        this.page = await this.context.newPage();
        this.pageFixtures = new PageFixtures(this.page);
    }
}
```

---

## Part 7: Real-World Use Cases

### **Use Case 1: Hide Automation Indicators**

```typescript
const args = [
    '--disable-blink-features=AutomationControlled'  // Hide that browser is automated
];

this.browser = await chromium.launch({
    args: args
});
```

**Why?** Some websites detect automated browsers and block them.

---

### **Use Case 2: Run in Maximized Window**

```typescript
const args = [
    '--start-maximized'  // Start with maximized window
];

this.browser = await chromium.launch({
    args: args
});
```

---

### **Use Case 3: Disable Notifications & Popups**

```typescript
const args = [
    '--disable-notifications',      // No notification popups
    '--disable-popup-blocking',     // Allow popups (don't block them)
    '--disable-extensions'          // No extensions
];

this.browser = await chromium.launch({
    args: args
});
```

---

### **Use Case 4: Enable Remote Debugging**

```typescript
const args = [
    '--remote-debugging-port=9222'  // Debug on port 9222
];

this.browser = await chromium.launch({
    args: args,
    devtools: true  // Also open DevTools
});
```

**Then access:** `chrome://inspect` to see remote instances.

---

### **Use Case 5: Use Custom Profile**

```typescript
const args = [
    `--user-data-dir=C:\\Users\\Profile\\AppData\\Local\\Google\\Chrome\\User Data`
];

this.browser = await chromium.launch({
    args: args
});
```

---

### **Use Case 6: Set Proxy**

```typescript
const args = [
    '--proxy-server=http://proxy.company.com:8080'
];

this.browser = await chromium.launch({
    args: args
});
```

---

## Part 8: Complete .env Configuration

### **Enhanced .env file with all browser options**

```env
# Browser type
BROWSER=chromium

# Headless mode
HEADLESS=true

# DevTools
DEVTOOLS=false

# Viewport
VIEWPORT_WIDTH=1920
VIEWPORT_HEIGHT=1080

# Launch arguments (comma-separated)
BROWSER_ARGS=--disable-blink-features=AutomationControlled,--disable-notifications,--disable-popup-blocking,--start-maximized

# Optional: Proxy
# BROWSER_ARGS=--proxy-server=http://proxy.company.com:8080

# Optional: Remote debugging
# BROWSER_ARGS=--remote-debugging-port=9222

# Optional: Custom profile (Windows)
# BROWSER_ARGS=--user-data-dir=C:\\Users\\Profile\\AppData\\Local\\Google\\Chrome\\User Data

# Optional: Custom profile (Mac)
# BROWSER_ARGS=--user-data-dir=/Users/username/Library/Application Support/Google/Chrome

# Optional: Custom profile (Linux)
# BROWSER_ARGS=--user-data-dir=/home/username/.config/google-chrome

# Timeout (milliseconds)
TIMEOUT=30000
```

---

## Part 9: Running with Different Arguments

### **Command Line Examples**

**Run with default arguments:**

```bash
npm run test
```

**Run with custom arguments:**

```bash
$env:BROWSER_ARGS='--disable-extensions,--disable-sync'; npm run test
```

**Run with proxy:**

```bash
$env:BROWSER_ARGS='--proxy-server=http://proxy.example.com:8080'; npm run test
```

**Run with remote debugging:**

```bash
$env:BROWSER_ARGS='--remote-debugging-port=9222'; npm run test
```

**Run headless with DevTools:**

```bash
$env:HEADLESS='true'; $env:DEVTOOLS='true'; npm run test
```

---

## Part 10: Firefox & WebKit Specific Arguments

### **Firefox Launch Arguments**

```typescript
const firefoxConfig = {
    headless: true,
    args: [
        '-width=1920',      // Width
        '-height=1080'      // Height
    ]
};

// Firefox uses preferences instead of args
const firefoxPrefs = {
    'browser.startup.homepage': 'about:blank',
    'browser.startup.page': 0,
    'dom.disable_beforeunload': true,
    'network.cookie.cookieBehavior': 0
};

this.browser = await firefox.launch(firefoxConfig);
```

### **WebKit Launch Arguments**

```typescript
const webkitConfig = {
    headless: true,
    args: [
        // WebKit has limited args support
        '--enable-automation'
    ]
};

this.browser = await webkit.launch(webkitConfig);
```

---

## Part 11: Summary Table

| Aspect | Details |
|--------|---------|
| **How to add arguments** | Pass `args` array to `.launch()` method |
| **Where to configure** | In `.env` file as `BROWSER_ARGS` (recommended) |
| **Browser types** | chromium, firefox, webkit |
| **Common arguments** | `--disable-blink-features`, `--disable-notifications`, `--start-maximized` |
| **Environment variable** | `BROWSER_ARGS` (comma-separated string) |
| **Devtools** | Set `DEVTOOLS=true` to open DevTools |
| **Proxy** | Use `--proxy-server=url` argument |
| **Profile** | Use `--user-data-dir=/path` argument |

---

## Conclusion

### **To Add Browser Launch Arguments:**

**Option 1: Direct in code (Simple)**

```typescript
this.browser = await chromium.launch({
    headless: true,
    args: ['--disable-notifications', '--start-maximized']
});
```

**Option 2: From environment (Recommended)**

```env
BROWSER_ARGS=--disable-notifications,--start-maximized
```

**Option 3: Helper function (Best - Scalable)**

Create `utils/browserLauncher.ts` with `launchBrowser()` function and use it in `world.ts`.

---

## Quick Reference - All Available Options

```typescript
await chromium.launch({
    // Boolean options
    headless: true,              // Hide UI
    devtools: false,             // Open DevTools
    
    // Array of strings
    args: [
        '--arg1',
        '--arg2'
    ],
    
    // String - path to executable
    executablePath: '/path/to/chromium',
    
    // Number - timeout in ms
    timeout: 30000,
    
    // Object - environment variables
    env: {
        VAR_NAME: 'value'
    },
    
    // String - dump IO to process stderr/stdout
    dumpio: false,
    
    // Object - Firefox specific preferences
    firefoxUserPrefs: {
        'pref.name': 'value'
    },
    
    // Logger object
    logger: {
        isEnabled: (name, severity) => true,
        log: (name, severity, message, args) => {}
    },
    
    // Function - handle signals
    handleSIGTERM: true,
    handleSIGHUP: true,
    handleSIGINT: true
});
```
