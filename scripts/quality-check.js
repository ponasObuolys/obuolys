#!/usr/bin/env node

import { execSync, exec } from "child_process";
import { promisify } from "util";
import { existsSync, statSync, readdirSync } from "fs";
import { join, extname } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

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
  gray: "\x1b[90m",
  reset: "\x1b[0m",
};

const log = {
  success: msg => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  warning: msg => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  error: msg => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  info: msg => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
  detail: msg => console.log(`${colors.gray}   ${msg}${colors.reset}`),
};

class QualityMetrics {
  constructor() {
    this.results = {
      typescript: { passed: false, errors: 0, warnings: 0 },
      eslint: { passed: false, errors: 0, warnings: 0, fixable: 0 },
      prettier: { passed: false, unformatted: 0 },
      tests: { passed: false, total: 0, passed: 0, failed: 0, coverage: 0 },
      bundleSize: { passed: false, size: 0, gzipSize: 0 },
      dependencies: { passed: false, outdated: 0, vulnerable: 0 },
      codeComplexity: { passed: false, files: 0, avgComplexity: 0, maxComplexity: 0 },
    };
  }

  async runTypeScriptCheck() {
    try {
      log.info("Running TypeScript type checking...");
      execSync("npx tsc --noEmit", {
        cwd: projectRoot,
        stdio: "pipe",
        encoding: "utf8",
      });

      this.results.typescript.passed = true;
      log.success("TypeScript: No type errors found");
    } catch (error) {
      const output = error.stdout || error.stderr || "";
      const errors = (output.match(/error TS\d+:/g) || []).length;

      this.results.typescript.errors = errors;
      log.error(`TypeScript: ${errors} type errors found`);

      if (errors > 0) {
        log.detail(output.split("\n").slice(0, 5).join("\n"));
      }
    }
  }

  async runESLintCheck() {
    try {
      log.info("Running ESLint analysis...");

      const result = await execAsync("npx eslint . --format=json", {
        cwd: projectRoot,
        encoding: "utf8",
      });

      const lintResults = JSON.parse(result.stdout);
      let totalErrors = 0;
      let totalWarnings = 0;
      let fixableIssues = 0;

      lintResults.forEach(file => {
        totalErrors += file.errorCount;
        totalWarnings += file.warningCount;
        fixableIssues += file.fixableErrorCount + file.fixableWarningCount;
      });

      this.results.eslint.errors = totalErrors;
      this.results.eslint.warnings = totalWarnings;
      this.results.eslint.fixable = fixableIssues;
      this.results.eslint.passed = totalErrors === 0;

      if (totalErrors === 0 && totalWarnings === 0) {
        log.success("ESLint: No issues found");
      } else {
        const message = `ESLint: ${totalErrors} errors, ${totalWarnings} warnings`;
        if (totalErrors > 0) {
          log.error(message + ` (${fixableIssues} auto-fixable)`);
        } else {
          log.warning(message + ` (${fixableIssues} auto-fixable)`);
        }
      }
    } catch (error) {
      // ESLint exits with code 1 when it finds issues, parse the output anyway
      if (error.stdout) {
        try {
          const lintResults = JSON.parse(error.stdout);
          let totalErrors = 0;
          let totalWarnings = 0;
          let fixableIssues = 0;

          lintResults.forEach(file => {
            totalErrors += file.errorCount;
            totalWarnings += file.warningCount;
            fixableIssues += file.fixableErrorCount + file.fixableWarningCount;
          });

          this.results.eslint.errors = totalErrors;
          this.results.eslint.warnings = totalWarnings;
          this.results.eslint.fixable = fixableIssues;

          const message = `ESLint: ${totalErrors} errors, ${totalWarnings} warnings`;
          if (totalErrors > 0) {
            log.error(message + ` (${fixableIssues} auto-fixable)`);
          } else {
            log.warning(message + ` (${fixableIssues} auto-fixable)`);
          }
        } catch (parseError) {
          log.error("ESLint: Failed to parse results");
        }
      } else {
        log.error("ESLint: Check failed");
      }
    }
  }

  async runPrettierCheck() {
    try {
      log.info("Running Prettier formatting check...");

      await execAsync("npx prettier --check .", {
        cwd: projectRoot,
        encoding: "utf8",
      });

      this.results.prettier.passed = true;
      log.success("Prettier: All files are properly formatted");
    } catch (error) {
      const output = error.stdout || "";
      const unformattedFiles = output.split("\n").filter(line => line.trim()).length;

      this.results.prettier.unformatted = unformattedFiles;
      log.warning(`Prettier: ${unformattedFiles} files need formatting`);
    }
  }

  async runTestSuite() {
    try {
      log.info("Running test suite...");

      const result = await execAsync("npm run test:run", {
        cwd: projectRoot,
        encoding: "utf8",
      });

      // Parse vitest output for test results
      const output = result.stdout + result.stderr;
      const testMatch = output.match(/(\d+) passed/);
      const failMatch = output.match(/(\d+) failed/);

      const passed = testMatch ? parseInt(testMatch[1]) : 0;
      const failed = failMatch ? parseInt(failMatch[1]) : 0;

      this.results.tests.passed = failed === 0;
      this.results.tests.total = passed + failed;
      this.results.tests.passed = passed;
      this.results.tests.failed = failed;

      if (failed === 0) {
        log.success(`Tests: ${passed} tests passed`);
      } else {
        log.error(`Tests: ${failed} failed, ${passed} passed`);
      }
    } catch (error) {
      log.error("Tests: Test suite failed to run");
      this.results.tests.passed = false;
    }
  }

  async checkBundleSize() {
    try {
      log.info("Analyzing bundle size...");

      // Build the project first
      execSync("npm run build", {
        cwd: projectRoot,
        stdio: "pipe",
      });

      const distPath = join(projectRoot, "dist");
      if (existsSync(distPath)) {
        const bundleSize = this.calculateDirectorySize(distPath);
        this.results.bundleSize.size = bundleSize;
        this.results.bundleSize.passed = bundleSize < 2 * 1024 * 1024; // 2MB limit

        const sizeInMB = (bundleSize / (1024 * 1024)).toFixed(2);

        if (this.results.bundleSize.passed) {
          log.success(`Bundle size: ${sizeInMB}MB (within 2MB limit)`);
        } else {
          log.warning(`Bundle size: ${sizeInMB}MB (exceeds 2MB limit)`);
        }
      }
    } catch (error) {
      log.error("Bundle size: Failed to analyze");
    }
  }

  calculateDirectorySize(dirPath) {
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
  }

  async checkDependencies() {
    try {
      log.info("Checking dependencies...");

      // Check for outdated packages
      try {
        const outdatedResult = await execAsync("npm outdated --json", {
          cwd: projectRoot,
          encoding: "utf8",
        });

        // npm outdated exits with code 1 when packages are outdated
        const outdated = JSON.parse(outdatedResult.stdout || "{}");
        this.results.dependencies.outdated = Object.keys(outdated).length;
      } catch (error) {
        if (error.stdout) {
          try {
            const outdated = JSON.parse(error.stdout);
            this.results.dependencies.outdated = Object.keys(outdated).length;
          } catch (parseError) {
            // Ignore parsing errors
          }
        }
      }

      // Check for vulnerabilities
      try {
        const auditResult = await execAsync("npm audit --json", {
          cwd: projectRoot,
          encoding: "utf8",
        });

        const audit = JSON.parse(auditResult.stdout);
        this.results.dependencies.vulnerable = audit.metadata?.vulnerabilities?.total || 0;
      } catch (error) {
        if (error.stdout) {
          try {
            const audit = JSON.parse(error.stdout);
            this.results.dependencies.vulnerable = audit.metadata?.vulnerabilities?.total || 0;
          } catch (parseError) {
            // Ignore parsing errors
          }
        }
      }

      this.results.dependencies.passed =
        this.results.dependencies.outdated === 0 && this.results.dependencies.vulnerable === 0;

      if (this.results.dependencies.passed) {
        log.success("Dependencies: All packages are up to date and secure");
      } else {
        const messages = [];
        if (this.results.dependencies.outdated > 0) {
          messages.push(`${this.results.dependencies.outdated} outdated`);
        }
        if (this.results.dependencies.vulnerable > 0) {
          messages.push(`${this.results.dependencies.vulnerable} vulnerabilities`);
        }
        log.warning(`Dependencies: ${messages.join(", ")}`);
      }
    } catch (error) {
      log.error("Dependencies: Check failed");
    }
  }

  analyzeCodeComplexity() {
    log.info("Analyzing code complexity...");

    const srcPath = join(projectRoot, "src");
    if (!existsSync(srcPath)) {
      log.warning("Code complexity: src directory not found");
      return;
    }

    let totalFiles = 0;
    let totalComplexity = 0;
    let maxComplexity = 0;

    const analyzeFile = filePath => {
      const stats = statSync(filePath);

      if (stats.isDirectory()) {
        readdirSync(filePath).forEach(item => {
          analyzeFile(join(filePath, item));
        });
      } else if ([".ts", ".tsx", ".js", ".jsx"].includes(extname(filePath))) {
        totalFiles++;
        // Simple complexity heuristic based on file size and keywords
        const complexity = Math.min(stats.size / 1000, 10); // Cap at 10
        totalComplexity += complexity;
        maxComplexity = Math.max(maxComplexity, complexity);
      }
    };

    analyzeFile(srcPath);

    const avgComplexity = totalFiles > 0 ? totalComplexity / totalFiles : 0;

    this.results.codeComplexity.files = totalFiles;
    this.results.codeComplexity.avgComplexity = avgComplexity;
    this.results.codeComplexity.maxComplexity = maxComplexity;
    this.results.codeComplexity.passed = avgComplexity < 5 && maxComplexity < 8;

    if (this.results.codeComplexity.passed) {
      log.success(
        `Code complexity: Average ${avgComplexity.toFixed(1)}, Max ${maxComplexity.toFixed(1)}`
      );
    } else {
      log.warning(
        `Code complexity: Average ${avgComplexity.toFixed(1)}, Max ${maxComplexity.toFixed(1)} (consider refactoring)`
      );
    }
  }

  generateReport() {
    console.log(`\n${colors.cyan}📊 Quality Report Summary${colors.reset}`);
    console.log("=".repeat(50));

    const checks = [
      { name: "TypeScript", result: this.results.typescript },
      { name: "ESLint", result: this.results.eslint },
      { name: "Prettier", result: this.results.prettier },
      { name: "Tests", result: this.results.tests },
      { name: "Bundle Size", result: this.results.bundleSize },
      { name: "Dependencies", result: this.results.dependencies },
      { name: "Code Complexity", result: this.results.codeComplexity },
    ];

    let passedChecks = 0;

    checks.forEach(check => {
      const status = check.result.passed
        ? `${colors.green}PASS${colors.reset}`
        : `${colors.red}FAIL${colors.reset}`;
      console.log(`${check.name.padEnd(20)} ${status}`);

      if (check.result.passed) passedChecks++;
    });

    console.log("=".repeat(50));

    const overallScore = ((passedChecks / checks.length) * 100).toFixed(1);
    const scoreColor =
      overallScore >= 80 ? colors.green : overallScore >= 60 ? colors.yellow : colors.red;

    console.log(
      `Overall Quality Score: ${scoreColor}${overallScore}%${colors.reset} (${passedChecks}/${checks.length} checks passed)`
    );

    // Recommendations
    if (passedChecks < checks.length) {
      console.log(`\n${colors.blue}📋 Recommendations:${colors.reset}`);

      if (!this.results.eslint.passed && this.results.eslint.fixable > 0) {
        console.log(
          `• Run 'npm run lint:fix' to fix ${this.results.eslint.fixable} auto-fixable issues`
        );
      }

      if (!this.results.prettier.passed) {
        console.log("• Run 'npm run format' to fix formatting issues");
      }

      if (!this.results.tests.passed) {
        console.log("• Fix failing tests before proceeding");
      }

      if (this.results.dependencies.outdated > 0) {
        console.log("• Update outdated dependencies with 'npm update'");
      }

      if (this.results.dependencies.vulnerable > 0) {
        console.log("• Fix security vulnerabilities with 'npm audit fix'");
      }
    }

    return passedChecks === checks.length;
  }
}

async function main() {
  console.log(`${colors.cyan}🔍 Comprehensive Quality Check${colors.reset}\n`);

  const metrics = new QualityMetrics();

  await metrics.runTypeScriptCheck();
  await metrics.runESLintCheck();
  await metrics.runPrettierCheck();
  await metrics.runTestSuite();
  await metrics.checkBundleSize();
  await metrics.checkDependencies();
  metrics.analyzeCodeComplexity();

  const allPassed = metrics.generateReport();

  console.log(`\n${colors.blue}💡 Quick fixes:${colors.reset}`);
  console.log("• npm run quality-fix    - Fix linting and formatting");
  console.log("• npm audit fix          - Fix security vulnerabilities");
  console.log("• npm update            - Update dependencies");
  console.log("• npm run test:watch    - Fix failing tests");

  process.exit(allPassed ? 0 : 1);
}

main().catch(error => {
  console.error(`${colors.red}Quality check failed:${colors.reset}`, error);
  process.exit(1);
});
