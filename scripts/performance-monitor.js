#!/usr/bin/env node

import { execSync } from "child_process";
import { existsSync, readFileSync, writeFileSync, readdirSync, statSync } from "fs";
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
  header: msg => console.log(`${colors.cyan}${colors.bold}${msg}${colors.reset}`),
  detail: msg => console.log(`${colors.gray}   ${msg}${colors.reset}`),
};

class PerformanceMonitor {
  constructor() {
    this.metrics = {
      build: {},
      bundle: {},
      dependencies: {},
      code: {},
      recommendations: [],
    };
  }

  async analyzeBuildPerformance() {
    log.header("🏗️  Build Performance Analysis");

    try {
      const startTime = Date.now();

      // Clean build
      if (existsSync(join(projectRoot, "dist"))) {
        execSync("rm -rf dist", { cwd: projectRoot, stdio: "pipe" });
      }

      log.info("Running production build...");
      execSync("npm run build", {
        cwd: projectRoot,
        stdio: "pipe",
        encoding: "utf8",
      });

      const buildTime = Date.now() - startTime;
      this.metrics.build.time = buildTime;

      if (buildTime < 30000) {
        // 30 seconds
        log.success(`Build time: ${(buildTime / 1000).toFixed(1)}s (fast)`);
      } else if (buildTime < 60000) {
        // 1 minute
        log.warning(`Build time: ${(buildTime / 1000).toFixed(1)}s (moderate)`);
      } else {
        log.error(`Build time: ${(buildTime / 1000).toFixed(1)}s (slow)`);
        this.metrics.recommendations.push("Build time is slow - consider optimization");
      }
    } catch (error) {
      log.error("Build performance analysis failed");
      this.metrics.build.error = error.message;
    }
  }

  async analyzeBundleSize() {
    log.header("📦 Bundle Size Analysis");

    const distPath = join(projectRoot, "dist");
    if (!existsSync(distPath)) {
      log.warning("No build found - run npm run build first");
      return;
    }

    const bundleAnalysis = this.analyzeBundleDirectory(distPath);
    this.metrics.bundle = bundleAnalysis;

    // JavaScript bundles
    const jsFiles = bundleAnalysis.files.filter(f => f.ext === ".js");
    const totalJSSize = jsFiles.reduce((sum, f) => sum + f.size, 0);
    const totalJSSizeMB = (totalJSSize / 1024 / 1024).toFixed(2);

    if (totalJSSize < 500 * 1024) {
      // 500KB
      log.success(`JavaScript size: ${totalJSSizeMB}MB (excellent)`);
    } else if (totalJSSize < 1024 * 1024) {
      // 1MB
      log.info(`JavaScript size: ${totalJSSizeMB}MB (good)`);
    } else if (totalJSSize < 2 * 1024 * 1024) {
      // 2MB
      log.warning(`JavaScript size: ${totalJSSizeMB}MB (consider optimization)`);
    } else {
      log.error(`JavaScript size: ${totalJSSizeMB}MB (needs optimization)`);
      this.metrics.recommendations.push("JavaScript bundle is large - review chunk splitting");
    }

    // CSS bundles
    const cssFiles = bundleAnalysis.files.filter(f => f.ext === ".css");
    const totalCSSSize = cssFiles.reduce((sum, f) => sum + f.size, 0);
    const totalCSSSizeKB = (totalCSSSize / 1024).toFixed(0);

    if (totalCSSSize < 100 * 1024) {
      // 100KB
      log.success(`CSS size: ${totalCSSSizeKB}KB (excellent)`);
    } else if (totalCSSSize < 300 * 1024) {
      // 300KB
      log.info(`CSS size: ${totalCSSSizeKB}KB (good)`);
    } else {
      log.warning(`CSS size: ${totalCSSSizeKB}KB (consider optimization)`);
      this.metrics.recommendations.push("CSS bundle is large - review unused styles");
    }

    // Largest files analysis
    const largestFiles = bundleAnalysis.files.sort((a, b) => b.size - a.size).slice(0, 5);

    log.info("Largest bundle files:");
    largestFiles.forEach(file => {
      const sizeKB = (file.size / 1024).toFixed(0);
      log.detail(`${file.name}: ${sizeKB}KB`);
    });

    // Chunk analysis
    const chunks = jsFiles.filter(f => f.name.includes("-"));
    if (chunks.length > 1) {
      log.success(`Code splitting: ${chunks.length} chunks detected`);
    } else {
      log.warning("Code splitting: Limited chunking detected");
      this.metrics.recommendations.push("Implement more aggressive code splitting");
    }
  }

  analyzeBundleDirectory(dirPath, prefix = "") {
    const result = {
      totalSize: 0,
      files: [],
      directories: [],
    };

    const items = readdirSync(dirPath);

    for (const item of items) {
      const itemPath = join(dirPath, item);
      const stats = statSync(itemPath);
      const fullName = prefix ? `${prefix}/${item}` : item;

      if (stats.isDirectory()) {
        const subAnalysis = this.analyzeBundleDirectory(itemPath, fullName);
        result.totalSize += subAnalysis.totalSize;
        result.files.push(...subAnalysis.files);
        result.directories.push({
          name: fullName,
          size: subAnalysis.totalSize,
        });
      } else {
        const fileInfo = {
          name: fullName,
          size: stats.size,
          ext: extname(item),
        };
        result.files.push(fileInfo);
        result.totalSize += stats.size;
      }
    }

    return result;
  }

  async analyzeDependencyImpact() {
    log.header("📚 Dependency Impact Analysis");

    try {
      // Analyze package.json for heavy dependencies
      const packageJson = JSON.parse(readFileSync(join(projectRoot, "package.json"), "utf8"));
      const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };

      // Known heavy packages
      const heavyPackages = {
        "@radix-ui": "UI components (multiple packages)",
        recharts: "Charts library",
        "react-image-crop": "Image processing",
        playwright: "Testing framework",
        winston: "Logging library",
      };

      const foundHeavy = [];
      Object.keys(dependencies).forEach(dep => {
        Object.keys(heavyPackages).forEach(heavy => {
          if (dep.includes(heavy)) {
            foundHeavy.push({ name: dep, description: heavyPackages[heavy] });
          }
        });
      });

      if (foundHeavy.length > 0) {
        log.info("Heavy dependencies detected:");
        foundHeavy.forEach(pkg => {
          log.detail(`${pkg.name}: ${pkg.description}`);
        });

        if (foundHeavy.length > 5) {
          this.metrics.recommendations.push("Many heavy dependencies - consider lazy loading");
        }
      }

      this.metrics.dependencies = {
        total: Object.keys(dependencies).length,
        heavy: foundHeavy.length,
      };
    } catch (error) {
      log.error("Dependency analysis failed");
    }
  }

  async analyzeCodeComplexity() {
    log.header("🧠 Code Complexity Analysis");

    const srcPath = join(projectRoot, "src");
    if (!existsSync(srcPath)) {
      log.warning("Source directory not found");
      return;
    }

    const analysis = this.analyzeDirectory(srcPath);
    this.metrics.code = analysis;

    const avgFileSize = analysis.totalSize / analysis.fileCount;
    const avgFileSizeKB = (avgFileSize / 1024).toFixed(1);

    log.info(`Total files: ${analysis.fileCount}`);
    log.info(`Total size: ${(analysis.totalSize / 1024).toFixed(0)}KB`);
    log.info(`Average file size: ${avgFileSizeKB}KB`);

    // File size warnings
    if (avgFileSize > 5 * 1024) {
      // 5KB average
      log.warning("Average file size is large - consider splitting components");
      this.metrics.recommendations.push("Split large components/files");
    }

    // Large files analysis
    const largeFiles = analysis.files
      .filter(f => f.size > 10 * 1024) // Files larger than 10KB
      .sort((a, b) => b.size - a.size)
      .slice(0, 5);

    if (largeFiles.length > 0) {
      log.warning("Large files detected:");
      largeFiles.forEach(file => {
        const sizeKB = (file.size / 1024).toFixed(1);
        log.detail(`${file.path}: ${sizeKB}KB`);
      });
    }

    // Directory analysis
    const largestDirs = analysis.directories.sort((a, b) => b.size - a.size).slice(0, 3);

    log.info("Largest directories:");
    largestDirs.forEach(dir => {
      const sizeMB = (dir.size / 1024 / 1024).toFixed(1);
      log.detail(`${dir.name}: ${sizeMB}MB`);
    });
  }

  analyzeDirectory(dirPath, basePath = "") {
    const result = {
      totalSize: 0,
      fileCount: 0,
      files: [],
      directories: [],
    };

    const items = readdirSync(dirPath);

    for (const item of items) {
      const itemPath = join(dirPath, item);
      const stats = statSync(itemPath);
      const relativePath = basePath ? `${basePath}/${item}` : item;

      if (stats.isDirectory()) {
        if (!["node_modules", ".git", "dist", "build"].includes(item)) {
          const subAnalysis = this.analyzeDirectory(itemPath, relativePath);
          result.totalSize += subAnalysis.totalSize;
          result.fileCount += subAnalysis.fileCount;
          result.files.push(...subAnalysis.files);
          result.directories.push({
            name: relativePath,
            size: subAnalysis.totalSize,
            files: subAnalysis.fileCount,
          });
        }
      } else if ([".ts", ".tsx", ".js", ".jsx", ".css"].includes(extname(item))) {
        result.files.push({
          path: relativePath,
          size: stats.size,
          ext: extname(item),
        });
        result.totalSize += stats.size;
        result.fileCount++;
      }
    }

    return result;
  }

  generateOptimizationReport() {
    log.header("📊 Performance Report");

    const report = {
      timestamp: new Date().toISOString(),
      metrics: this.metrics,
      summary: {
        buildTime: this.metrics.build.time || 0,
        bundleSize: this.metrics.bundle.totalSize || 0,
        recommendationCount: this.metrics.recommendations.length,
      },
    };

    // Save detailed report
    const reportPath = join(projectRoot, "performance-report.json");
    writeFileSync(reportPath, JSON.stringify(report, null, 2));
    log.success("Performance report saved to: performance-report.json");

    // Generate summary
    console.log("\n" + "=".repeat(60));
    console.log(colors.cyan + colors.bold + "📋 PERFORMANCE SUMMARY" + colors.reset);
    console.log("=".repeat(60));

    // Build performance
    if (this.metrics.build.time) {
      const buildScore =
        this.metrics.build.time < 30000
          ? "Excellent"
          : this.metrics.build.time < 60000
            ? "Good"
            : "Needs Improvement";
      console.log(`Build Time: ${(this.metrics.build.time / 1000).toFixed(1)}s (${buildScore})`);
    }

    // Bundle performance
    if (this.metrics.bundle.totalSize) {
      const bundleSizeMB = (this.metrics.bundle.totalSize / 1024 / 1024).toFixed(2);
      const bundleScore =
        this.metrics.bundle.totalSize < 2 * 1024 * 1024
          ? "Excellent"
          : this.metrics.bundle.totalSize < 5 * 1024 * 1024
            ? "Good"
            : "Needs Optimization";
      console.log(`Bundle Size: ${bundleSizeMB}MB (${bundleScore})`);
    }

    // Recommendations
    if (this.metrics.recommendations.length > 0) {
      console.log("\n" + colors.yellow + "💡 OPTIMIZATION RECOMMENDATIONS:" + colors.reset);
      this.metrics.recommendations.forEach((rec, index) => {
        console.log(`${index + 1}. ${rec}`);
      });
    } else {
      console.log(
        "\n" +
          colors.green +
          "🎉 No optimization recommendations - performance looks good!" +
          colors.reset
      );
    }

    // Quick actions
    console.log("\n" + colors.blue + "🚀 QUICK ACTIONS:" + colors.reset);
    console.log("• Bundle analysis: npm run build:analyze");
    console.log("• Dependency audit: npm run quality:comprehensive");
    console.log("• Size monitoring: npm run bundle-size:check");
    console.log("• Performance testing: npm run test:e2e");

    return report;
  }
}

async function main() {
  const args = process.argv.slice(2);
  const monitor = new PerformanceMonitor();

  console.log(colors.cyan + colors.bold + "⚡ Performance Monitor" + colors.reset + "\n");

  if (args.includes("--quick")) {
    // Quick bundle analysis only
    await monitor.analyzeBundleSize();
    return;
  }

  if (args.includes("--build-only")) {
    await monitor.analyzeBuildPerformance();
    return;
  }

  // Full performance analysis
  await monitor.analyzeBuildPerformance();
  console.log();

  await monitor.analyzeBundleSize();
  console.log();

  await monitor.analyzeDependencyImpact();
  console.log();

  await monitor.analyzeCodeComplexity();
  console.log();

  monitor.generateOptimizationReport();

  console.log(
    colors.gray +
      "\n💡 Tip: Use --quick for bundle analysis only or --build-only for build performance" +
      colors.reset
  );
}

// Handle command line execution
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    log.error("Performance monitoring failed:");
    console.error(error);
    process.exit(1);
  });
}
