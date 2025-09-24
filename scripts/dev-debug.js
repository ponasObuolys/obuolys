#!/usr/bin/env node

import { exec, execSync } from "child_process";
import { existsSync, readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { promisify } from "util";

const execAsync = promisify(exec);
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
};

class DevDebugger {
  constructor() {
    this.debugData = {
      system: {},
      project: {},
      dependencies: {},
      performance: {},
      issues: [],
    };
  }

  async analyzeSystem() {
    log.header("🖥️  System Analysis");

    // System info
    this.debugData.system = {
      node: process.version,
      platform: process.platform,
      arch: process.arch,
      memory: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + "MB",
      uptime: Math.round(process.uptime()) + "s",
    };

    log.info(`Node.js: ${this.debugData.system.node}`);
    log.info(`Platform: ${this.debugData.system.platform} (${this.debugData.system.arch})`);
    log.info(`Memory: ${this.debugData.system.memory}`);

    // Check for development tools
    const tools = ["git", "npm", "code", "supabase"];
    for (const tool of tools) {
      try {
        const version = execSync(`${tool} --version`, { encoding: "utf8", stdio: "pipe" });
        log.success(`${tool}: Available`);
        this.debugData.system[tool] = version.split("\n")[0];
      } catch (error) {
        log.warning(`${tool}: Not found`);
        this.debugData.system[tool] = null;
      }
    }
  }

  async analyzeProject() {
    log.header("📁 Project Analysis");

    // Package.json analysis
    try {
      const packageJson = JSON.parse(readFileSync(join(projectRoot, "package.json"), "utf8"));
      this.debugData.project = {
        name: packageJson.name,
        version: packageJson.version,
        scripts: Object.keys(packageJson.scripts).length,
        dependencies: Object.keys(packageJson.dependencies || {}).length,
        devDependencies: Object.keys(packageJson.devDependencies || {}).length,
      };

      log.info(`Project: ${this.debugData.project.name} v${this.debugData.project.version}`);
      log.info(`Scripts: ${this.debugData.project.scripts}`);
      log.info(
        `Dependencies: ${this.debugData.project.dependencies} runtime, ${this.debugData.project.devDependencies} dev`
      );

      // Check for key configuration files
      const configFiles = [
        "vite.config.ts",
        "eslint.config.js",
        "tsconfig.json",
        ".prettierrc",
        "tailwind.config.ts",
      ];

      for (const file of configFiles) {
        if (existsSync(join(projectRoot, file))) {
          log.success(`Config: ${file} ✓`);
        } else {
          log.warning(`Config: ${file} missing`);
          this.debugData.issues.push(`Missing config file: ${file}`);
        }
      }
    } catch (error) {
      log.error("Failed to analyze package.json");
      this.debugData.issues.push("Invalid package.json");
    }
  }

  async analyzeDependencies() {
    log.header("📦 Dependency Analysis");

    try {
      // Check for outdated packages
      const outdatedResult = await execAsync("npm outdated --json", {
        cwd: projectRoot,
        encoding: "utf8",
      }).catch(error => ({ stdout: error.stdout || "{}" }));

      const outdated = JSON.parse(outdatedResult.stdout || "{}");
      const outdatedCount = Object.keys(outdated).length;

      if (outdatedCount === 0) {
        log.success("All dependencies are up to date");
      } else {
        log.warning(`${outdatedCount} outdated dependencies found`);
        Object.entries(outdated)
          .slice(0, 5)
          .forEach(([pkg, info]) => {
            log.detail(`${pkg}: ${info.current} → ${info.latest}`);
          });
        if (outdatedCount > 5) {
          log.detail(`... and ${outdatedCount - 5} more`);
        }
      }

      this.debugData.dependencies.outdated = outdatedCount;

      // Security audit
      const auditResult = await execAsync("npm audit --json", {
        cwd: projectRoot,
        encoding: "utf8",
      }).catch(error => ({ stdout: error.stdout || "{}" }));

      const audit = JSON.parse(auditResult.stdout || "{}");
      const vulnerabilities = audit.metadata?.vulnerabilities?.total || 0;

      if (vulnerabilities === 0) {
        log.success("No security vulnerabilities found");
      } else {
        log.warning(`${vulnerabilities} security vulnerabilities found`);
        this.debugData.issues.push(`Security vulnerabilities: ${vulnerabilities}`);
      }

      this.debugData.dependencies.vulnerabilities = vulnerabilities;
    } catch (error) {
      log.error("Failed to analyze dependencies");
      this.debugData.issues.push("Dependency analysis failed");
    }
  }

  async analyzePerformance() {
    log.header("⚡ Performance Analysis");

    try {
      // Check if build exists
      if (existsSync(join(projectRoot, "dist"))) {
        const buildSize = await this.calculateDirectorySize(join(projectRoot, "dist"));
        const buildSizeMB = (buildSize / 1024 / 1024).toFixed(2);

        if (buildSize < 2 * 1024 * 1024) {
          // 2MB
          log.success(`Build size: ${buildSizeMB}MB (optimal)`);
        } else if (buildSize < 5 * 1024 * 1024) {
          // 5MB
          log.warning(`Build size: ${buildSizeMB}MB (consider optimization)`);
        } else {
          log.error(`Build size: ${buildSizeMB}MB (needs optimization)`);
          this.debugData.issues.push(`Large bundle size: ${buildSizeMB}MB`);
        }

        this.debugData.performance.buildSize = buildSize;
      } else {
        log.info("No build found - run npm run build to analyze size");
      }

      // Check node_modules size
      if (existsSync(join(projectRoot, "node_modules"))) {
        const nodeModulesSize = await this.calculateDirectorySize(
          join(projectRoot, "node_modules")
        );
        const nodeModulesSizeMB = (nodeModulesSize / 1024 / 1024).toFixed(0);
        log.info(`node_modules size: ${nodeModulesSizeMB}MB`);
        this.debugData.performance.nodeModulesSize = nodeModulesSize;
      }
    } catch (error) {
      log.error("Performance analysis failed");
    }
  }

  async calculateDirectorySize(dirPath) {
    try {
      const result = await execAsync(`du -sb "${dirPath}"`, { encoding: "utf8" });
      return parseInt(result.stdout.split("\t")[0]);
    } catch (error) {
      // Fallback for Windows or systems without du
      return 0;
    }
  }

  async runQuickHealthCheck() {
    log.header("🏥 Quick Health Check");

    const checks = [
      {
        name: "TypeScript compilation",
        command: "npx tsc --noEmit",
        critical: true,
      },
      {
        name: "ESLint validation",
        command: "npm run lint",
        critical: false,
      },
      {
        name: "Prettier formatting",
        command: "npm run format:check",
        critical: false,
      },
    ];

    let passedChecks = 0;
    let totalChecks = checks.length;

    for (const check of checks) {
      try {
        execSync(check.command, {
          cwd: projectRoot,
          stdio: "pipe",
          encoding: "utf8",
        });
        log.success(`${check.name}: PASS`);
        passedChecks++;
      } catch (error) {
        if (check.critical) {
          log.error(`${check.name}: FAIL (critical)`);
          this.debugData.issues.push(`Critical check failed: ${check.name}`);
        } else {
          log.warning(`${check.name}: FAIL`);
        }
      }
    }

    const healthScore = Math.round((passedChecks / totalChecks) * 100);
    log.info(`Health Score: ${healthScore}% (${passedChecks}/${totalChecks} checks passed)`);
    this.debugData.performance.healthScore = healthScore;
  }

  async generateDebugReport() {
    log.header("📊 Debug Report Generated");

    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        issues: this.debugData.issues.length,
        healthScore: this.debugData.performance.healthScore || 0,
        outdatedDeps: this.debugData.dependencies.outdated || 0,
        vulnerabilities: this.debugData.dependencies.vulnerabilities || 0,
      },
      details: this.debugData,
    };

    // Save report to file
    const reportPath = join(projectRoot, "debug-report.json");
    writeFileSync(reportPath, JSON.stringify(report, null, 2));
    log.success(`Debug report saved to: debug-report.json`);

    // Print summary
    console.log("\n" + "=".repeat(60));
    log.header("📋 SUMMARY");
    console.log("=".repeat(60));

    if (this.debugData.issues.length === 0) {
      log.success("🎉 No critical issues found!");
    } else {
      log.warning(`⚠️  ${this.debugData.issues.length} issues need attention:`);
      this.debugData.issues.forEach(issue => {
        log.detail(`• ${issue}`);
      });
    }

    // Recommendations
    console.log("\n" + colors.blue + "💡 RECOMMENDATIONS:" + colors.reset);

    if (this.debugData.dependencies.outdated > 0) {
      console.log("  • Update dependencies: npm run update");
    }

    if (this.debugData.dependencies.vulnerabilities > 0) {
      console.log("  • Fix vulnerabilities: npm audit fix");
    }

    if (!existsSync(join(projectRoot, "dist"))) {
      console.log("  • Create build to analyze performance: npm run build");
    }

    if (this.debugData.issues.length > 0) {
      console.log("  • Run comprehensive checks: npm run quality:comprehensive");
    }

    console.log("  • Run development setup: npm run dev-setup");
    console.log("  • View detailed guide: docs/DEVELOPMENT.md");

    return report;
  }
}

async function main() {
  const args = process.argv.slice(2);
  const devDebugger = new DevDebugger();

  console.log(
    colors.cyan + colors.bold + "🔬 Development Environment Debugger" + colors.reset + "\n"
  );

  if (args.includes("--quick")) {
    await devDebugger.runQuickHealthCheck();
    return;
  }

  // Run full analysis
  await devDebugger.analyzeSystem();
  console.log();

  await devDebugger.analyzeProject();
  console.log();

  await devDebugger.analyzeDependencies();
  console.log();

  await devDebugger.analyzePerformance();
  console.log();

  await devDebugger.runQuickHealthCheck();
  console.log();

  await devDebugger.generateDebugReport();

  console.log(
    colors.gray + "\n💡 Tip: Run with --quick flag for fast health check only" + colors.reset
  );
}

// Handle command line execution
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    log.error("Debug analysis failed:");
    console.error(error);
    process.exit(1);
  });
}

export default DevDebugger;
