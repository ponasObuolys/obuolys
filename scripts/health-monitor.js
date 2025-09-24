#!/usr/bin/env node

import { execSync } from "child_process";
import { existsSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, "..");
const healthDataPath = join(projectRoot, ".dev-health.json");

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

class HealthMonitor {
  constructor() {
    this.healthHistory = this.loadHealthHistory();
    this.currentHealth = {
      timestamp: new Date().toISOString(),
      overall: "good",
      checks: {},
      trends: {},
      alerts: [],
    };
  }

  loadHealthHistory() {
    try {
      if (existsSync(healthDataPath)) {
        const data = readFileSync(healthDataPath, "utf8");
        return JSON.parse(data);
      }
    } catch (error) {
      log.debug("No previous health data found");
    }
    return { history: [], lastRun: null };
  }

  saveHealthHistory() {
    this.healthHistory.history.push(this.currentHealth);
    this.healthHistory.lastRun = this.currentHealth.timestamp;

    // Keep only last 30 entries
    if (this.healthHistory.history.length > 30) {
      this.healthHistory.history = this.healthHistory.history.slice(-30);
    }

    writeFileSync(healthDataPath, JSON.stringify(this.healthHistory, null, 2));
  }

  async runHealthCheck() {
    log.header("🏥 Development Health Monitor");

    const checks = [
      { name: "environment", label: "Environment Setup", check: () => this.checkEnvironment() },
      { name: "dependencies", label: "Dependencies", check: () => this.checkDependencies() },
      { name: "codeQuality", label: "Code Quality", check: () => this.checkCodeQuality() },
      { name: "tests", label: "Test Suite", check: () => this.checkTests() },
      { name: "build", label: "Build System", check: () => this.checkBuild() },
      { name: "git", label: "Git Status", check: () => this.checkGit() },
      { name: "performance", label: "Performance", check: () => this.checkPerformance() },
    ];

    let totalScore = 0;

    for (const check of checks) {
      try {
        log.info(`Checking ${check.label}...`);
        const result = await check.check();
        this.currentHealth.checks[check.name] = result;
        totalScore += this.getScoreFromStatus(result.status);
        log.success(`${check.label}: ${result.status}`);
      } catch (error) {
        const errorResult = { status: "error", message: error.message, score: 0 };
        this.currentHealth.checks[check.name] = errorResult;
        log.error(`${check.label}: ${error.message}`);
      }
    }

    // Calculate overall health
    const avgScore = totalScore / checks.length;
    this.currentHealth.overall =
      avgScore >= 80
        ? "excellent"
        : avgScore >= 60
          ? "good"
          : avgScore >= 40
            ? "warning"
            : "critical";

    // Analyze trends
    this.analyzeTrends();

    // Generate alerts
    this.generateAlerts();

    // Save health data
    this.saveHealthHistory();

    // Generate report
    this.generateHealthReport();

    return this.currentHealth;
  }

  getScoreFromStatus(status) {
    const scoreMap = {
      excellent: 100,
      good: 80,
      warning: 60,
      error: 20,
      critical: 0,
    };
    return scoreMap[status] || 50;
  }

  async checkEnvironment() {
    let issues = [];
    let score = 100;

    // Check Node version
    const nodeVersion = process.version;
    const majorVersion = parseInt(nodeVersion.slice(1).split(".")[0]);
    if (majorVersion < 18) {
      issues.push("Node.js version is too old");
      score -= 30;
    }

    // Check environment files
    if (!existsSync(join(projectRoot, ".env"))) {
      issues.push("Missing .env file");
      score -= 20;
    }

    // Check package.json
    if (!existsSync(join(projectRoot, "package.json"))) {
      issues.push("Missing package.json");
      score -= 50;
    }

    // Check critical directories
    const criticalDirs = ["src", "node_modules", ".husky"];
    for (const dir of criticalDirs) {
      if (!existsSync(join(projectRoot, dir))) {
        issues.push(`Missing ${dir} directory`);
        score -= 15;
      }
    }

    return {
      status: score >= 80 ? "good" : score >= 60 ? "warning" : "error",
      score: Math.max(0, score),
      message: issues.length > 0 ? issues.join(", ") : "Environment properly configured",
      details: { nodeVersion, issues },
    };
  }

  async checkDependencies() {
    let issues = [];
    let score = 100;

    try {
      // Check for outdated packages
      try {
        execSync("npm outdated --json", { cwd: projectRoot, stdio: "pipe" });
      } catch (error) {
        if (error.stdout) {
          const outdated = JSON.parse(error.stdout);
          const outdatedCount = Object.keys(outdated).length;
          if (outdatedCount > 0) {
            issues.push(`${outdatedCount} outdated packages`);
            score -= Math.min(30, outdatedCount * 2);
          }
        }
      }

      // Check for vulnerabilities
      try {
        const auditResult = execSync("npm audit --json", { cwd: projectRoot, encoding: "utf8" });
        const audit = JSON.parse(auditResult);
        const vulnCount = audit.metadata?.vulnerabilities?.total || 0;
        if (vulnCount > 0) {
          issues.push(`${vulnCount} security vulnerabilities`);
          score -= Math.min(50, vulnCount * 5);
        }
      } catch (error) {
        if (error.stdout) {
          const audit = JSON.parse(error.stdout);
          const vulnCount = audit.metadata?.vulnerabilities?.total || 0;
          if (vulnCount > 0) {
            issues.push(`${vulnCount} security vulnerabilities`);
            score -= Math.min(50, vulnCount * 5);
          }
        }
      }

      return {
        status: score >= 80 ? "good" : score >= 60 ? "warning" : "error",
        score: Math.max(0, score),
        message: issues.length > 0 ? issues.join(", ") : "Dependencies are up to date and secure",
        details: { issues },
      };
    } catch (error) {
      return {
        status: "error",
        score: 0,
        message: "Dependency check failed",
        details: { error: error.message },
      };
    }
  }

  async checkCodeQuality() {
    let issues = [];
    let score = 100;

    try {
      // ESLint check
      try {
        execSync("npm run lint", { cwd: projectRoot, stdio: "pipe" });
      } catch (error) {
        const output = error.stdout || error.stderr || "";
        const errorCount = (output.match(/\d+\s+error/g) || []).length;
        if (errorCount > 0) {
          issues.push(`${errorCount} ESLint errors`);
          score -= Math.min(30, errorCount * 3);
        }
      }

      // TypeScript check
      try {
        execSync("npm run type-check", { cwd: projectRoot, stdio: "pipe" });
      } catch (error) {
        const output = error.stdout || error.stderr || "";
        const typeErrors = (output.match(/error TS\d+:/g) || []).length;
        if (typeErrors > 0) {
          issues.push(`${typeErrors} TypeScript errors`);
          score -= Math.min(40, typeErrors * 5);
        }
      }

      // Prettier check
      try {
        execSync("npm run format:check", { cwd: projectRoot, stdio: "pipe" });
      } catch (error) {
        issues.push("Code formatting issues");
        score -= 15;
      }

      return {
        status: score >= 80 ? "good" : score >= 60 ? "warning" : "error",
        score: Math.max(0, score),
        message: issues.length > 0 ? issues.join(", ") : "Code quality is excellent",
        details: { issues },
      };
    } catch (error) {
      return {
        status: "error",
        score: 0,
        message: "Code quality check failed",
        details: { error: error.message },
      };
    }
  }

  async checkTests() {
    try {
      const testOutput = execSync("npm run test:run", {
        cwd: projectRoot,
        encoding: "utf8",
      });

      // Parse test results
      const passedMatch = testOutput.match(/(\d+)\s+passed/);
      const failedMatch = testOutput.match(/(\d+)\s+failed/);

      const passed = passedMatch ? parseInt(passedMatch[1]) : 0;
      const failed = failedMatch ? parseInt(failedMatch[1]) : 0;
      const total = passed + failed;

      let score = total > 0 ? Math.round((passed / total) * 100) : 0;
      let status = failed === 0 ? "good" : "warning";

      // Coverage check
      let coverage = 0;
      const coverageMatch = testOutput.match(/All files\s+\|\s+(\d+\.?\d*)/);
      if (coverageMatch) {
        coverage = parseFloat(coverageMatch[1]);
        if (coverage < 50) {
          score = Math.min(score, 60);
          status = "warning";
        }
      }

      return {
        status: failed > 0 ? "warning" : score >= 80 ? "good" : "warning",
        score,
        message: failed > 0 ? `${failed} tests failing` : `${passed} tests passing`,
        details: { passed, failed, total, coverage },
      };
    } catch (error) {
      return {
        status: "error",
        score: 0,
        message: "Test suite failed to run",
        details: { error: error.message },
      };
    }
  }

  async checkBuild() {
    try {
      const startTime = Date.now();
      execSync("npm run build", { cwd: projectRoot, stdio: "pipe" });
      const buildTime = Date.now() - startTime;

      let score = 100;
      let status = "good";
      let message = "Build successful";

      if (buildTime > 60000) {
        // > 1 minute
        score = 70;
        status = "warning";
        message = `Build slow (${Math.round(buildTime / 1000)}s)`;
      } else if (buildTime > 30000) {
        // > 30 seconds
        score = 85;
        message = `Build completed in ${Math.round(buildTime / 1000)}s`;
      }

      return {
        status,
        score,
        message,
        details: { buildTime },
      };
    } catch (error) {
      return {
        status: "error",
        score: 0,
        message: "Build failed",
        details: { error: error.message },
      };
    }
  }

  async checkGit() {
    try {
      const status = execSync("git status --porcelain", {
        cwd: projectRoot,
        encoding: "utf8",
      }).trim();

      const untracked = status.split("\n").filter(line => line.startsWith("??")).length;
      const modified = status
        .split("\n")
        .filter(line => line.startsWith(" M") || line.startsWith("M ")).length;
      const staged = status
        .split("\n")
        .filter(line => line.startsWith("A ") || line.startsWith("D ")).length;

      let score = 100;
      let message = "Git repository is clean";

      if (untracked > 10) {
        score -= 10;
        message = `${untracked} untracked files`;
      }

      if (modified > 20) {
        score -= 15;
        message += `, ${modified} modified files`;
      }

      return {
        status: "good",
        score,
        message,
        details: { untracked, modified, staged, totalChanges: untracked + modified + staged },
      };
    } catch (error) {
      return {
        status: "warning",
        score: 70,
        message: "Git status unavailable",
        details: { error: error.message },
      };
    }
  }

  async checkPerformance() {
    try {
      // Simple performance indicators
      const distPath = join(projectRoot, "dist");
      let score = 100;
      let issues = [];

      if (existsSync(distPath)) {
        const buildSize = this.calculateDirectorySize(distPath);
        const sizeInMB = buildSize / (1024 * 1024);

        if (sizeInMB > 5) {
          score -= 30;
          issues.push(`Large bundle size: ${sizeInMB.toFixed(1)}MB`);
        } else if (sizeInMB > 2) {
          score -= 15;
          issues.push(`Bundle size: ${sizeInMB.toFixed(1)}MB`);
        }
      }

      // Check for performance anti-patterns in package.json
      const packageJson = JSON.parse(readFileSync(join(projectRoot, "package.json"), "utf8"));
      const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
      const heavyPackages = Object.keys(deps).filter(
        pkg => pkg.includes("moment") || (pkg.includes("lodash") && !pkg.includes("lodash-es"))
      );

      if (heavyPackages.length > 0) {
        score -= 10;
        issues.push(`Heavy packages detected: ${heavyPackages.join(", ")}`);
      }

      return {
        status: score >= 80 ? "good" : score >= 60 ? "warning" : "error",
        score: Math.max(0, score),
        message: issues.length > 0 ? issues.join(", ") : "Performance looks good",
        details: { issues },
      };
    } catch (error) {
      return {
        status: "warning",
        score: 70,
        message: "Performance check incomplete",
        details: { error: error.message },
      };
    }
  }

  calculateDirectorySize(dirPath) {
    try {
      const { readdirSync, statSync } = require("fs");
      let totalSize = 0;
      const items = readdirSync(dirPath);

      items.forEach(item => {
        const itemPath = join(dirPath, item);
        const stats = statSync(itemPath);

        if (stats.isDirectory()) {
          totalSize += this.calculateDirectorySize(itemPath);
        } else {
          totalSize += stats.size;
        }
      });

      return totalSize;
    } catch (error) {
      return 0;
    }
  }

  analyzeTrends() {
    if (this.healthHistory.history.length < 2) {
      this.currentHealth.trends = { message: "Not enough data for trends" };
      return;
    }

    const recent = this.healthHistory.history.slice(-5); // Last 5 runs
    const trends = {};

    // Analyze score trends for each check
    Object.keys(this.currentHealth.checks).forEach(checkName => {
      const scores = recent.filter(h => h.checks[checkName]).map(h => h.checks[checkName].score);

      if (scores.length >= 2) {
        const current = scores[scores.length - 1];
        const previous = scores[scores.length - 2];
        const trend = current - previous;

        trends[checkName] = {
          direction: trend > 5 ? "improving" : trend < -5 ? "declining" : "stable",
          change: trend,
        };
      }
    });

    this.currentHealth.trends = trends;
  }

  generateAlerts() {
    const alerts = [];

    // Critical alerts
    Object.entries(this.currentHealth.checks).forEach(([name, check]) => {
      if (check.status === "error") {
        alerts.push({
          level: "critical",
          category: name,
          message: `${name} check failed: ${check.message}`,
          action: this.getRecommendedAction(name, check),
        });
      } else if (check.status === "warning" && check.score < 60) {
        alerts.push({
          level: "warning",
          category: name,
          message: `${name} needs attention: ${check.message}`,
          action: this.getRecommendedAction(name, check),
        });
      }
    });

    // Trend alerts
    Object.entries(this.currentHealth.trends).forEach(([name, trend]) => {
      if (trend.direction === "declining" && trend.change < -15) {
        alerts.push({
          level: "warning",
          category: "trend",
          message: `${name} health is declining`,
          action: `Review recent changes affecting ${name}`,
        });
      }
    });

    this.currentHealth.alerts = alerts;
  }

  getRecommendedAction(category, check) {
    const actions = {
      environment: "Run: npm run dev-setup",
      dependencies: "Run: npm audit fix && npm update",
      codeQuality: "Run: npm run quality-fix",
      tests: "Run: npm run test:watch",
      build: "Check build configuration and dependencies",
      git: "Clean up working directory",
      performance: "Run: npm run build:analyze",
    };

    return actions[category] || "Review and fix issues";
  }

  generateHealthReport() {
    console.log(`\n${colors.cyan}🏥 Health Report${colors.reset}`);
    console.log("=".repeat(50));

    // Overall health
    const overallColor =
      this.currentHealth.overall === "excellent"
        ? colors.green
        : this.currentHealth.overall === "good"
          ? colors.green
          : this.currentHealth.overall === "warning"
            ? colors.yellow
            : colors.red;

    console.log(
      `Overall Health: ${overallColor}${this.currentHealth.overall.toUpperCase()}${colors.reset}`
    );

    // Individual checks
    console.log(`\n${colors.blue}📊 Component Health${colors.reset}`);
    Object.entries(this.currentHealth.checks).forEach(([name, check]) => {
      const statusColor =
        check.status === "good"
          ? colors.green
          : check.status === "warning"
            ? colors.yellow
            : colors.red;

      const statusIcon = check.status === "good" ? "✅" : check.status === "warning" ? "⚠️" : "❌";

      console.log(
        `${name.padEnd(15)} ${statusIcon} ${statusColor}${check.score}%${colors.reset} - ${check.message}`
      );
    });

    // Trends
    if (Object.keys(this.currentHealth.trends).length > 0) {
      console.log(`\n${colors.blue}📈 Trends${colors.reset}`);
      Object.entries(this.currentHealth.trends).forEach(([name, trend]) => {
        if (trend.direction !== "stable") {
          const trendIcon =
            trend.direction === "improving" ? "📈" : trend.direction === "declining" ? "📉" : "➡️";

          const trendColor =
            trend.direction === "improving"
              ? colors.green
              : trend.direction === "declining"
                ? colors.red
                : colors.gray;

          console.log(
            `${name.padEnd(15)} ${trendIcon} ${trendColor}${trend.direction}${colors.reset} (${trend.change > 0 ? "+" : ""}${trend.change})`
          );
        }
      });
    }

    // Alerts
    if (this.currentHealth.alerts.length > 0) {
      console.log(`\n${colors.blue}🚨 Alerts${colors.reset}`);
      this.currentHealth.alerts.forEach((alert, i) => {
        const alertColor = alert.level === "critical" ? colors.red : colors.yellow;
        const alertIcon = alert.level === "critical" ? "🔴" : "🟡";

        console.log(`${i + 1}. ${alertIcon} ${alertColor}${alert.message}${colors.reset}`);
        console.log(`   Action: ${colors.blue}${alert.action}${colors.reset}`);
      });
    } else {
      console.log(`\n${colors.green}✨ No alerts - everything looks good!${colors.reset}`);
    }

    // Quick actions
    console.log(`\n${colors.blue}🔧 Quick Actions${colors.reset}`);
    console.log("• npm run quality-fix      - Fix code quality issues");
    console.log("• npm run dev:validate     - Validate development environment");
    console.log("• npm run health:monitor   - Run health check");
    console.log("• npm run clean && npm install  - Reset environment");

    console.log(`\n${colors.gray}Last check: ${this.currentHealth.timestamp}${colors.reset}`);
  }
}

async function main() {
  const args = process.argv.slice(2);
  const monitor = new HealthMonitor();

  if (args.includes("--help") || args.includes("-h")) {
    console.log(`
${colors.cyan}🏥 Health Monitor${colors.reset}

Monitor development environment health and track trends over time.

Usage:
  npm run health:monitor        # Run health check
  node scripts/health-monitor.js  # Direct execution

Options:
  --help, -h                   # Show this help
  --continuous, -c             # Run continuously (every 30 minutes)
  --alert-only                 # Only show alerts

Features:
  • Environment validation
  • Dependency security check
  • Code quality metrics
  • Test suite health
  • Build performance
  • Git repository status
  • Historical trend analysis
  • Smart alerts and recommendations

The health data is stored in .dev-health.json for trend analysis.
    `);
    return;
  }

  if (args.includes("--continuous") || args.includes("-c")) {
    console.log(
      `${colors.blue}🔄 Running continuous health monitoring (every 30 minutes)...${colors.reset}`
    );

    while (true) {
      await monitor.runHealthCheck();
      console.log(`\n${colors.gray}⏰ Next check in 30 minutes...${colors.reset}\n`);

      // Wait 30 minutes
      await new Promise(resolve => setTimeout(resolve, 30 * 60 * 1000));
    }
  } else if (args.includes("--alert-only")) {
    const health = await monitor.runHealthCheck();

    if (health.alerts.length > 0) {
      console.log(`\n${colors.red}🚨 Health Alerts:${colors.reset}`);
      health.alerts.forEach((alert, i) => {
        console.log(`${i + 1}. ${alert.message} - ${alert.action}`);
      });
      process.exit(1);
    } else {
      console.log(`${colors.green}✅ No health issues detected${colors.reset}`);
      process.exit(0);
    }
  } else {
    await monitor.runHealthCheck();
  }
}

main().catch(error => {
  console.error(`${colors.red}Health monitor failed:${colors.reset}`, error);
  process.exit(1);
});
