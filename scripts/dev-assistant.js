#!/usr/bin/env node

import { execSync } from "child_process";
import { existsSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, "..");

// Color codes for console output
const colors = {
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
  magenta: "\x1b[35m",
  gray: "\x1b[90m",
  reset: "\x1b[0m",
  bold: "\x1b[1m",
};

const log = {
  success: msg => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  warning: msg => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  error: msg => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  info: msg => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
  debug: msg => console.log(`${colors.magenta}🔍 ${msg}${colors.reset}`),
  header: msg => console.log(`${colors.cyan}${colors.bold}${msg}${colors.reset}`),
  detail: msg => console.log(`${colors.gray}   ${msg}${colors.reset}`),
  command: msg => console.log(`${colors.blue}  $ ${msg}${colors.reset}`),
};

class DevAssistant {
  constructor() {
    this.tasks = ["setup", "health", "quality", "test", "build", "deploy", "clean", "help"];
    this.quickFixes = [];
  }

  showBanner() {
    console.log(`
${colors.cyan}╭─────────────────────────────────────────────╮
│             🤖 Development Assistant         │
│         Obuolys.ai - Smart Dev Helper       │
╰─────────────────────────────────────────────╯${colors.reset}
`);
  }

  async analyzeProjectHealth() {
    log.header("🏥 Project Health Analysis");

    const checks = [
      { name: "Node.js Version", check: () => this.checkNodeVersion() },
      { name: "Dependencies", check: () => this.checkDependencies() },
      { name: "Environment", check: () => this.checkEnvironment() },
      { name: "Git Status", check: () => this.checkGitStatus() },
      { name: "Code Quality", check: () => this.checkCodeQuality() },
      { name: "Tests", check: () => this.checkTests() },
      { name: "Build", check: () => this.checkBuild() },
    ];

    const results = {};

    for (const check of checks) {
      try {
        results[check.name] = await check.check();
      } catch (error) {
        results[check.name] = { status: "error", message: error.message };
      }
    }

    this.generateHealthReport(results);
    return results;
  }

  checkNodeVersion() {
    const version = process.version;
    const majorVersion = parseInt(version.slice(1).split(".")[0]);

    if (majorVersion >= 18) {
      log.success(`Node.js ${version} - Compatible`);
      return { status: "good", message: `Node.js ${version}` };
    } else {
      log.error(`Node.js ${version} - Requires 18+`);
      this.quickFixes.push("Upgrade Node.js to version 18 or higher");
      return { status: "error", message: "Node.js version too old" };
    }
  }

  checkDependencies() {
    try {
      const packageLockPath = join(projectRoot, "package-lock.json");
      const nodeModulesPath = join(projectRoot, "node_modules");

      if (!existsSync(packageLockPath)) {
        log.warning("No package-lock.json found");
        this.quickFixes.push("Run: npm install");
        return { status: "warning", message: "Dependencies not locked" };
      }

      if (!existsSync(nodeModulesPath)) {
        log.warning("node_modules not found");
        this.quickFixes.push("Run: npm install");
        return { status: "warning", message: "Dependencies not installed" };
      }

      // Quick audit check
      try {
        execSync("npm audit --audit-level=moderate", { cwd: projectRoot, stdio: "pipe" });
        log.success("Dependencies - No vulnerabilities");
        return { status: "good", message: "All dependencies secure" };
      } catch (error) {
        log.warning("Dependencies - Vulnerabilities found");
        this.quickFixes.push("Run: npm audit fix");
        return { status: "warning", message: "Security vulnerabilities found" };
      }
    } catch (error) {
      log.error(`Dependencies check failed: ${error.message}`);
      return { status: "error", message: "Dependency check failed" };
    }
  }

  checkEnvironment() {
    const envPath = join(projectRoot, ".env");
    const envExamplePath = join(projectRoot, ".env.example");

    if (!existsSync(envExamplePath)) {
      log.warning("No .env.example found");
      return { status: "warning", message: "No environment template" };
    }

    if (!existsSync(envPath)) {
      log.warning("No .env file found");
      this.quickFixes.push("Copy .env.example to .env and configure");
      return { status: "warning", message: "Environment not configured" };
    }

    try {
      const envContent = readFileSync(envPath, "utf8");
      const requiredVars = ["VITE_SUPABASE_URL", "VITE_SUPABASE_ANON_KEY"];
      const missingVars = requiredVars.filter(varName => !envContent.includes(varName));

      if (missingVars.length > 0) {
        log.warning(`Missing environment variables: ${missingVars.join(", ")}`);
        this.quickFixes.push("Configure missing environment variables");
        return { status: "warning", message: `Missing: ${missingVars.join(", ")}` };
      }

      log.success("Environment - Configured");
      return { status: "good", message: "Environment properly configured" };
    } catch (error) {
      log.error("Environment check failed");
      return { status: "error", message: "Environment check failed" };
    }
  }

  checkGitStatus() {
    try {
      const status = execSync("git status --porcelain", {
        cwd: projectRoot,
        encoding: "utf8",
      }).trim();

      if (status === "") {
        log.success("Git - Clean working directory");
        return { status: "good", message: "Clean working directory" };
      } else {
        const changes = status.split("\n").length;
        log.info(`Git - ${changes} uncommitted changes`);
        return { status: "info", message: `${changes} uncommitted changes` };
      }
    } catch (error) {
      log.warning("Git status check failed");
      return { status: "warning", message: "Git status unavailable" };
    }
  }

  async checkCodeQuality() {
    try {
      // Quick lint check
      execSync("npm run lint", { cwd: projectRoot, stdio: "pipe" });

      // Quick type check
      execSync("npm run type-check", { cwd: projectRoot, stdio: "pipe" });

      log.success("Code Quality - All checks pass");
      return { status: "good", message: "No linting or type errors" };
    } catch (error) {
      log.warning("Code Quality - Issues found");
      this.quickFixes.push("Run: npm run quality-fix");
      return { status: "warning", message: "Code quality issues found" };
    }
  }

  async checkTests() {
    try {
      execSync("npm run test:run", { cwd: projectRoot, stdio: "pipe" });
      log.success("Tests - All passing");
      return { status: "good", message: "All tests passing" };
    } catch (error) {
      log.warning("Tests - Some failing");
      this.quickFixes.push("Run: npm run test:watch to debug failing tests");
      return { status: "warning", message: "Some tests failing" };
    }
  }

  checkBuild() {
    try {
      execSync("npm run build", { cwd: projectRoot, stdio: "pipe" });
      log.success("Build - Successful");
      return { status: "good", message: "Build successful" };
    } catch (error) {
      log.error("Build - Failed");
      this.quickFixes.push("Check build errors with: npm run build");
      return { status: "error", message: "Build failed" };
    }
  }

  generateHealthReport(results) {
    console.log(`\n${colors.cyan}📊 Health Report Summary${colors.reset}`);
    console.log("=".repeat(50));

    let healthScore = 0;
    const totalChecks = Object.keys(results).length;

    Object.entries(results).forEach(([name, result]) => {
      const statusIcon =
        result.status === "good"
          ? "✅"
          : result.status === "warning"
            ? "⚠️"
            : result.status === "info"
              ? "ℹ️"
              : "❌";

      const statusColor =
        result.status === "good"
          ? colors.green
          : result.status === "warning"
            ? colors.yellow
            : result.status === "info"
              ? colors.blue
              : colors.red;

      console.log(
        `${name.padEnd(20)} ${statusIcon} ${statusColor}${result.message}${colors.reset}`
      );

      if (result.status === "good") healthScore++;
      else if (result.status === "info") healthScore += 0.5;
    });

    console.log("=".repeat(50));

    const scorePercent = Math.round((healthScore / totalChecks) * 100);
    const scoreColor =
      scorePercent >= 80 ? colors.green : scorePercent >= 60 ? colors.yellow : colors.red;

    console.log(
      `Health Score: ${scoreColor}${scorePercent}%${colors.reset} (${healthScore}/${totalChecks})`
    );

    if (this.quickFixes.length > 0) {
      console.log(`\n${colors.blue}🔧 Quick Fixes:${colors.reset}`);
      this.quickFixes.forEach((fix, i) => {
        console.log(`${i + 1}. ${fix}`);
      });
    }
  }

  async smartSetup() {
    log.header("🚀 Smart Development Setup");

    const setupTasks = [
      {
        name: "Install Dependencies",
        command: "npm install",
        condition: () => !existsSync(join(projectRoot, "node_modules")),
      },
      {
        name: "Setup Git Hooks",
        command: "npx husky init",
        condition: () => !existsSync(join(projectRoot, ".husky")),
      },
      {
        name: "Environment Setup",
        action: () => this.setupEnvironment(),
        condition: () => !existsSync(join(projectRoot, ".env")),
      },
      {
        name: "Initial Quality Check",
        command: "npm run quality-check",
        condition: () => true,
      },
    ];

    for (const task of setupTasks) {
      if (task.condition()) {
        try {
          log.info(`Running: ${task.name}`);
          if (task.command) {
            execSync(task.command, { cwd: projectRoot, stdio: "inherit" });
          } else if (task.action) {
            await task.action();
          }
          log.success(`Completed: ${task.name}`);
        } catch (error) {
          log.error(`Failed: ${task.name}`);
          console.error(error.message);
        }
      } else {
        log.info(`Skipped: ${task.name} (already configured)`);
      }
    }
  }

  setupEnvironment() {
    const envExamplePath = join(projectRoot, ".env.example");
    const envPath = join(projectRoot, ".env");

    if (existsSync(envExamplePath)) {
      const envExample = readFileSync(envExamplePath, "utf8");
      writeFileSync(envPath, envExample);
      log.success("Created .env from template");
      log.warning("Please configure your environment variables in .env");
    } else {
      log.warning("No .env.example found to copy from");
    }
  }

  showCommands() {
    log.header("🛠️  Available Commands");

    const commandCategories = {
      Development: [
        { cmd: "npm run dev", desc: "Start development server" },
        { cmd: "npm run dev:open", desc: "Start dev server and open browser" },
        { cmd: "npm run dev:host", desc: "Start dev server with network access" },
        { cmd: "npm run dev:debug", desc: "Start with debugging tools" },
      ],
      "Quality Assurance": [
        { cmd: "npm run quality-check", desc: "Run all quality checks" },
        { cmd: "npm run quality-fix", desc: "Fix auto-fixable issues" },
        { cmd: "npm run quality:comprehensive", desc: "Detailed quality analysis" },
      ],
      Testing: [
        { cmd: "npm run test", desc: "Interactive test runner" },
        { cmd: "npm run test:run", desc: "Run all tests once" },
        { cmd: "npm run test:coverage", desc: "Generate coverage report" },
        { cmd: "npm run test:e2e", desc: "End-to-end tests" },
      ],
      "Build & Deploy": [
        { cmd: "npm run build", desc: "Production build" },
        { cmd: "npm run build:prod", desc: "Build with quality checks" },
        { cmd: "npm run build:analyze", desc: "Build with bundle analysis" },
        { cmd: "npm run preview", desc: "Preview production build" },
      ],
      Utilities: [
        { cmd: "npm run dev-setup", desc: "Setup development environment" },
        { cmd: "npm run dev:validate", desc: "Validate development setup" },
        { cmd: "npm run clean", desc: "Clean build artifacts" },
        { cmd: "npm run clean:all", desc: "Clean everything and reinstall" },
      ],
    };

    Object.entries(commandCategories).forEach(([category, commands]) => {
      console.log(`\n${colors.cyan}${category}:${colors.reset}`);
      commands.forEach(({ cmd, desc }) => {
        console.log(`  ${colors.blue}${cmd.padEnd(35)}${colors.reset} ${desc}`);
      });
    });
  }

  async showQuickStart() {
    log.header("⚡ Quick Start Guide");

    console.log(`
${colors.green}1. First time setup:${colors.reset}
   ${colors.blue}npm run dev-setup${colors.reset}

${colors.green}2. Start development:${colors.reset}
   ${colors.blue}npm run dev${colors.reset}

${colors.green}3. Before committing:${colors.reset}
   ${colors.blue}npm run quality-check${colors.reset}

${colors.green}4. Build for production:${colors.reset}
   ${colors.blue}npm run build:prod${colors.reset}

${colors.yellow}💡 Pro Tips:${colors.reset}
• Use ${colors.blue}npm run dev:open${colors.reset} to auto-open browser
• Run ${colors.blue}npm run test:watch${colors.reset} during development
• Use ${colors.blue}npm run quality-fix${colors.reset} to auto-fix issues
• Check ${colors.blue}npm run dev:validate${colors.reset} if something breaks
`);
  }

  async interactiveMode() {
    const readline = await import("readline");
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    const question = prompt =>
      new Promise(resolve => {
        rl.question(prompt, resolve);
      });

    while (true) {
      console.log(`\n${colors.cyan}What would you like to do?${colors.reset}`);
      console.log("1. 🏥 Health Check");
      console.log("2. 🚀 Smart Setup");
      console.log("3. 🛠️  Show Commands");
      console.log("4. ⚡ Quick Start Guide");
      console.log("5. 🧹 Clean & Reset");
      console.log("6. 🚪 Exit");

      const choice = await question("\nEnter your choice (1-6): ");

      switch (choice) {
        case "1":
          await this.analyzeProjectHealth();
          break;
        case "2":
          await this.smartSetup();
          break;
        case "3":
          this.showCommands();
          break;
        case "4":
          await this.showQuickStart();
          break;
        case "5":
          await this.cleanAndReset();
          break;
        case "6":
          console.log(`\n${colors.green}Happy coding! 🚀${colors.reset}`);
          rl.close();
          return;
        default:
          log.warning("Invalid choice. Please select 1-6.");
      }
    }
  }

  async cleanAndReset() {
    log.header("🧹 Clean & Reset");

    const cleanTasks = [
      { name: "Clear build artifacts", command: "npm run clean" },
      { name: "Clear node_modules cache", command: "rm -rf node_modules/.cache" },
      { name: "Reinstall dependencies", command: "npm install" },
      { name: "Validate setup", command: "npm run dev:validate" },
    ];

    for (const task of cleanTasks) {
      try {
        log.info(`Running: ${task.name}`);
        execSync(task.command, { cwd: projectRoot, stdio: "inherit" });
        log.success(`Completed: ${task.name}`);
      } catch (error) {
        log.error(`Failed: ${task.name}`);
      }
    }
  }
}

async function main() {
  const assistant = new DevAssistant();
  const args = process.argv.slice(2);

  assistant.showBanner();

  if (args.length === 0) {
    await assistant.interactiveMode();
  } else {
    const command = args[0];

    switch (command) {
      case "health":
        await assistant.analyzeProjectHealth();
        break;
      case "setup":
        await assistant.smartSetup();
        break;
      case "commands":
        assistant.showCommands();
        break;
      case "quickstart":
        await assistant.showQuickStart();
        break;
      case "clean":
        await assistant.cleanAndReset();
        break;
      default:
        console.log(`Unknown command: ${command}`);
        console.log("Available commands: health, setup, commands, quickstart, clean");
    }
  }
}

main().catch(error => {
  console.error(`${colors.red}Assistant failed:${colors.reset}`, error);
  process.exit(1);
});
