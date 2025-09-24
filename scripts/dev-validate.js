#!/usr/bin/env node

import { execSync } from "child_process";
import { existsSync, readFileSync } from "fs";
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
  reset: "\x1b[0m",
};

const log = {
  success: msg => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  warning: msg => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  error: msg => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  info: msg => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
  header: msg => console.log(`${colors.cyan}🔍 ${msg}${colors.reset}`),
};

class DevEnvironmentValidator {
  constructor() {
    this.results = [];
  }

  addResult(category, check, passed, message, details = null) {
    this.results.push({
      category,
      check,
      passed,
      message,
      details,
    });

    if (passed) {
      log.success(message);
    } else {
      log.error(message);
    }

    if (details) {
      console.log(`   ${colors.blue}${details}${colors.reset}`);
    }
  }

  checkSystemRequirements() {
    log.header("System Requirements");

    // Node.js version
    const nodeVersion = process.version;
    const majorVersion = parseInt(nodeVersion.slice(1).split(".")[0]);
    this.addResult(
      "System",
      "Node.js Version",
      majorVersion >= 18,
      `Node.js ${nodeVersion} ${majorVersion >= 18 ? "(compatible)" : "(requires 18+)"}`,
      majorVersion < 18 ? "Please upgrade to Node.js 18 or higher" : null
    );

    // npm version
    try {
      const npmVersion = execSync("npm --version", { encoding: "utf8" }).trim();
      const npmMajor = parseInt(npmVersion.split(".")[0]);
      this.addResult(
        "System",
        "npm Version",
        npmMajor >= 8,
        `npm ${npmVersion} ${npmMajor >= 8 ? "(compatible)" : "(requires 8+)"}`
      );
    } catch (error) {
      this.addResult("System", "npm", false, "npm not found");
    }

    // Git
    try {
      const gitVersion = execSync("git --version", { encoding: "utf8" }).trim();
      this.addResult("System", "Git", true, `${gitVersion} (available)`);
    } catch (error) {
      this.addResult(
        "System",
        "Git",
        false,
        "Git not found",
        "Install Git to enable version control"
      );
    }

    // Operating System
    const os = process.platform;
    const arch = process.arch;
    this.addResult(
      "System",
      "Operating System",
      true,
      `${os} ${arch}`,
      os === "win32" ? "Windows detected - ensure proper shell configuration" : null
    );
  }

  checkProjectStructure() {
    log.header("Project Structure");

    const requiredFiles = [
      { path: "package.json", name: "Package Configuration" },
      { path: "tsconfig.json", name: "TypeScript Configuration" },
      { path: "eslint.config.js", name: "ESLint Configuration" },
      { path: "tailwind.config.ts", name: "Tailwind Configuration" },
      { path: "vite.config.ts", name: "Vite Configuration" },
      { path: ".env.example", name: "Environment Template" },
    ];

    requiredFiles.forEach(file => {
      const exists = existsSync(join(projectRoot, file.path));
      this.addResult("Project", file.name, exists, `${file.path} ${exists ? "found" : "missing"}`);
    });

    const requiredDirs = [
      { path: "src", name: "Source Directory" },
      { path: "src/components", name: "Components Directory" },
      { path: "src/pages", name: "Pages Directory" },
      { path: "src/hooks", name: "Hooks Directory" },
      { path: "src/context", name: "Context Directory" },
    ];

    requiredDirs.forEach(dir => {
      const exists = existsSync(join(projectRoot, dir.path));
      this.addResult("Project", dir.name, exists, `${dir.path} ${exists ? "found" : "missing"}`);
    });
  }

  checkDependencies() {
    log.header("Dependencies");

    try {
      // Check if node_modules exists
      const nodeModulesExists = existsSync(join(projectRoot, "node_modules"));
      this.addResult(
        "Dependencies",
        "Installed",
        nodeModulesExists,
        nodeModulesExists ? "Dependencies installed" : "Dependencies not installed",
        !nodeModulesExists ? "Run: npm install" : null
      );

      if (nodeModulesExists) {
        // Check package.json vs package-lock.json
        try {
          execSync("npm ls", { cwd: projectRoot, stdio: "pipe" });
          this.addResult("Dependencies", "Integrity", true, "Dependency tree is valid");
        } catch (error) {
          this.addResult(
            "Dependencies",
            "Integrity",
            false,
            "Dependency conflicts detected",
            "Run: npm install to resolve"
          );
        }

        // Check for critical dependencies
        const packageJson = JSON.parse(readFileSync(join(projectRoot, "package.json"), "utf8"));
        const criticalDeps = [
          "react",
          "vite",
          "@vitejs/plugin-react-swc",
          "typescript",
          "tailwindcss",
        ];

        criticalDeps.forEach(dep => {
          const hasProduction = packageJson.dependencies && packageJson.dependencies[dep];
          const hasDev = packageJson.devDependencies && packageJson.devDependencies[dep];
          const exists = hasProduction || hasDev;

          this.addResult(
            "Dependencies",
            `${dep}`,
            exists,
            `${dep} ${exists ? "installed" : "missing"}`
          );
        });
      }
    } catch (error) {
      this.addResult("Dependencies", "Check", false, "Failed to check dependencies");
    }
  }

  checkDevelopmentTools() {
    log.header("Development Tools");

    const tools = [
      {
        name: "TypeScript",
        command: "npx tsc --version",
        check: "TypeScript Compiler",
      },
      {
        name: "ESLint",
        command: "npx eslint --version",
        check: "ESLint Linter",
      },
      {
        name: "Prettier",
        command: "npx prettier --version",
        check: "Prettier Formatter",
      },
      {
        name: "Vite",
        command: "npx vite --version",
        check: "Vite Build Tool",
      },
    ];

    tools.forEach(tool => {
      try {
        const version = execSync(tool.command, {
          cwd: projectRoot,
          encoding: "utf8",
          stdio: "pipe",
        }).trim();

        this.addResult("Tools", tool.check, true, `${tool.name} ${version} (available)`);
      } catch (error) {
        this.addResult(
          "Tools",
          tool.check,
          false,
          `${tool.name} not available`,
          "Check if dependencies are installed"
        );
      }
    });

    // Check for optional tools
    const optionalTools = [
      { command: "supabase --version", name: "Supabase CLI" },
      { command: "gh --version", name: "GitHub CLI" },
    ];

    optionalTools.forEach(tool => {
      try {
        const version = execSync(tool.command, { encoding: "utf8", stdio: "pipe" }).trim();
        this.addResult(
          "Optional Tools",
          tool.name,
          true,
          `${tool.name} ${version.split("\n")[0]} (available)`
        );
      } catch (error) {
        this.addResult(
          "Optional Tools",
          tool.name,
          false,
          `${tool.name} not installed (optional)`,
          null
        );
      }
    });
  }

  checkConfiguration() {
    log.header("Configuration");

    // Environment variables
    const envExists = existsSync(join(projectRoot, ".env"));
    this.addResult(
      "Config",
      "Environment",
      envExists,
      `.env file ${envExists ? "configured" : "missing"}`,
      !envExists ? "Copy .env.example to .env and configure" : null
    );

    if (envExists) {
      try {
        const envContent = readFileSync(join(projectRoot, ".env"), "utf8");
        const requiredVars = ["VITE_SUPABASE_URL", "VITE_SUPABASE_ANON_KEY"];

        let missingVars = 0;
        requiredVars.forEach(varName => {
          if (!envContent.includes(varName + "=")) {
            missingVars++;
          }
        });

        this.addResult(
          "Config",
          "Environment Variables",
          missingVars === 0,
          missingVars === 0
            ? "All required environment variables configured"
            : `${missingVars} environment variables missing`
        );
      } catch (error) {
        this.addResult("Config", "Environment Variables", false, "Cannot read .env file");
      }
    }

    // Git configuration
    try {
      execSync("git rev-parse --git-dir", { cwd: projectRoot, stdio: "pipe" });
      this.addResult("Config", "Git Repository", true, "Git repository initialized");

      // Check for husky
      const huskyExists = existsSync(join(projectRoot, ".husky"));
      this.addResult(
        "Config",
        "Git Hooks",
        huskyExists,
        `Pre-commit hooks ${huskyExists ? "configured" : "not configured"}`,
        !huskyExists ? "Run: npx husky init" : null
      );
    } catch (error) {
      this.addResult("Config", "Git Repository", false, "Not a git repository");
    }
  }

  checkScripts() {
    log.header("Scripts");

    try {
      const packageJson = JSON.parse(readFileSync(join(projectRoot, "package.json"), "utf8"));
      const scripts = packageJson.scripts || {};

      const requiredScripts = ["dev", "build", "lint", "type-check", "quality-check", "test"];

      requiredScripts.forEach(script => {
        const exists = scripts[script];
        this.addResult(
          "Scripts",
          script,
          !!exists,
          `${script} script ${exists ? "available" : "missing"}`
        );
      });

      // Test script functionality
      const testScripts = [
        { name: "type-check", command: "npm run type-check" },
        { name: "lint", command: "npm run lint" },
      ];

      testScripts.forEach(script => {
        try {
          execSync(script.command, {
            cwd: projectRoot,
            stdio: "pipe",
            timeout: 30000, // 30 second timeout
          });
          this.addResult("Script Tests", script.name, true, `${script.name} runs successfully`);
        } catch (error) {
          this.addResult(
            "Script Tests",
            script.name,
            false,
            `${script.name} has issues`,
            "Check the script configuration"
          );
        }
      });
    } catch (error) {
      this.addResult("Scripts", "Configuration", false, "Cannot read package.json");
    }
  }

  generateSummary() {
    console.log(`\n${colors.cyan}📋 Validation Summary${colors.reset}`);
    console.log("=".repeat(60));

    const categories = [...new Set(this.results.map(r => r.category))];
    let totalChecks = 0;
    let passedChecks = 0;

    categories.forEach(category => {
      const categoryResults = this.results.filter(r => r.category === category);
      const categoryPassed = categoryResults.filter(r => r.passed).length;
      const categoryTotal = categoryResults.length;

      totalChecks += categoryTotal;
      passedChecks += categoryPassed;

      const percentage = ((categoryPassed / categoryTotal) * 100).toFixed(1);
      const status =
        categoryPassed === categoryTotal
          ? `${colors.green}✅${colors.reset}`
          : categoryPassed > categoryTotal * 0.7
            ? `${colors.yellow}⚠️${colors.reset}`
            : `${colors.red}❌${colors.reset}`;

      console.log(
        `${category.padEnd(20)} ${status} ${categoryPassed}/${categoryTotal} (${percentage}%)`
      );
    });

    console.log("=".repeat(60));

    const overallPercentage = ((passedChecks / totalChecks) * 100).toFixed(1);
    const overallStatus =
      passedChecks === totalChecks
        ? `${colors.green}READY${colors.reset}`
        : passedChecks > totalChecks * 0.8
          ? `${colors.yellow}NEEDS ATTENTION${colors.reset}`
          : `${colors.red}NOT READY${colors.reset}`;

    console.log(
      `\nOverall Status: ${overallStatus} (${passedChecks}/${totalChecks} - ${overallPercentage}%)`
    );

    // Generate recommendations
    const failedResults = this.results.filter(r => !r.passed);
    if (failedResults.length > 0) {
      console.log(`\n${colors.blue}📝 Action Items:${colors.reset}`);

      const criticalFailures = failedResults.filter(r =>
        ["Node.js Version", "Dependencies"].includes(r.check)
      );

      if (criticalFailures.length > 0) {
        console.log(`\n${colors.red}🚨 Critical Issues (fix first):${colors.reset}`);
        criticalFailures.forEach(result => {
          console.log(`• ${result.message}`);
          if (result.details) {
            console.log(`  → ${result.details}`);
          }
        });
      }

      const otherFailures = failedResults.filter(
        r => !["Node.js Version", "Dependencies"].includes(r.check)
      );

      if (otherFailures.length > 0) {
        console.log(`\n${colors.yellow}⚠️  Recommended Fixes:${colors.reset}`);
        otherFailures.forEach(result => {
          console.log(`• ${result.message}`);
          if (result.details) {
            console.log(`  → ${result.details}`);
          }
        });
      }
    }

    console.log(`\n${colors.blue}🚀 Next Steps:${colors.reset}`);
    if (passedChecks === totalChecks) {
      console.log("• Your development environment is ready!");
      console.log("• Run: npm run dev");
    } else {
      console.log("• Fix the issues above");
      console.log("• Run: npm run dev-setup (for automated setup)");
      console.log("• Run: npm run dev:validate (to recheck)");
    }

    return passedChecks === totalChecks;
  }
}

async function main() {
  console.log(`${colors.cyan}🔧 Development Environment Validation${colors.reset}\n`);

  const validator = new DevEnvironmentValidator();

  validator.checkSystemRequirements();
  console.log();
  validator.checkProjectStructure();
  console.log();
  validator.checkDependencies();
  console.log();
  validator.checkDevelopmentTools();
  console.log();
  validator.checkConfiguration();
  console.log();
  validator.checkScripts();

  const isValid = validator.generateSummary();

  process.exit(isValid ? 0 : 1);
}

main().catch(error => {
  console.error(`${colors.red}Validation failed:${colors.reset}`, error);
  process.exit(1);
});
