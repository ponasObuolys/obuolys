#!/usr/bin/env node

import { execSync } from "child_process";
import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, "..");

console.log("🚀 Setting up development environment...\n");

// Color codes for console output
const colors = {
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  blue: "\x1b[34m",
  reset: "\x1b[0m",
};

const log = {
  success: msg => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  warning: msg => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  error: msg => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  info: msg => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
};

function runCommand(command, description) {
  try {
    log.info(`Running: ${description}`);
    execSync(command, {
      stdio: "inherit",
      cwd: projectRoot,
      encoding: "utf8",
    });
    log.success(`Completed: ${description}`);
    return true;
  } catch (error) {
    log.error(`Failed: ${description}`);
    console.error(error.message);
    return false;
  }
}

function checkFile(filePath, description) {
  const fullPath = join(projectRoot, filePath);
  if (existsSync(fullPath)) {
    log.success(`Found: ${description}`);
    return true;
  } else {
    log.warning(`Missing: ${description}`);
    return false;
  }
}

function checkNodeVersion() {
  const nodeVersion = process.version;
  const majorVersion = parseInt(nodeVersion.slice(1).split(".")[0]);

  log.info(`Node.js version: ${nodeVersion}`);

  if (majorVersion >= 18) {
    log.success("Node.js version is compatible");
    return true;
  } else {
    log.error("Node.js version 18+ required");
    return false;
  }
}

function checkPackageJson() {
  try {
    const packageJson = JSON.parse(readFileSync(join(projectRoot, "package.json"), "utf8"));
    log.success("package.json is valid JSON");

    // Check for required scripts
    const requiredScripts = [
      "dev",
      "build",
      "lint",
      "type-check",
      "test",
      "quality-check",
      "pre-commit",
    ];

    const missingScripts = requiredScripts.filter(script => !packageJson.scripts[script]);

    if (missingScripts.length === 0) {
      log.success("All required scripts are present");
      return true;
    } else {
      log.warning(`Missing scripts: ${missingScripts.join(", ")}`);
      return false;
    }
  } catch (error) {
    log.error("Invalid package.json");
    return false;
  }
}

function checkEnvironmentFiles() {
  let hasValidEnv = true;

  if (!checkFile(".env.example", "Environment example file")) {
    hasValidEnv = false;
  }

  if (!checkFile(".env", "Environment file")) {
    log.warning("No .env file found. Copy .env.example to .env and configure it.");
    hasValidEnv = false;
  }

  return hasValidEnv;
}

function checkGitSetup() {
  try {
    execSync("git --version", { stdio: "pipe" });
    log.success("Git is installed");

    try {
      execSync("git rev-parse --git-dir", { cwd: projectRoot, stdio: "pipe" });
      log.success("Git repository initialized");

      // Check if husky is set up
      if (checkFile(".husky/pre-commit", "Husky pre-commit hook")) {
        log.success("Git hooks configured");
      } else {
        log.warning("Git hooks not configured");
      }

      return true;
    } catch {
      log.warning("Not a git repository");
      return false;
    }
  } catch {
    log.error("Git not found");
    return false;
  }
}

function checkSupabaseSetup() {
  let supabaseOk = true;

  if (!checkFile("supabase/config.toml", "Supabase configuration")) {
    supabaseOk = false;
  }

  try {
    execSync("supabase --version", { stdio: "pipe" });
    log.success("Supabase CLI installed");
  } catch {
    log.warning("Supabase CLI not found. Install with: npm i -g supabase");
    supabaseOk = false;
  }

  return supabaseOk;
}

async function main() {
  console.log("🔍 Checking development environment...\n");

  let allChecksPass = true;

  // System checks
  allChecksPass &= checkNodeVersion();
  allChecksPass &= checkPackageJson();
  allChecksPass &= checkEnvironmentFiles();
  allChecksPass &= checkGitSetup();
  allChecksPass &= checkSupabaseSetup();

  console.log("\n📦 Installing dependencies...");
  allChecksPass &= runCommand("npm install", "Installing npm dependencies");

  console.log("\n🔧 Setting up development tools...");

  // Create Prettier config if it doesn't exist
  if (!checkFile(".prettierrc", "Prettier configuration")) {
    log.info("Creating Prettier configuration...");
    try {
      const prettierConfig = {
        semi: true,
        trailingComma: "es5",
        singleQuote: false,
        printWidth: 100,
        tabWidth: 2,
        useTabs: false,
        endOfLine: "lf",
      };

      await import("fs").then(fs => {
        fs.writeFileSync(join(projectRoot, ".prettierrc"), JSON.stringify(prettierConfig, null, 2));
      });

      log.success("Created Prettier configuration");
    } catch (error) {
      log.warning("Could not create Prettier configuration");
    }
  }

  // Validate TypeScript configuration
  allChecksPass &= runCommand("npm run type-check", "TypeScript type checking");

  // Validate linting
  console.log("\n🧹 Running quality checks...");
  allChecksPass &= runCommand("npm run lint", "ESLint validation");

  console.log("\n🧪 Running tests...");
  allChecksPass &= runCommand("npm run test:run", "Running unit tests");

  console.log("\n📊 Final setup report:");
  if (allChecksPass) {
    log.success("Development environment setup completed successfully!");
    log.info("You can now start development with: npm run dev");
  } else {
    log.warning("Setup completed with some issues. Please review the warnings above.");
  }

  console.log("\n🔗 Useful commands:");
  console.log("  npm run dev              - Start development server");
  console.log("  npm run dev:open         - Start dev server and open browser");
  console.log("  npm run build:prod       - Production build with quality checks");
  console.log("  npm run quality-check    - Run all quality checks");
  console.log("  npm run quality-fix      - Fix auto-fixable issues");
  console.log("  npm run test             - Run tests in watch mode");
  console.log("  npm run dev:validate     - Validate development environment");

  process.exit(allChecksPass ? 0 : 1);
}

main().catch(error => {
  log.error("Setup failed with error:");
  console.error(error);
  process.exit(1);
});
