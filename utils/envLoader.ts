import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

/**
 * Load environment variables from specific .env file based on ENVIRONMENT variable
 * 
 * Simple Logic:
 * 1. Read ENVIRONMENT variable (e.g., 'UAT', 'RSDEV1', 'QA', 'PROD')
 * 2. Look for [ENVIRONMENT].env file (e.g., uat.env, rsdev1.env)
 * 3. Load all variables from that file
 * 4. If no ENVIRONMENT set, use .env (default RSDEV1)
 * 
 * Usage:
 * $env:ENVIRONMENT = 'uat'; npm run test           → Loads uat.env
 * $env:ENVIRONMENT = 'rsdev1'; npm run test        → Loads rsdev1.env
 * npm run test                                       → Loads .env (RSDEV1 default)
 */
export function loadEnvironment(): void {
    let envName = 'RSDEV1'; // Default environment name
    let envFile = '.env';    // Default file
    
    // Check if ENVIRONMENT variable is passed
    if (process.env.ENVIRONMENT) {
        envName = process.env.ENVIRONMENT;
        // Convert to lowercase for filename: UAT → uat.env
        envFile = `${envName.toLowerCase()}.env`;
        console.log(`\n📋 Environment variable found: ENVIRONMENT = '${envName}'`);
        console.log(`📋 Looking for file: ${envFile}`);
    } else {
        console.log(`\n📋 No ENVIRONMENT variable set, using default: .env (RSDEV1)`);
    }
    
    // Get absolute path to .env file
    const envPath = path.resolve(process.cwd(), envFile);
    
    // Try to load the environment file
    if (!fs.existsSync(envPath)) {
        console.warn(`\n⚠️  File not found: ${envPath}`);
        
        // If specific file not found and it's not the default .env, fallback to .env
        if (envFile !== '.env') {
            const defaultPath = path.resolve(process.cwd(), '.env');
            if (fs.existsSync(defaultPath)) {
                console.warn(`⚠️  Falling back to default .env (RSDEV1)\n`);
                dotenv.config({ path: defaultPath });
                envName = 'RSDEV1';
            } else {
                throw new Error(`Neither ${envPath} nor default .env found!`);
            }
        } else {
            throw new Error(`Default .env file not found: ${envPath}`);
        }
    } else {
        // Successfully load the specific environment file
        dotenv.config({ path: envFile });
    }
    
    // Log loaded environment configuration
    console.log(`
    ╔════════════════════════════════════════════════════════════╗
    ║     ✅ ENVIRONMENT CONFIGURATION LOADED                      ║
    ╠════════════════════════════════════════════════════════════╣
    ║ Environment:     ${String(process.env.ENVIRONMENT || 'RSDEV1').padEnd(45)} ║
    ║ Base URL:        ${String(process.env.BASE_URL || 'Not set').substring(0, 45).padEnd(45)} ║
    ║ API URL:         ${String(process.env.API_URL || 'Not set').substring(0, 45).padEnd(45)} ║
    ║ Browser:         ${String(process.env.BROWSER || 'chromium').padEnd(45)} ║
    ║ Headless:        ${String(process.env.HEADLESS || 'false').padEnd(45)} ║
    ║ Timeout:         ${String(process.env.TIMEOUT || '30000').padEnd(45)} ║
    ╚════════════════════════════════════════════════════════════╝
    `);
}

/**
 * Get environment variable with type safety
 * Throws error if variable not found and no default provided
 */
export function getEnvVar(key: string, defaultValue?: string): string {
    const value = process.env[key];
    if (!value && !defaultValue) {
        throw new Error(`Environment variable ${key} not found and no default provided`);
    }
    return value || defaultValue || '';
}

/**
 * Get all loaded environment variables as object
 */
export function getAllEnvVars(): { [key: string]: string } {
    return {
        ENVIRONMENT: process.env.ENVIRONMENT || 'RSDEV1',
        BASE_URL: process.env.BASE_URL || '',
        API_URL: process.env.API_URL || '',
        USER_EMAIL: process.env.USER_EMAIL || '',
        USER_PASSWORD: process.env.USER_PASSWORD || '',
        BROWSER: process.env.BROWSER || 'chromium',
        HEADLESS: process.env.HEADLESS || 'false',
        VIEWPORT_WIDTH: process.env.VIEWPORT_WIDTH || '1280',
        VIEWPORT_HEIGHT: process.env.VIEWPORT_HEIGHT || '720',
        TIMEOUT: process.env.TIMEOUT || '30000',
        SCREENSHOT_PATH: process.env.SCREENSHOT_PATH || './reports/screenshots/',
        TRACE_PATH: process.env.TRACE_PATH || './reports/traces/',
        LOG_LEVEL: process.env.LOG_LEVEL || 'info'
    };
}
