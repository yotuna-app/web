import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const distDir = path.join(rootDir, "dist");
const distLgDir = path.join(rootDir, "dist-lg");
const appinfoPath = path.join(distDir, "appinfo.json");

console.log("=== Building TV distribution ===");
execSync("npm run build:tv", { cwd: rootDir, stdio: "inherit" });

if (!fs.existsSync(appinfoPath)) {
  console.error("Error: dist/appinfo.json not found after build.");
  process.exit(1);
}

const baseAppinfo = JSON.parse(fs.readFileSync(appinfoPath, "utf8"));
const resolutions = [
  { res: "1280x720", label: "Full HD Model (FHD)", folder: "1280x720" },
  { res: "1920x1080", label: "Ultra HD Model (UHD)", folder: "1920x1080" },
];

for (const { res, label, folder } of resolutions) {
  console.log(`\n=== Packaging for ${res} [${label}] ===`);
  const outDir = path.join(distLgDir, folder);
  fs.mkdirSync(outDir, { recursive: true });

  // Update dist/appinfo.json with specific resolution
  const updatedAppinfo = {
    ...baseAppinfo,
    version: "1.0.7",
    resolution: res,
  };
  fs.writeFileSync(appinfoPath, JSON.stringify(updatedAppinfo, null, 2));

  // Run ares-package
  execSync(`ares-package dist -o "${outDir}"`, { cwd: rootDir, stdio: "inherit" });

  const generatedIpk = path.join(outDir, `com.mobulum.yotuna.lg_1.0.7_all.ipk`);
  if (fs.existsSync(generatedIpk)) {
    const namedIpk = path.join(distLgDir, `com.mobulum.yotuna.lg_1.0.7_${res}.ipk`);
    fs.copyFileSync(generatedIpk, namedIpk);
    console.log(`✓ Generated: ${generatedIpk}`);
    console.log(`✓ Also copied as: ${namedIpk}`);
  }
}

// Restore default 1920x1080 in dist
fs.writeFileSync(
  appinfoPath,
  JSON.stringify({ ...baseAppinfo, version: "1.0.7", resolution: "1920x1080" }, null, 2)
);

// Copy to yotuna-tv/packages/dist-lg if the directory exists
const yotunaTvDistLg = path.resolve(rootDir, "../yotuna-tv/packages/dist-lg");
if (fs.existsSync(path.dirname(yotunaTvDistLg))) {
  fs.mkdirSync(yotunaTvDistLg, { recursive: true });
  for (const { res, folder } of resolutions) {
    const srcDir = path.join(distLgDir, folder);
    const destDir = path.join(yotunaTvDistLg, folder);
    fs.mkdirSync(destDir, { recursive: true });
    fs.copyFileSync(
      path.join(srcDir, "com.mobulum.yotuna.lg_1.0.7_all.ipk"),
      path.join(destDir, "com.mobulum.yotuna.lg_1.0.7_all.ipk")
    );
    fs.copyFileSync(
      path.join(distLgDir, `com.mobulum.yotuna.lg_1.0.7_${res}.ipk`),
      path.join(yotunaTvDistLg, `com.mobulum.yotuna.lg_1.0.7_${res}.ipk`)
    );
  }
  console.log(`✓ Synchronized packages to ${yotunaTvDistLg}`);
}

console.log("\n=== All TV packages successfully created! ===");
