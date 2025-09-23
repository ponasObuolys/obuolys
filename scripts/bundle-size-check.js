#!/usr/bin/env node

/**
 * Bundle size checker script
 * Ensures bundle sizes stay within acceptable limits
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const BUNDLE_SIZE_LIMITS = {
  // Main bundle size limits (in bytes)
  'index': 512 * 1024, // 512KB
  'vendor': 1024 * 1024, // 1MB

  // Chunk size limits
  'admin-chunk': 256 * 1024, // 256KB
  'auth-chunk': 128 * 1024, // 128KB
  'content-chunk': 256 * 1024, // 256KB

  // Asset limits
  'css': 64 * 1024, // 64KB total CSS
  'images': 2 * 1024 * 1024, // 2MB total images
};

const PERFORMANCE_BUDGETS = {
  totalJavaScript: 1.5 * 1024 * 1024, // 1.5MB
  totalCSS: 100 * 1024, // 100KB
  totalImages: 3 * 1024 * 1024, // 3MB
  totalFonts: 200 * 1024, // 200KB
};

function getFileSize(filePath) {
  try {
    return fs.statSync(filePath).size;
  } catch {
    return 0;
  }
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function analyzeDistFolder() {
  const distPath = path.join(process.cwd(), 'dist');

  if (!fs.existsSync(distPath)) {
    console.error('❌ Dist folder not found. Run build first.');
    process.exit(1);
  }

  const analysis = {
    bundles: {},
    assets: {
      css: [],
      images: [],
      fonts: [],
      other: []
    },
    totals: {
      javascript: 0,
      css: 0,
      images: 0,
      fonts: 0,
      total: 0
    }
  };

  function scanDirectory(dir, relativePath = '') {
    const items = fs.readdirSync(dir);

    for (const item of items) {
      const fullPath = path.join(dir, item);
      const relativeFilePath = path.join(relativePath, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        scanDirectory(fullPath, relativeFilePath);
      } else {
        const ext = path.extname(item).toLowerCase();
        const size = stat.size;
        analysis.totals.total += size;

        if (ext === '.js') {
          analysis.totals.javascript += size;

          // Categorize JavaScript bundles
          if (item.includes('index-')) {
            analysis.bundles.index = (analysis.bundles.index || 0) + size;
          } else if (item.includes('vendor')) {
            analysis.bundles.vendor = (analysis.bundles.vendor || 0) + size;
          } else if (item.includes('admin')) {
            analysis.bundles['admin-chunk'] = (analysis.bundles['admin-chunk'] || 0) + size;
          } else if (item.includes('auth')) {
            analysis.bundles['auth-chunk'] = (analysis.bundles['auth-chunk'] || 0) + size;
          } else if (item.includes('content')) {
            analysis.bundles['content-chunk'] = (analysis.bundles['content-chunk'] || 0) + size;
          }
        } else if (ext === '.css') {
          analysis.totals.css += size;
          analysis.assets.css.push({ file: relativeFilePath, size });
        } else if (['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp'].includes(ext)) {
          analysis.totals.images += size;
          analysis.assets.images.push({ file: relativeFilePath, size });
        } else if (['.woff', '.woff2', '.ttf', '.otf'].includes(ext)) {
          analysis.totals.fonts += size;
          analysis.assets.fonts.push({ file: relativeFilePath, size });
        } else {
          analysis.assets.other.push({ file: relativeFilePath, size });
        }
      }
    }
  }

  scanDirectory(distPath);
  return analysis;
}

function checkBundleSizes(analysis) {
  console.log('\n📦 Bundle Size Analysis:');
  console.log('================================');

  let passed = true;

  for (const [bundleName, limit] of Object.entries(BUNDLE_SIZE_LIMITS)) {
    if (['css', 'images'].includes(bundleName)) continue; // Handled separately

    const actualSize = analysis.bundles[bundleName] || 0;
    const status = actualSize <= limit ? '✅' : '❌';
    const percentage = ((actualSize / limit) * 100).toFixed(1);

    console.log(
      `${status} ${bundleName.padEnd(15)}: ${formatBytes(actualSize).padEnd(10)} / ${formatBytes(limit)} (${percentage}%)`
    );

    if (actualSize > limit) {
      passed = false;
      console.log(`   ⚠️  Exceeds limit by ${formatBytes(actualSize - limit)}`);
    }
  }

  return passed;
}

function checkPerformanceBudgets(analysis) {
  console.log('\n🎯 Performance Budget Analysis:');
  console.log('================================');

  let passed = true;

  for (const [category, limit] of Object.entries(PERFORMANCE_BUDGETS)) {
    const categoryKey = category.replace('total', '').toLowerCase();
    const actualSize = analysis.totals[categoryKey] || 0;
    const status = actualSize <= limit ? '✅' : '❌';
    const percentage = ((actualSize / limit) * 100).toFixed(1);

    console.log(
      `${status} ${category.padEnd(15)}: ${formatBytes(actualSize).padEnd(10)} / ${formatBytes(limit)} (${percentage}%)`
    );

    if (actualSize > limit) {
      passed = false;
      console.log(`   ⚠️  Exceeds budget by ${formatBytes(actualSize - limit)}`);
    }
  }

  return passed;
}

function findLargestAssets(analysis) {
  console.log('\n🔍 Largest Assets:');
  console.log('================================');

  const allAssets = [
    ...analysis.assets.css.map(a => ({ ...a, type: 'CSS' })),
    ...analysis.assets.images.map(a => ({ ...a, type: 'Image' })),
    ...analysis.assets.fonts.map(a => ({ ...a, type: 'Font' })),
    ...analysis.assets.other.map(a => ({ ...a, type: 'Other' }))
  ];

  // Sort by size descending and take top 10
  const largestAssets = allAssets
    .sort((a, b) => b.size - a.size)
    .slice(0, 10);

  largestAssets.forEach((asset, index) => {
    console.log(
      `${(index + 1).toString().padStart(2)}. ${asset.file.padEnd(40)} ${formatBytes(asset.size).padStart(10)} (${asset.type})`
    );
  });
}

function generateBundleReport(analysis) {
  const timestamp = new Date().toISOString();

  const report = {
    timestamp,
    analysis,
    limits: BUNDLE_SIZE_LIMITS,
    budgets: PERFORMANCE_BUDGETS,
    summary: {
      totalSize: analysis.totals.total,
      bundleCount: Object.keys(analysis.bundles).length,
      assetCount: Object.values(analysis.assets).flat().length,
      withinLimits: true
    }
  };

  // Check if within limits
  for (const [bundleName, limit] of Object.entries(BUNDLE_SIZE_LIMITS)) {
    if (['css', 'images'].includes(bundleName)) continue;
    if ((analysis.bundles[bundleName] || 0) > limit) {
      report.summary.withinLimits = false;
      break;
    }
  }

  // Save report
  const reportsDir = path.join(process.cwd(), 'dist', 'reports');
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }

  const reportPath = path.join(reportsDir, `bundle-analysis-${Date.now()}.json`);
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

  console.log(`\n📄 Bundle analysis saved: ${reportPath}`);
  return report;
}

function main() {
  console.log('📊 Running Bundle Size Analysis...\n');

  try {
    const analysis = analyzeDistFolder();

    console.log(`📈 Total Build Size: ${formatBytes(analysis.totals.total)}`);

    const bundlesPassed = checkBundleSizes(analysis);
    const budgetsPassed = checkPerformanceBudgets(analysis);

    findLargestAssets(analysis);

    const report = generateBundleReport(analysis);

    console.log('\n🏁 Bundle Analysis Summary:');
    console.log('================================');
    console.log(`Bundle size limits: ${bundlesPassed ? '✅ PASSED' : '❌ FAILED'}`);
    console.log(`Performance budgets: ${budgetsPassed ? '✅ PASSED' : '❌ FAILED'}`);
    console.log(`Total size: ${formatBytes(analysis.totals.total)}`);

    if (!bundlesPassed || !budgetsPassed) {
      console.log('\n❌ Bundle size checks FAILED');
      console.log('Consider:');
      console.log('- Code splitting large components');
      console.log('- Removing unused dependencies');
      console.log('- Optimizing images and assets');
      console.log('- Using dynamic imports for routes');
      process.exit(1);
    }

    console.log('\n✅ All bundle size checks PASSED');

  } catch (error) {
    console.error('❌ Error running bundle analysis:', error.message);
    process.exit(1);
  }
}

main();