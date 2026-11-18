import fs from "node:fs";
import path from "node:path";

interface Dict {
  [key: string]: string | Dict;
}

function flattenKeys(obj: Dict, prefix = ""): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      Object.assign(result, flattenKeys(value as Dict, fullKey));
    } else if (typeof value === "string") {
      result[fullKey] = value;
    }
  }
  return result;
}

function findSourceFiles(dir: string, fileList: string[] = []): string[] {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (file !== "node_modules" && file !== ".next" && file !== ".git") {
        findSourceFiles(fullPath, fileList);
      }
    } else if (/\.(tsx|ts|jsx|js)$/.test(file)) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

function main() {
  console.log("=== i18n Dictionary Parity & Integrity Check ===");

  const enPath = path.resolve(process.cwd(), "locales/en.json");
  const urPath = path.resolve(process.cwd(), "locales/ur.json");

  if (!fs.existsSync(enPath) || !fs.existsSync(urPath)) {
    console.error("❌ Error: Missing locales/en.json or locales/ur.json");
    process.exit(1);
  }

  const enRaw = JSON.parse(fs.readFileSync(enPath, "utf-8")) as Dict;
  const urRaw = JSON.parse(fs.readFileSync(urPath, "utf-8")) as Dict;

  const enFlat = flattenKeys(enRaw);
  const urFlat = flattenKeys(urRaw);

  const enKeys = new Set(Object.keys(enFlat));
  const urKeys = new Set(Object.keys(urFlat));

  let hasError = false;

  // 1. Missing keys in Urdu
  const missingInUr = [...enKeys].filter((k) => !urKeys.has(k));
  if (missingInUr.length > 0) {
    console.error(`❌ ${missingInUr.length} key(s) missing in locales/ur.json:`);
    missingInUr.forEach((k) => console.error(`   - ${k}`));
    hasError = true;
  }

  // 2. Extra keys in Urdu
  const extraInUr = [...urKeys].filter((k) => !enKeys.has(k));
  if (extraInUr.length > 0) {
    console.error(`❌ ${extraInUr.length} extra key(s) in locales/ur.json not in en.json:`);
    extraInUr.forEach((k) => console.error(`   - ${k}`));
    hasError = true;
  }

  // 3. Empty or suspicious values
  for (const [key, val] of Object.entries(enFlat)) {
    if (!val || val.trim() === "") {
      console.error(`❌ Empty value in locales/en.json for key: ${key}`);
      hasError = true;
    }
  }

  for (const [key, val] of Object.entries(urFlat)) {
    if (!val || val.trim() === "") {
      console.error(`❌ Empty value in locales/ur.json for key: ${key}`);
      hasError = true;
    }
  }

  // 4. Scan source files for t("...") calls
  const sourceDirs = [
    path.resolve(process.cwd(), "app"),
    path.resolve(process.cwd(), "components"),
  ];
  const allSourceFiles: string[] = [];
  sourceDirs.forEach((dir) => findSourceFiles(dir, allSourceFiles));

  const tCallRegex = /\bt\(\s*["']([a-zA-Z0-9_.-]+)["']/g;
  const codeKeys = new Set<string>();

  for (const file of allSourceFiles) {
    const content = fs.readFileSync(file, "utf-8");
    let match;
    while ((match = tCallRegex.exec(content)) !== null) {
      codeKeys.add(match[1]);
    }
  }

  const missingInDict = [...codeKeys].filter((k) => !enKeys.has(k));
  if (missingInDict.length > 0) {
    console.warn(`⚠️ Warning: ${missingInDict.length} key(s) used in code but not found in en.json:`);
    missingInDict.forEach((k) => console.warn(`   - ${k}`));
    // Treat as error to ensure zero missing keys
    hasError = true;
  }

  console.log(`\nVerified ${enKeys.size} English keys and ${urKeys.size} Urdu keys.`);
  console.log(`Checked ${codeKeys.size} distinct t(...) calls across ${allSourceFiles.length} source files.`);

  if (hasError) {
    console.error("\n❌ i18n check FAILED. Resolve the issues above.");
    process.exit(1);
  }

  console.log("✅ All i18n keys are 100% in sync, non-empty, and verified!");
}

main();
