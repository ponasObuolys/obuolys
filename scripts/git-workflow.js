#!/usr/bin/env node

import { execSync, exec } from "child_process";
import { promisify } from "util";
import { writeFileSync, existsSync } from "fs";
import { join } from "path";
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
  magenta: "\x1b[35m",
  reset: "\x1b[0m",
  bold: "\x1b[1m",
};

const log = {
  success: msg => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  warning: msg => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  error: msg => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  info: msg => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
  header: msg => console.log(`${colors.cyan}${colors.bold}${msg}${colors.reset}`),
};

class GitWorkflowHelper {
  constructor() {
    this.currentBranch = "";
    this.hasChanges = false;
    this.remoteStatus = "";
  }

  async getGitStatus() {
    try {
      this.currentBranch = execSync("git branch --show-current", {
        cwd: projectRoot,
        encoding: "utf8",
      }).trim();

      const status = execSync("git status --porcelain", {
        cwd: projectRoot,
        encoding: "utf8",
      });

      this.hasChanges = status.length > 0;

      // Check remote status
      try {
        execSync("git fetch", { cwd: projectRoot, stdio: "pipe" });
        const ahead = execSync("git rev-list --count HEAD..@{u}", {
          cwd: projectRoot,
          encoding: "utf8",
        }).trim();
        const behind = execSync("git rev-list --count @{u}..HEAD", {
          cwd: projectRoot,
          encoding: "utf8",
        }).trim();

        if (ahead === "0" && behind === "0") {
          this.remoteStatus = "up-to-date";
        } else if (ahead > 0 && behind === "0") {
          this.remoteStatus = `${ahead} commits behind`;
        } else if (ahead === "0" && behind > 0) {
          this.remoteStatus = `${behind} commits ahead`;
        } else {
          this.remoteStatus = `${behind} ahead, ${ahead} behind (diverged)`;
        }
      } catch (error) {
        this.remoteStatus = "no remote tracking";
      }
    } catch (error) {
      log.error("Failed to get git status - not a git repository?");
      process.exit(1);
    }
  }

  displayStatus() {
    log.header("📊 Git Status");
    log.info(`Current branch: ${this.currentBranch}`);
    log.info(`Remote status: ${this.remoteStatus}`);
    log.info(`Local changes: ${this.hasChanges ? "Yes" : "No"}`);
  }

  async createFeatureBranch() {
    const args = process.argv.slice(3);
    if (args.length === 0) {
      log.error("Please provide a branch name: npm run git:feature <branch-name>");
      return;
    }

    const branchName = args[0];
    const fullBranchName = branchName.startsWith("feature/") ? branchName : `feature/${branchName}`;

    try {
      // Ensure we're on main and up to date
      if (this.currentBranch !== "main") {
        log.info("Switching to main branch...");
        execSync("git checkout main", { cwd: projectRoot, stdio: "inherit" });
      }

      log.info("Pulling latest changes...");
      execSync("git pull origin main", { cwd: projectRoot, stdio: "inherit" });

      log.info(`Creating and switching to branch: ${fullBranchName}`);
      execSync(`git checkout -b ${fullBranchName}`, { cwd: projectRoot, stdio: "inherit" });

      log.success(`Feature branch ${fullBranchName} created successfully!`);
      log.info("You can now start working on your feature.");
    } catch (error) {
      log.error("Failed to create feature branch");
      console.error(error.message);
    }
  }

  async smartCommit() {
    const args = process.argv.slice(3);

    if (!this.hasChanges) {
      log.warning("No changes to commit");
      return;
    }

    // Check for staged changes
    const staged = execSync("git diff --cached --name-only", {
      cwd: projectRoot,
      encoding: "utf8",
    }).trim();

    if (!staged) {
      log.info("No staged changes - staging all changes...");
      execSync("git add .", { cwd: projectRoot, stdio: "inherit" });
    }

    // Generate commit message if not provided
    let commitMessage = args.join(" ");

    if (!commitMessage) {
      commitMessage = await this.generateCommitMessage();
    }

    try {
      log.info("Running pre-commit checks...");
      execSync("npm run quality-fix", { cwd: projectRoot, stdio: "inherit" });

      log.info(`Committing with message: "${commitMessage}"`);
      execSync(`git commit -m "${commitMessage}"`, { cwd: projectRoot, stdio: "inherit" });

      log.success("Commit created successfully!");

      // Ask if user wants to push
      if (this.currentBranch !== "main") {
        log.info("Would you like to push this branch? (y/n)");
        // In a real CLI tool, you'd use readline here
        // For now, just show the command
        log.info(`To push: git push -u origin ${this.currentBranch}`);
      }
    } catch (error) {
      log.error("Commit failed - please fix issues and try again");
    }
  }

  async generateCommitMessage() {
    try {
      // Analyze changed files to suggest commit type
      const changedFiles = execSync("git diff --cached --name-only", {
        cwd: projectRoot,
        encoding: "utf8",
      })
        .split("\n")
        .filter(f => f);

      const hasComponents = changedFiles.some(f => f.includes("components/"));
      const hasStyles = changedFiles.some(f => f.includes(".css") || f.includes("tailwind"));
      const hasTests = changedFiles.some(f => f.includes(".test.") || f.includes(".spec."));
      const hasConfig = changedFiles.some(f => f.includes("config") || f.includes(".json"));
      const hasDocs = changedFiles.some(f => f.includes(".md") || f.includes("docs/"));

      let type = "feat";
      let scope = "";
      let description = "update code";

      // Determine commit type
      if (hasTests && !hasComponents) {
        type = "test";
        description = "add/update tests";
      } else if (hasConfig && !hasComponents) {
        type = "config";
        description = "update configuration";
      } else if (hasDocs && !hasComponents) {
        type = "docs";
        description = "update documentation";
      } else if (hasStyles) {
        type = "style";
        description = "update styles";
      } else if (hasComponents) {
        type = "feat";
        description = "add/update components";
      }

      // Determine scope from most common directory
      const directories = changedFiles
        .map(f => f.split("/")[1] || f.split("/")[0])
        .filter(d => d && d !== "src");

      const dirCounts = {};
      directories.forEach(dir => {
        dirCounts[dir] = (dirCounts[dir] || 0) + 1;
      });

      const mostCommonDir = Object.keys(dirCounts).sort((a, b) => dirCounts[b] - dirCounts[a])[0];
      if (mostCommonDir && !["index", "App"].includes(mostCommonDir)) {
        scope = mostCommonDir;
      }

      const message = scope ? `${type}(${scope}): ${description}` : `${type}: ${description}`;

      log.info(`Generated commit message: "${message}"`);
      log.info("Press Enter to use this message, or type a custom one:");

      return message;
    } catch (error) {
      return "feat: update code";
    }
  }

  async cleanupBranches() {
    try {
      log.header("🧹 Cleaning up merged branches");

      // Get merged branches
      const mergedBranches = execSync("git branch --merged main", {
        cwd: projectRoot,
        encoding: "utf8",
      })
        .split("\n")
        .map(b => b.trim())
        .filter(b => b && !b.includes("*") && b !== "main");

      if (mergedBranches.length === 0) {
        log.success("No merged branches to clean up");
        return;
      }

      log.info(`Found ${mergedBranches.length} merged branches:`);
      mergedBranches.forEach(branch => log.info(`  • ${branch}`));

      log.warning("Deleting merged branches...");
      mergedBranches.forEach(branch => {
        try {
          execSync(`git branch -d ${branch}`, { cwd: projectRoot, stdio: "pipe" });
          log.success(`Deleted: ${branch}`);
        } catch (error) {
          log.warning(`Could not delete: ${branch}`);
        }
      });

      log.success("Branch cleanup completed");
    } catch (error) {
      log.error("Branch cleanup failed");
      console.error(error.message);
    }
  }

  async createRelease() {
    const args = process.argv.slice(3);
    const version = args[0];

    if (!version) {
      log.error("Please provide a version: npm run git:release <version>");
      log.info("Example: npm run git:release 1.2.0");
      return;
    }

    try {
      // Ensure we're on main and clean
      if (this.currentBranch !== "main") {
        log.error("Must be on main branch to create release");
        return;
      }

      if (this.hasChanges) {
        log.error("Must have clean working directory to create release");
        return;
      }

      log.info("Running comprehensive quality checks...");
      execSync("npm run quality:comprehensive", { cwd: projectRoot, stdio: "inherit" });

      log.info("Running full test suite...");
      execSync("npm run test:all", { cwd: projectRoot, stdio: "inherit" });

      log.info("Building production version...");
      execSync("npm run build:prod", { cwd: projectRoot, stdio: "inherit" });

      log.info(`Creating git tag: v${version}`);
      execSync(`git tag -a v${version} -m "Release v${version}"`, {
        cwd: projectRoot,
        stdio: "inherit",
      });

      log.info("Pushing tag to remote...");
      execSync(`git push origin v${version}`, { cwd: projectRoot, stdio: "inherit" });

      // Generate changelog entry
      const changelog = await this.generateChangelogEntry(version);
      log.info("Changelog entry generated");

      log.success(`Release v${version} created successfully!`);
      log.info("🚀 The release tag has been pushed to the repository");
    } catch (error) {
      log.error("Release creation failed");
      console.error(error.message);
    }
  }

  async generateChangelogEntry(version) {
    try {
      // Get commits since last tag
      const lastTag = execSync("git describe --tags --abbrev=0", {
        cwd: projectRoot,
        encoding: "utf8",
      }).trim();

      const commits = execSync(`git log ${lastTag}..HEAD --pretty=format:"%s"`, {
        cwd: projectRoot,
        encoding: "utf8",
      })
        .split("\n")
        .filter(c => c);

      const changelogEntry = `
## [${version}] - ${new Date().toISOString().split("T")[0]}

### Changes
${commits.map(commit => `- ${commit}`).join("\n")}

`;

      // Append to CHANGELOG.md if it exists
      const changelogPath = join(projectRoot, "CHANGELOG.md");
      if (existsSync(changelogPath)) {
        const currentChangelog = execSync(`cat ${changelogPath}`, {
          cwd: projectRoot,
          encoding: "utf8",
        });
        const newChangelog = changelogEntry + currentChangelog;
        writeFileSync(changelogPath, newChangelog);
        log.success("CHANGELOG.md updated");
      }

      return changelogEntry;
    } catch (error) {
      log.warning("Could not generate changelog entry");
      return "";
    }
  }

  async showHelp() {
    log.header("🎯 Git Workflow Helper");

    console.log("\nAvailable commands:");
    console.log("  npm run git:status        - Show detailed git status");
    console.log("  npm run git:feature <name> - Create new feature branch");
    console.log("  npm run git:commit [msg]   - Smart commit with quality checks");
    console.log("  npm run git:cleanup        - Remove merged branches");
    console.log("  npm run git:release <ver>  - Create tagged release");
    console.log("  npm run git:help          - Show this help");

    console.log("\nWorkflow examples:");
    console.log("  npm run git:feature auth-system    # Creates feature/auth-system");
    console.log('  npm run git:commit "feat: add login" # Commit with message');
    console.log("  npm run git:commit                   # Auto-generate message");
    console.log("  npm run git:release 1.2.0          # Create v1.2.0 release");

    console.log("\nBest practices:");
    console.log("  • Always create feature branches from main");
    console.log("  • Use conventional commit messages");
    console.log("  • Run quality checks before committing");
    console.log("  • Clean up merged branches regularly");
  }
}

async function main() {
  const command = process.argv[2];
  const helper = new GitWorkflowHelper();

  await helper.getGitStatus();

  switch (command) {
    case "status":
      helper.displayStatus();
      break;
    case "feature":
      await helper.createFeatureBranch();
      break;
    case "commit":
      await helper.smartCommit();
      break;
    case "cleanup":
      await helper.cleanupBranches();
      break;
    case "release":
      await helper.createRelease();
      break;
    case "help":
    default:
      await helper.showHelp();
      break;
  }
}

// Handle command line execution
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    log.error("Git workflow helper failed:");
    console.error(error);
    process.exit(1);
  });
}
