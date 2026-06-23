# Where is Browser Initialized? - Complete Explanation

## Quick Answer

**Browser is initialized in:**

| Aspect | Details |
|--------|---------|
| **File** | `features/hooks/world.ts` |
| **Class** | `CustomWorld` |
| **Method** | `async init()` |
| **Lines** | 38-56 |

---

## Part 1: The File and Method

### **File: features/hooks/world.ts**

```typescript
export class CustomWorld extends World {
    page!: Page;
    browser!: Browser;
    context!: BrowserContext;
    pageFixtures!: PageFixtures;

    async init(): Promise<void> {  // ← BROWSER INITIALIZED HERE
        const browserType = process.env.BROWSER || 'chromium';
        const headless = process.env.HEADLESS === 'true';
        const viewportWidth = parseInt(process.env.VIEWPORT_WIDTH || '1920');
        const viewportHeight = parseInt(process.env.VIEWPORT_HEIGHT || '1080');

        // Step 1: Launch browser based on type
        switch (browserType.toLowerCase()) {
            case 'firefox':
                this.browser = await firefox.launch({ headless: headless });  // ← Firefox
                break;
            case 'webkit':
                this.browser = await webkit.launch({ headless: headless });   // ← Safari
                break;
            case 'chromium':
            default:
                this.browser = await chromium.launch({ headless: headless }); // ← Chrome
                break;
        }
        
        // Step 2: Create browser context
        this.context = await this.browser.newContext({
            viewport: { width: viewportWidth, height: viewportHeight }
        });
        
        // Step 3: Create page in context
        this.page = await this.context.newPage();
        
        // Step 4: Initialize page objects
        this.pageFixtures = new PageFixtures(this.page);
    }
}
```

---

## Part 2: When is init() Called?

### **Timeline: Browser Initialization**

```
npm run test
    ↓

Cucumber starts scenario
    ↓

Constructor runs (loads environment, credentials)
    ↓

BEFORE HOOK triggered:
    Before(async function (this: CustomWorld) {
        console.log(`###### Before hook executed ######`);
        await this.init();  ← BROWSER INITIALIZED HERE!
        await this.context.tracing.start({ screenshots: true, snapshots: true });
    })
    ↓

Steps run (page is now ready)
    ↓

AFTER HOOK triggered:
    After(async function (this: CustomWorld, scenario) {
        // Close browser
        await this.close();
    })
```

---

## Part 3: Browser Launch Options

### **From environment variables:**

```typescript
async init(): Promise<void> {
    const browserType = process.env.BROWSER || 'chromium';
    //                  ↑
    //     From .env file or environment variable
    
    const headless = process.env.HEADLESS === 'true';
    //                ↑
    //     From .env file: HEADLESS=true or false
    
    const viewportWidth = parseInt(process.env.VIEWPORT_WIDTH || '1920');
    //                    ↑
    //     From .env file: VIEWPORT_WIDTH=1920
    
    const viewportHeight = parseInt(process.env.VIEWPORT_HEIGHT || '1080');
    //                     ↑
    //     From .env file: VIEWPORT_HEIGHT=1080
}
```

### **Browser Types Available:**

```typescript
switch (browserType.toLowerCase()) {
    case 'firefox':
        this.browser = await firefox.launch({ headless: headless });
        // ✓ Mozilla Firefox
        break;
        
    case 'webkit':
        this.browser = await webkit.launch({ headless: headless });
        // ✓ Safari (WebKit engine)
        break;
        
    case 'chromium':
    default:
        this.browser = await chromium.launch({ headless: headless });
        // ✓ Chrome/Chromium (default)
        break;
}
```

---

## Part 4: Step-by-Step Browser Initialization

### **What Happens in init()**

```
Step 1: Launch Browser Instance
    ↓
    this.browser = await chromium.launch({ headless: true });
    
    Creates:
    ├─ Browser process (actual Chromium/Firefox/Safari)
    ├─ Browser connection (communication channel)
    └─ Browser instance object
    
    Result: this.browser = Browser object ✓

Step 2: Create Browser Context
    ↓
    this.context = await this.browser.newContext({
        viewport: { width: 1920, height: 1080 }
    });
    
    Creates:
    ├─ Isolated browser context (like incognito window)
    ├─ Storage isolation
    ├─ Cookie isolation
    └─ With specified viewport size
    
    Result: this.context = BrowserContext object ✓

Step 3: Create Page
    ↓
    this.page = await this.context.newPage();
    
    Creates:
    ├─ New page (tab) in the context
    ├─ Isolated from other pages
    ├─ Ready for navigation and interaction
    └─ Available for test steps
    
    Result: this.page = Page object ✓

Step 4: Initialize Page Objects
    ↓
    this.pageFixtures = new PageFixtures(this.page);
    
    Creates:
    ├─ PageFixtures instance with reference to page
    ├─ Wraps page interactions
    └─ Ready for step definitions to use
    
    Result: this.pageFixtures = PageFixtures object ✓
```

---

## Part 5: Code Flow Diagram

### **From Start to Browser Ready**

```
BEFORE HOOK
    ↓
    Before(async function (this: CustomWorld) { ... })
    ↓

Calls: await this.init()
    ↓

init() starts:
    ├─ Read BROWSER env var (default: 'chromium')
    ├─ Read HEADLESS env var (default: 'false')
    ├─ Read VIEWPORT_WIDTH env var (default: '1920')
    ├─ Read VIEWPORT_HEIGHT env var (default: '1080')
    └─ ↓
    
Switch browser type:
    ├─ 'firefox' → firefox.launch()
    ├─ 'webkit' → webkit.launch()
    └─ 'chromium' → chromium.launch()  ← Most common
    ↓
    
this.browser assigned ✓
    ↓

Create context:
    ├─ this.browser.newContext()
    ├─ Set viewport size
    └─ this.context assigned ✓
    ↓

Create page:
    ├─ this.context.newPage()
    ├─ Page ready for navigation
    └─ this.page assigned ✓
    ↓

Initialize fixtures:
    ├─ new PageFixtures(this.page)
    └─ this.pageFixtures assigned ✓
    ↓

init() complete!
    ↓

BEFORE HOOK continues:
    ├─ Start tracing (screenshots, snapshots)
    └─ ↓
    
STEPS CAN NOW RUN ✓
```

---

## Part 6: Environment Variables That Control Browser

### **.env file controls browser initialization:**

```env
# Browser Type (chromium, firefox, webkit)
BROWSER=chromium

# Headless mode (true or false)
HEADLESS=true

# Viewport size
VIEWPORT_WIDTH=1920
VIEWPORT_HEIGHT=1080

# Timeout for operations
TIMEOUT=30000

# Paths for screenshots and traces
SCREENSHOT_PATH=./reports/screenshots/
TRACE_PATH=./reports/traces/
```

### **Example: Run with Firefox in headless mode**

```bash
# Create firefox.env
BROWSER=firefox
HEADLESS=true
VIEWPORT_WIDTH=1280
VIEWPORT_HEIGHT=720

# Then run:
$env:ENVIRONMENT = 'firefox'; npm run test
```

---

## Part 7: Browser Object Hierarchy

### **What Gets Created:**

```
Browser (chromium, firefox, or webkit process)
    ↓
    BrowserContext (isolated session, like incognito)
        ↓
        Page (tab in the context)
            ↓
            Can now:
            ├─ Navigate to URLs
            ├─ Click elements
            ├─ Fill forms
            ├─ Take screenshots
            ├─ Record traces
            └─ Run assertions
```

### **In Your Code:**

```typescript
this.browser = await chromium.launch({ headless: true });
//   ↑ Browser object (process)

this.context = await this.browser.newContext({ viewport: {...} });
//   ↑ BrowserContext object (isolated session)

this.page = await this.context.newPage();
//   ↑ Page object (tab ready to use)
```

---

## Part 8: Where Browser is Closed

### **Browser Lifecycle:**

```
Initialized in:  async init()        (BEFORE hook)
    ↓ ↓ ↓
Used in:         Step definitions    (Given, When, Then)
    ↓ ↓ ↓
Closed in:       async close()       (AFTER hook)
```

### **close() Method - In same world.ts file:**

```typescript
async close(): Promise<void> {
    await this.page.close();
    await this.context?.close();
    await this.browser.close();
}
```

**Called from AFTER hook:**

```typescript
After(async function (this: CustomWorld, scenario) {
    // ... handle traces and screenshots ...
    await this.close();  // ← Browser closed here
});
```

---

## Part 9: Complete Lifecycle

### **Browser Lifecycle from Test Start to End**

```
TEST STARTS
    ↓

Constructor:
    ├─ loadEnvironment()  (loads .env file)
    ├─ Load credentials
    └─ Load user data
    ↓

BEFORE HOOK:
    ├─ await this.init()
    │  ├─ this.browser = await chromium.launch()
    │  ├─ this.context = await this.browser.newContext()
    │  ├─ this.page = await this.context.newPage()
    │  └─ this.pageFixtures = new PageFixtures(this.page)
    │
    └─ Start tracing
    ↓

STEP 1 (Given):
    ├─ Uses this.page to navigate
    └─ Browser ready
    ↓

STEP 2 (When):
    ├─ Uses this.page to interact
    └─ Browser ready
    ↓

STEP 3 (Then):
    ├─ Uses this.page to assert
    └─ Browser ready
    ↓

AFTER HOOK:
    ├─ Stop tracing
    ├─ Save screenshots if failed
    ├─ await this.close()
    │  ├─ this.page.close()
    │  ├─ this.context.close()
    │  └─ this.browser.close()  ← Browser process stopped
    │
    └─ Resources cleaned up
    ↓

TEST ENDS
```

---

## Part 10: Why Separate init() from Constructor?

### **Why Not Initialize Browser in Constructor?**

```typescript
// ❌ BAD: In constructor
constructor(options: IWorldOptions) {
    super(options);
    this.browser = await chromium.launch();  // ❌ Constructor can't be async!
    this.page = await this.context.newPage();
}

// Problem: Constructors cannot be async!
// This code won't compile!
```

### **✓ GOOD: In async init() called from BEFORE hook**

```typescript
constructor(options: IWorldOptions) {
    super(options);
    loadEnvironment();
    // Just load data (synchronous)
}

async init(): Promise<void> {
    // ✓ Can use async/await here!
    this.browser = await chromium.launch();
    this.page = await this.context.newPage();
}
```

**Called from BEFORE hook:**

```typescript
Before(async function (this: CustomWorld) {
    await this.init();  // ← Async method called here
});
```

---

## Part 11: Summary

### **Browser Initialization - Quick Reference**

| Aspect | Details |
|--------|---------|
| **File** | `features/hooks/world.ts` |
| **Class** | `CustomWorld` |
| **Method** | `async init(): Promise<void>` |
| **Called From** | `BEFORE` hook in `features/hooks/hooks.ts` |
| **When** | Before each scenario (before steps run) |
| **What** | Launches browser, creates context, creates page |
| **Controlled By** | Environment variables in `.env` file |
| **Closed In** | `async close()` method in `AFTER` hook |

---

## Part 12: Quick Reference - Browser Initialization Code

### **The Complete init() Method**

```typescript
async init(): Promise<void> {
    // 1. Get browser type from environment
    const browserType = process.env.BROWSER || 'chromium';
    const headless = process.env.HEADLESS === 'true';
    const viewportWidth = parseInt(process.env.VIEWPORT_WIDTH || '1920');
    const viewportHeight = parseInt(process.env.VIEWPORT_HEIGHT || '1080');

    // 2. Launch browser
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
    
    // 3. Create context with viewport
    this.context = await this.browser.newContext({
        viewport: { width: viewportWidth, height: viewportHeight }
    });
    
    // 4. Create page
    this.page = await this.context.newPage();
    
    // 5. Initialize page objects
    this.pageFixtures = new PageFixtures(this.page);
}
```

### **How to Call It**

```typescript
// From BEFORE hook:
Before(async function (this: CustomWorld) {
    await this.init();  // ← Initializes browser here
});
```

---

## Conclusion

**Browser is initialized in:**

```
File:   features/hooks/world.ts
Class:  CustomWorld
Method: async init()
Called: From BEFORE hook (before each scenario)
```

**Steps:**
1. ✓ Launch browser (chromium/firefox/webkit)
2. ✓ Create browser context (isolated session)
3. ✓ Create page (tab)
4. ✓ Initialize page fixtures
5. ✓ Ready for test steps!
