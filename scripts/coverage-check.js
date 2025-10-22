#!/usr/bin/env node

/**
 * Coverage threshold checker script
 * Ensures code coverage meets minimum requirements
 */

import fs from "fs";
import path from "path";

const COVERAGE_THRESHOLDS = {
  statements: 80,
  branches: 80,
  functions: 80,
  lines: 80,
};

const CRITICAL_FILES_THRESHOLD = {
  statements: 90,
  branches: 85,
  functions: 90,
  lines: 90,
};

// Files that require higher coverage
const CRITICAL_FILES = [
  "src/context/AuthContext.tsx",
  "src/integrations/supabase/client.ts",
  "src/components/admin/*.tsx",
  "src/hooks/*.ts",
];

function readCoverageReport() {
  const coveragePath = path.join(process.cwd(), "coverage", "coverage-summary.json");

  if (!fs.existsSync(coveragePath)) {
    console.error("❌ Coverage report not found. Run tests with coverage first.");
    process.exit(1);
  }

  return JSON.parse(fs.readFileSync(coveragePath, "utf8"));
}

function checkGlobalCoverage(coverage) {
  const total = coverage.total;
  let passed = true;

  console.log("\n📊 Global Coverage Report:");
  console.log("================================");

  for (const [metric, threshold] of Object.entries(COVERAGE_THRESHOLDS)) {
    const actual = total[metric].pct;
    const status = actual >= threshold ? "✅" : "❌";

    console.log(`${status} ${metric.padEnd(12)}: ${actual.toFixed(1)}% (required: ${threshold}%)`);

    if (actual < threshold) {
      passed = false;
    }
  }

  return passed;
}

function checkCriticalFilesCoverage(coverage) {
  console.log("\n🎯 Critical Files Coverage:");
  console.log("================================");

  let passed = true;
  let criticalFilesFound = 0;

  for (const [filePath, fileCoverage] of Object.entries(coverage)) {
    if (filePath === "total") continue;

    const isCritical = CRITICAL_FILES.some(pattern => {
      const regex = new RegExp(pattern.replace(/\*/g, ".*"));
      return regex.test(filePath);
    });

    if (isCritical) {
      criticalFilesFound++;
      console.log(`\n📁 ${filePath}:`);

      for (const [metric, threshold] of Object.entries(CRITICAL_FILES_THRESHOLD)) {
        const actual = fileCoverage[metric].pct;
        const status = actual >= threshold ? "✅" : "❌";

        console.log(
          `   ${status} ${metric.padEnd(12)}: ${actual.toFixed(1)}% (required: ${threshold}%)`
        );

        if (actual < threshold) {
          passed = false;
        }
      }
    }
  }

  if (criticalFilesFound === 0) {
    console.log("⚠️  No critical files found in coverage report");
  }

  return passed;
}

function checkUncoveredLines(coverage) {
  console.log("\n🔍 Files with Low Coverage:");
  console.log("================================");

  const lowCoverageFiles = [];

  for (const [filePath, fileCoverage] of Object.entries(coverage)) {
    if (filePath === "total") continue;

    const linesCoverage = fileCoverage.lines.pct;
    if (linesCoverage < 60) {
      lowCoverageFiles.push({
        file: filePath,
        coverage: linesCoverage,
        uncoveredLines: fileCoverage.lines.total - fileCoverage.lines.covered,
      });
    }
  }

  if (lowCoverageFiles.length === 0) {
    console.log("✅ No files with critically low coverage");
    return true;
  }

  lowCoverageFiles
    .sort((a, b) => a.coverage - b.coverage)
    .forEach(({ file, coverage, uncoveredLines }) => {
      console.log(`❌ ${file}: ${coverage.toFixed(1)}% (${uncoveredLines} uncovered lines)`);
    });

  return false;
}

function generateCoverageReport(coverage) {
  const total = coverage.total;
  const timestamp = new Date().toISOString();

  const report = {
    timestamp,
    summary: {
      statements: total.statements.pct,
      branches: total.branches.pct,
      functions: total.functions.pct,
      lines: total.lines.pct,
    },
    thresholds: COVERAGE_THRESHOLDS,
    passed: true,
  };

  // Check if all thresholds are met
  for (const [metric, threshold] of Object.entries(COVERAGE_THRESHOLDS)) {
    if (total[metric].pct < threshold) {
      report.passed = false;
      break;
    }
  }

  // Save report
  const reportsDir = path.join(process.cwd(), "coverage", "reports");
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }

  const reportPath = path.join(reportsDir, `coverage-${Date.now()}.json`);
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

  console.log(`\n📄 Coverage report saved: ${reportPath}`);
  return report;
}

function main() {
  console.log("🧪 Running Coverage Quality Gates...\n");

  try {
    const coverage = readCoverageReport();

    const globalPassed = checkGlobalCoverage(coverage);
    const criticalPassed = checkCriticalFilesCoverage(coverage);
    const lowCoveragePassed = checkUncoveredLines(coverage);

    const report = generateCoverageReport(coverage);

    console.log("\n🏁 Coverage Summary:");
    console.log("================================");
    console.log(`Global thresholds: ${globalPassed ? "✅ PASSED" : "❌ FAILED"}`);
    console.log(`Critical files: ${criticalPassed ? "✅ PASSED" : "❌ FAILED"}`);
    console.log(`Low coverage check: ${lowCoveragePassed ? "✅ PASSED" : "⚠️  WARNING"}`);

    if (!globalPassed || !criticalPassed) {
      console.log("\n❌ Coverage quality gates FAILED");
      console.log("Please improve test coverage before merging.");
      process.exit(1);
    }

    console.log("\n✅ All coverage quality gates PASSED");
  } catch (error) {
    console.error("❌ Error running coverage checks:", error.message);
    process.exit(1);
  }
}

main();
