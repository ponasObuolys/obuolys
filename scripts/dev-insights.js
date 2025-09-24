#!/usr/bin/env node

import { execSync } from "child_process";
import { existsSync, readFileSync, readdirSync, statSync } from "fs";
import { join, extname } from "path";
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
  metric: (label, value, unit = "") => {
    console.log(
      `   ${colors.gray}${label}:${colors.reset} ${colors.cyan}${value}${unit}${colors.reset}`
    );
  },
};

class DevInsights {
  constructor() {
    this.metrics = {
      codebase: {},
      dependencies: {},
      performance: {},
      quality: {},
      trends: {},
    };
  }

  async generateInsights() {
    log.header("📊 Development Insights & Analytics");

    await this.analyzeCodebase();
    await this.analyzeDependencies();
    await this.analyzePerformance();
    await this.analyzeQuality();
    await this.generateRecommendations();

    this.generateReport();
  }

  async analyzeCodebase() {
    log.info("Analyzing codebase structure...");

    const srcPath = join(projectRoot, "src");
    if (!existsSync(srcPath)) {
      log.warning("Source directory not found");
      return;
    }

    let stats = {
      totalFiles: 0,
      totalLines: 0,
      byFileType: {},
      byDirectory: {},
      componentCount: 0,
      hookCount: 0,
      contextCount: 0,
      largestFiles: [],
      emptyFiles: 0,
      avgFileSize: 0,
    };

    const analyzeDirectory = (dirPath, relativePath = "") => {
      const items = readdirSync(dirPath);

      items.forEach(item => {
        const itemPath = join(dirPath, item);
        const itemRelativePath = join(relativePath, item);
        const itemStats = statSync(itemPath);

        if (itemStats.isDirectory()) {
          if (!stats.byDirectory[item]) stats.byDirectory[item] = 0;
          stats.byDirectory[item]++;
          analyzeDirectory(itemPath, itemRelativePath);
        } else {
          const ext = extname(item);
          if ([".ts", ".tsx", ".js", ".jsx", ".css", ".scss", ".json", ".md"].includes(ext)) {
            stats.totalFiles++;

            // Count by file type
            if (!stats.byFileType[ext]) stats.byFileType[ext] = 0;
            stats.byFileType[ext]++;

            // Read file for line count and analysis
            try {
              const content = readFileSync(itemPath, "utf8");
              const lines = content.split("\n").length;
              stats.totalLines += lines;

              // Track largest files
              stats.largestFiles.push({
                path: itemRelativePath,
                lines: lines,
                size: itemStats.size,
              });

              // Empty files
              if (content.trim() === "") {
                stats.emptyFiles++;
              }

              // Component/Hook detection
              if (ext === ".tsx" || ext === ".jsx") {
                if (content.includes("export default") || content.includes("export const")) {
                  stats.componentCount++;
                }
                if (content.includes("use") && item.startsWith("use")) {
                  stats.hookCount++;
                }
                if (content.includes("createContext") || content.includes("Context")) {
                  stats.contextCount++;
                }
              }
            } catch (error) {
              // Skip files that can't be read
            }
          }
        }
      });
    };

    analyzeDirectory(srcPath, "src");

    // Calculate averages and sort largest files
    stats.avgFileSize = stats.totalFiles > 0 ? Math.round(stats.totalLines / stats.totalFiles) : 0;
    stats.largestFiles.sort((a, b) => b.lines - a.lines);
    stats.largestFiles = stats.largestFiles.slice(0, 5); // Top 5

    this.metrics.codebase = stats;

    log.success("Codebase analysis completed");
    log.metric("Total Files", stats.totalFiles);
    log.metric("Total Lines", stats.totalLines.toLocaleString());
    log.metric("Components", stats.componentCount);
    log.metric("Custom Hooks", stats.hookCount);
    log.metric("Contexts", stats.contextCount);
  }

  async analyzeDependencies() {
    log.info("Analyzing dependencies...");

    try {
      const packageJsonPath = join(projectRoot, "package.json");
      const packageLockPath = join(projectRoot, "package-lock.json");

      if (!existsSync(packageJsonPath)) {
        log.warning("package.json not found");
        return;
      }

      const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));
      const deps = packageJson.dependencies || {};
      const devDeps = packageJson.devDependencies || {};

      let stats = {
        totalDependencies: Object.keys(deps).length,
        totalDevDependencies: Object.keys(devDeps).length,
        frameworkDeps: 0,
        uiDeps: 0,
        toolingDeps: 0,
        outdatedCount: 0,
        vulnerabilityCount: 0,
        largestPackages: [],
        unusedDeps: [],
      };

      // Categorize dependencies
      Object.keys(deps).forEach(dep => {
        if (dep.includes("react") || dep.includes("vue") || dep.includes("angular")) {
          stats.frameworkDeps++;
        } else if (dep.includes("ui") || dep.includes("radix") || dep.includes("lucide")) {
          stats.uiDeps++;
        }
      });

      Object.keys(devDeps).forEach(dep => {
        if (
          dep.includes("eslint") ||
          dep.includes("prettier") ||
          dep.includes("vite") ||
          dep.includes("test")
        ) {
          stats.toolingDeps++;
        }
      });

      // Check for outdated packages
      try {
        const outdatedOutput = execSync("npm outdated --json", {
          cwd: projectRoot,
          encoding: "utf8",
        });
        const outdated = JSON.parse(outdatedOutput);
        stats.outdatedCount = Object.keys(outdated).length;
      } catch (error) {
        // npm outdated exits with code 1 when packages are outdated
        if (error.stdout) {
          try {
            const outdated = JSON.parse(error.stdout);
            stats.outdatedCount = Object.keys(outdated).length;
          } catch (parseError) {
            // Ignore parsing errors
          }
        }
      }

      // Check for vulnerabilities
      try {
        const auditOutput = execSync("npm audit --json", {
          cwd: projectRoot,
          encoding: "utf8",
        });
        const audit = JSON.parse(auditOutput);
        stats.vulnerabilityCount = audit.metadata?.vulnerabilities?.total || 0;
      } catch (error) {
        if (error.stdout) {
          try {
            const audit = JSON.parse(error.stdout);
            stats.vulnerabilityCount = audit.metadata?.vulnerabilities?.total || 0;
          } catch (parseError) {
            // Ignore parsing errors
          }
        }
      }

      // Analyze package-lock.json for size information if available
      if (existsSync(packageLockPath)) {
        try {
          const packageLock = JSON.parse(readFileSync(packageLockPath, "utf8"));
          // This is a simplified analysis - in a real scenario you'd want more detailed package size analysis
          const packages = packageLock.packages || {};
          const packageSizes = Object.entries(packages)
            .filter(([path, pkg]) => path !== "" && pkg.name)
            .map(([path, pkg]) => ({
              name: pkg.name,
              version: pkg.version,
            }));

          stats.largestPackages = packageSizes.slice(0, 5);
        } catch (error) {
          // Ignore parsing errors
        }
      }

      this.metrics.dependencies = stats;

      log.success("Dependency analysis completed");
      log.metric("Production Dependencies", stats.totalDependencies);
      log.metric("Development Dependencies", stats.totalDevDependencies);
      log.metric("Outdated Packages", stats.outdatedCount);
      log.metric("Vulnerabilities", stats.vulnerabilityCount);
    } catch (error) {
      log.error(`Dependency analysis failed: ${error.message}`);
    }
  }

  async analyzePerformance() {
    log.info("Analyzing build performance...");

    let stats = {
      buildTime: 0,
      buildSize: 0,
      bundleAnalysis: {},
      viteBenchmark: {},
    };

    try {
      // Build performance test
      const startTime = Date.now();
      execSync("npm run build", {
        cwd: projectRoot,
        stdio: "pipe",
      });
      stats.buildTime = Date.now() - startTime;

      // Analyze build output
      const distPath = join(projectRoot, "dist");
      if (existsSync(distPath)) {
        stats.buildSize = this.calculateDirectorySize(distPath);

        // Analyze specific build files
        const files = this.getFilesRecursively(distPath);
        const jsFiles = files.filter(f => f.endsWith(".js"));
        const cssFiles = files.filter(f => f.endsWith(".css"));
        const assetFiles = files.filter(
          f => !f.endsWith(".js") && !f.endsWith(".css") && !f.endsWith(".html")
        );

        stats.bundleAnalysis = {
          jsFiles: jsFiles.length,
          cssFiles: cssFiles.length,
          assetFiles: assetFiles.length,
          largestJsFile: this.getLargestFile(jsFiles),
          largestCssFile: this.getLargestFile(cssFiles),
        };
      }

      this.metrics.performance = stats;

      log.success("Performance analysis completed");
      log.metric("Build Time", stats.buildTime, "ms");
      log.metric("Bundle Size", Math.round(stats.buildSize / 1024), "KB");
    } catch (error) {
      log.warning(`Performance analysis failed: ${error.message}`);
    }
  }

  async analyzeQuality() {
    log.info("Analyzing code quality metrics...");

    let stats = {
      eslintIssues: 0,
      typeErrors: 0,
      testCoverage: 0,
      testCount: 0,
      codeComplexity: 0,
      duplicateCode: 0,
      technicalDebt: "low",
    };

    try {
      // ESLint analysis
      try {
        execSync("npm run lint", {
          cwd: projectRoot,
          stdio: "pipe",
        });
        stats.eslintIssues = 0;
      } catch (error) {
        // Count ESLint errors from output
        const output = error.stdout || error.stderr || "";
        const errorMatches = output.match(/\d+\s+error/g) || [];
        stats.eslintIssues = errorMatches.reduce((total, match) => {
          return total + parseInt(match.match(/\d+/)[0]);
        }, 0);
      }

      // TypeScript check
      try {
        execSync("npm run type-check", {
          cwd: projectRoot,
          stdio: "pipe",
        });
        stats.typeErrors = 0;
      } catch (error) {
        const output = error.stdout || error.stderr || "";
        const errorMatches = output.match(/error TS\d+:/g) || [];
        stats.typeErrors = errorMatches.length;
      }

      // Test analysis
      try {
        const testOutput = execSync("npm run test:run", {
          cwd: projectRoot,
          encoding: "utf8",
        });

        // Parse test results
        const testMatch = testOutput.match(/(\d+)\s+passed/);
        if (testMatch) {
          stats.testCount = parseInt(testMatch[1]);
        }

        // Look for coverage information
        const coverageMatch = testOutput.match(/All files\s+\|\s+(\d+\.?\d*)/);
        if (coverageMatch) {
          stats.testCoverage = parseFloat(coverageMatch[1]);
        }
      } catch (error) {
        // Tests might not be passing or configured
      }

      // Simple complexity analysis based on file sizes and structure
      const codebaseMetrics = this.metrics.codebase;
      if (codebaseMetrics.avgFileSize) {
        if (codebaseMetrics.avgFileSize > 200) {
          stats.codeComplexity = "high";
        } else if (codebaseMetrics.avgFileSize > 100) {
          stats.codeComplexity = "medium";
        } else {
          stats.codeComplexity = "low";
        }
      }

      // Technical debt assessment
      const issues = stats.eslintIssues + stats.typeErrors;
      const coverage = stats.testCoverage;

      if (issues > 10 || coverage < 50) {
        stats.technicalDebt = "high";
      } else if (issues > 5 || coverage < 70) {
        stats.technicalDebt = "medium";
      } else {
        stats.technicalDebt = "low";
      }

      this.metrics.quality = stats;

      log.success("Quality analysis completed");
      log.metric("ESLint Issues", stats.eslintIssues);
      log.metric("Type Errors", stats.typeErrors);
      log.metric("Test Coverage", stats.testCoverage, "%");
      log.metric("Technical Debt", stats.technicalDebt);
    } catch (error) {
      log.warning(`Quality analysis failed: ${error.message}`);
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

  getFilesRecursively(dirPath, files = []) {
    const items = readdirSync(dirPath);

    items.forEach(item => {
      const itemPath = join(dirPath, item);
      const stats = statSync(itemPath);

      if (stats.isDirectory()) {
        this.getFilesRecursively(itemPath, files);
      } else {
        files.push(itemPath);
      }
    });

    return files;
  }

  getLargestFile(files) {
    if (files.length === 0) return null;

    return files.reduce((largest, file) => {
      try {
        const stats = statSync(file);
        if (!largest || stats.size > statSync(largest).size) {
          return file;
        }
        return largest;
      } catch (error) {
        return largest;
      }
    }, null);
  }

  async generateRecommendations() {
    const recommendations = [];

    // Codebase recommendations
    if (this.metrics.codebase.avgFileSize > 200) {
      recommendations.push({
        category: "Code Structure",
        priority: "high",
        issue: "Large file sizes detected",
        suggestion: "Consider breaking down large components/files for better maintainability",
        action: "Review files with >300 lines",
      });
    }

    if (this.metrics.codebase.emptyFiles > 0) {
      recommendations.push({
        category: "Code Cleanup",
        priority: "low",
        issue: `${this.metrics.codebase.emptyFiles} empty files found`,
        suggestion: "Remove unused empty files",
        action: "Clean up empty files",
      });
    }

    // Dependency recommendations
    if (this.metrics.dependencies.outdatedCount > 5) {
      recommendations.push({
        category: "Dependencies",
        priority: "medium",
        issue: `${this.metrics.dependencies.outdatedCount} outdated packages`,
        suggestion: "Update dependencies to latest versions",
        action: "Run: npm update",
      });
    }

    if (this.metrics.dependencies.vulnerabilityCount > 0) {
      recommendations.push({
        category: "Security",
        priority: "high",
        issue: `${this.metrics.dependencies.vulnerabilityCount} security vulnerabilities`,
        suggestion: "Fix security vulnerabilities in dependencies",
        action: "Run: npm audit fix",
      });
    }

    // Performance recommendations
    if (this.metrics.performance.buildSize > 2000000) {
      // 2MB
      recommendations.push({
        category: "Performance",
        priority: "medium",
        issue: "Large bundle size detected",
        suggestion: "Consider code splitting and tree shaking optimization",
        action: "Run: npm run build:analyze",
      });
    }

    if (this.metrics.performance.buildTime > 30000) {
      // 30 seconds
      recommendations.push({
        category: "Build Performance",
        priority: "medium",
        issue: "Slow build times",
        suggestion: "Consider build optimization and dependency cleanup",
        action: "Review build configuration",
      });
    }

    // Quality recommendations
    if (this.metrics.quality.eslintIssues > 0) {
      recommendations.push({
        category: "Code Quality",
        priority: "medium",
        issue: `${this.metrics.quality.eslintIssues} linting issues`,
        suggestion: "Fix ESLint issues for better code quality",
        action: "Run: npm run lint:fix",
      });
    }

    if (this.metrics.quality.typeErrors > 0) {
      recommendations.push({
        category: "Type Safety",
        priority: "high",
        issue: `${this.metrics.quality.typeErrors} TypeScript errors`,
        suggestion: "Fix TypeScript errors for better type safety",
        action: "Run: npm run type-check",
      });
    }

    if (this.metrics.quality.testCoverage < 70) {
      recommendations.push({
        category: "Testing",
        priority: "medium",
        issue: `Low test coverage (${this.metrics.quality.testCoverage}%)`,
        suggestion: "Increase test coverage for better reliability",
        action: "Add more unit and integration tests",
      });
    }

    this.recommendations = recommendations;
  }

  generateReport() {
    console.log(`\n${colors.cyan}📈 Development Insights Report${colors.reset}`);
    console.log("=".repeat(60));

    // Codebase Overview
    console.log(`\n${colors.blue}📂 Codebase Overview${colors.reset}`);
    const codebase = this.metrics.codebase;
    if (Object.keys(codebase).length > 0) {
      console.log(`   Total Files: ${colors.cyan}${codebase.totalFiles}${colors.reset}`);
      console.log(
        `   Total Lines: ${colors.cyan}${codebase.totalLines?.toLocaleString()}${colors.reset}`
      );
      console.log(`   Components: ${colors.cyan}${codebase.componentCount}${colors.reset}`);
      console.log(`   Custom Hooks: ${colors.cyan}${codebase.hookCount}${colors.reset}`);
      console.log(`   Avg File Size: ${colors.cyan}${codebase.avgFileSize} lines${colors.reset}`);

      if (codebase.largestFiles?.length > 0) {
        console.log(`\n   Largest Files:`);
        codebase.largestFiles.slice(0, 3).forEach((file, i) => {
          console.log(
            `   ${i + 1}. ${colors.gray}${file.path}${colors.reset} (${colors.yellow}${file.lines} lines${colors.reset})`
          );
        });
      }
    }

    // Dependencies Overview
    console.log(`\n${colors.blue}📦 Dependencies Overview${colors.reset}`);
    const deps = this.metrics.dependencies;
    if (Object.keys(deps).length > 0) {
      console.log(`   Production: ${colors.cyan}${deps.totalDependencies}${colors.reset}`);
      console.log(`   Development: ${colors.cyan}${deps.totalDevDependencies}${colors.reset}`);
      console.log(`   Outdated: ${colors.yellow}${deps.outdatedCount}${colors.reset}`);
      console.log(
        `   Vulnerabilities: ${deps.vulnerabilityCount > 0 ? colors.red : colors.green}${deps.vulnerabilityCount}${colors.reset}`
      );
    }

    // Performance Overview
    console.log(`\n${colors.blue}⚡ Performance Overview${colors.reset}`);
    const perf = this.metrics.performance;
    if (Object.keys(perf).length > 0) {
      console.log(
        `   Build Time: ${colors.cyan}${(perf.buildTime / 1000).toFixed(1)}s${colors.reset}`
      );
      console.log(
        `   Bundle Size: ${colors.cyan}${(perf.buildSize / 1024 / 1024).toFixed(1)}MB${colors.reset}`
      );

      if (perf.bundleAnalysis) {
        console.log(`   JS Files: ${colors.cyan}${perf.bundleAnalysis.jsFiles}${colors.reset}`);
        console.log(`   CSS Files: ${colors.cyan}${perf.bundleAnalysis.cssFiles}${colors.reset}`);
      }
    }

    // Quality Overview
    console.log(`\n${colors.blue}🏆 Quality Overview${colors.reset}`);
    const quality = this.metrics.quality;
    if (Object.keys(quality).length > 0) {
      console.log(
        `   ESLint Issues: ${quality.eslintIssues > 0 ? colors.yellow : colors.green}${quality.eslintIssues}${colors.reset}`
      );
      console.log(
        `   Type Errors: ${quality.typeErrors > 0 ? colors.red : colors.green}${quality.typeErrors}${colors.reset}`
      );
      console.log(`   Test Coverage: ${colors.cyan}${quality.testCoverage}%${colors.reset}`);
      console.log(
        `   Technical Debt: ${quality.technicalDebt === "high" ? colors.red : quality.technicalDebt === "medium" ? colors.yellow : colors.green}${quality.technicalDebt}${colors.reset}`
      );
    }

    // Recommendations
    if (this.recommendations?.length > 0) {
      console.log(`\n${colors.blue}💡 Recommendations${colors.reset}`);

      const priorityOrder = { high: 0, medium: 1, low: 2 };
      this.recommendations
        .sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])
        .slice(0, 5) // Show top 5 recommendations
        .forEach((rec, i) => {
          const priorityColor =
            rec.priority === "high"
              ? colors.red
              : rec.priority === "medium"
                ? colors.yellow
                : colors.green;

          console.log(
            `\n   ${i + 1}. ${priorityColor}[${rec.priority.toUpperCase()}]${colors.reset} ${rec.category}`
          );
          console.log(`      Issue: ${colors.gray}${rec.issue}${colors.reset}`);
          console.log(`      Action: ${colors.blue}${rec.action}${colors.reset}`);
        });
    }

    console.log(`\n${colors.green}✨ Pro Tips:${colors.reset}`);
    console.log(
      `   • Run ${colors.blue}npm run quality:comprehensive${colors.reset} for detailed quality analysis`
    );
    console.log(
      `   • Use ${colors.blue}npm run build:analyze${colors.reset} for bundle optimization`
    );
    console.log(
      `   • Check ${colors.blue}npm run dev:validate${colors.reset} regularly for environment health`
    );
    console.log(
      `   • Consider ${colors.blue}npm run test:coverage${colors.reset} to improve test coverage`
    );

    console.log("\n" + "=".repeat(60));
  }
}

async function main() {
  const args = process.argv.slice(2);
  const insights = new DevInsights();

  if (args.includes("--help") || args.includes("-h")) {
    console.log(`
${colors.cyan}📊 Development Insights${colors.reset}

Generate comprehensive development analytics and recommendations.

Usage:
  npm run dev:insights          # Generate full insights report
  node scripts/dev-insights.js  # Direct execution

Features:
  • Codebase structure analysis
  • Dependency health check
  • Build performance metrics
  • Code quality assessment
  • Actionable recommendations

${colors.blue}Pro Tip:${colors.reset} Run this weekly to track project health trends.
    `);
    return;
  }

  await insights.generateInsights();
}

main().catch(error => {
  console.error(`${colors.red}Insights generation failed:${colors.reset}`, error);
  process.exit(1);
});
