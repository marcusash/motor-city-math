#!/usr/bin/env node
// Self-contained Forge Agent OS bundle verifier, shipped verbatim into every
// generated bundle at .github/forge-agent-os/verify.mjs by
// packages/agent-os/cli.mjs. This file has ZERO imports beyond Node.js
// built-ins and zero relative imports to any other Forge source file — it
// must run standalone inside a product repository with no Forge checkout,
// no network access, and no globally installed `forge-agent-os` command.
//
// forge-boot (the one registered boot skill in a generated bundle) invokes
// this file's `preflight` command before any mutation. It intentionally
// duplicates a read-only subset of packages/agent-os/cli.mjs's verification
// logic rather than importing it, because a product repository never has
// packages/agent-os/cli.mjs available. Generation, rollback, and everything
// that mutates a repository still require the full Forge Agent OS CLI run
// from (or downloaded via Bootstrap-ForgeAgentOS.ps1 from) the Forge
// repository itself — see packages/agent-os/README.md.
//
// Usage (run from inside the product repository, or pass --target):
//   node .github/forge-agent-os/verify.mjs verify
//   node .github/forge-agent-os/verify.mjs preflight

import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const manifestRelativePath = ".github/forge-agent-os/manifest.json";
const BUNDLE_DIGEST_ALGORITHM_V1 = "sha256-manifest-v1";
const BUNDLE_DIGEST_ALGORITHM_V2 = "sha256-manifest-v2";
const BUNDLE_DIGEST_ALGORITHM_V3 = "sha256-manifest-v3";
const IDENTITY_MANIFEST_FIELDS = ["id", "slug", "role", "canonicalLabel", "colorName", "colorHex"];

function fail(message) {
  throw new Error(message);
}

function normalizeRelative(value) {
  return value.replaceAll("\\", "/");
}

function sha256(bytes) {
  return crypto.createHash("sha256").update(bytes).digest("hex");
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function listFiles(root) {
  if (!fs.existsSync(root)) return [];
  const result = [];
  const pending = [root];
  while (pending.length > 0) {
    const current = pending.pop();
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) pending.push(full);
      if (entry.isFile()) result.push(full);
    }
  }
  return result.sort((a, b) => a.localeCompare(b));
}

function digestEntries(entries) {
  const payload = entries.map((entry) => `${entry.sha256}  ${entry.path}`).sort().join("\n") + "\n";
  return sha256(Buffer.from(payload, "utf8"));
}

function identityRegistryDigest(identities) {
  return sha256(Buffer.from(`${JSON.stringify(identities)}\n`, "utf8"));
}

function capabilityInventoryDigest(capabilities, sharedCapability) {
  return sha256(Buffer.from(`${JSON.stringify({ capabilities, sharedCapability })}\n`, "utf8"));
}

function manifestFieldsDigest(productAuthority, source, targetRepository, pluginEquivalentVersion) {
  return sha256(
    Buffer.from(
      `${JSON.stringify({ productAuthority, source, targetRepository, pluginEquivalentVersion })}\n`,
      "utf8"
    )
  );
}

// Mirrors packages/agent-os/cli.mjs's computeBundleDigest exactly. Kept in
// sync by packages/agent-os/tests/verify-template-parity.test.js, which
// drives both implementations over a table of manifest shapes (valid and
// tampered) and asserts identical accept/reject outcomes and identical
// digests.
function computeBundleDigest(manifest) {
  const filesDigest = digestEntries(manifest.files);
  if (manifest.schemaVersion === 1) return filesDigest;
  const registryDigest = identityRegistryDigest(manifest.identities);
  if (manifest.schemaVersion === 2) {
    const payload =
      `schemaVersion:2\n` + `identityRegistryDigest:${registryDigest}\n` + `filesDigest:${filesDigest}\n`;
    return sha256(Buffer.from(payload, "utf8"));
  }
  const capabilityDigest = capabilityInventoryDigest(manifest.capabilities, manifest.sharedCapability);
  const fieldsDigest = manifestFieldsDigest(
    manifest.productAuthority,
    manifest.source,
    manifest.targetRepository,
    manifest.pluginEquivalentVersion
  );
  const payload =
    `schemaVersion:3\n` +
    `identityRegistryDigest:${registryDigest}\n` +
    `capabilityInventoryDigest:${capabilityDigest}\n` +
    `manifestFieldsDigest:${fieldsDigest}\n` +
    `filesDigest:${filesDigest}\n`;
  return sha256(Buffer.from(payload, "utf8"));
}

function verifyIdentityInventoryShape(manifest) {
  if (!Array.isArray(manifest.identities) || manifest.identities.length === 0) {
    fail("generated bundle manifest has no identity inventory");
  }
  if (typeof manifest.identityRegistryDigest !== "string" || manifest.identityRegistryDigest.length === 0) {
    fail("generated bundle manifest is missing an identity registry digest");
  }
  if (identityRegistryDigest(manifest.identities) !== manifest.identityRegistryDigest) {
    fail("manifest identity registry digest does not match the recorded identity inventory");
  }
  const ids = new Set();
  const slugs = new Set();
  const filePaths = new Set(manifest.files.map((entry) => normalizeRelative(entry.path)));
  for (const identity of manifest.identities) {
    for (const field of IDENTITY_MANIFEST_FIELDS) {
      if (!identity[field]) fail(`manifest identity is missing required field: ${field}`);
    }
    if (ids.has(identity.id)) fail(`duplicate identity id in manifest: ${identity.id}`);
    ids.add(identity.id);
    if (slugs.has(identity.slug)) fail(`duplicate identity slug in manifest: ${identity.slug}`);
    slugs.add(identity.slug);
    if (identity.canonicalLabel !== `${identity.id} — ${identity.role}`) {
      fail(`manifest identity canonical label diverges from its own id/role: ${identity.id}`);
    }
    if (/technical fellow/i.test(identity.role)) {
      fail(`manifest identity ${identity.id} carries the retired Technical Fellow title`);
    }
    const expectedProfilePath = `.github/agents/${identity.slug}.agent.md`;
    if (!filePaths.has(expectedProfilePath)) {
      fail(`manifest identity ${identity.id} has no corresponding generated profile: ${expectedProfilePath}`);
    }
  }
}

// Verifies the per-role and shared capability inventory embedded in a
// schemaVersion 3 manifest: internally consistent, digest-matching, every
// role present with a non-empty knowledge file and skill set, and every
// referenced capability path actually present in the file manifest. Like
// verifyIdentityInventoryShape, this never compares against a "live"
// registry — a product repository has none — only against the manifest's
// own recorded, digest-locked inventory.
function verifyCapabilityInventoryShape(manifest) {
  if (!Array.isArray(manifest.capabilities) || manifest.capabilities.length === 0) {
    fail("generated bundle manifest has no capability inventory");
  }
  if (!manifest.sharedCapability || typeof manifest.sharedCapability !== "object") {
    fail("generated bundle manifest has no shared capability inventory");
  }
  if (
    typeof manifest.capabilityInventoryDigest !== "string" ||
    manifest.capabilityInventoryDigest.length === 0
  ) {
    fail("generated bundle manifest is missing a capability inventory digest");
  }
  if (
    capabilityInventoryDigest(manifest.capabilities, manifest.sharedCapability) !==
    manifest.capabilityInventoryDigest
  ) {
    fail("manifest capability inventory digest does not match the recorded capability inventory");
  }
  const filePaths = new Set(manifest.files.map((entry) => normalizeRelative(entry.path)));
  const identityIds = new Set(manifest.identities.map((identity) => identity.id));
  const seenIds = new Set();
  for (const capability of manifest.capabilities) {
    if (!capability.id || !identityIds.has(capability.id)) {
      fail(`capability inventory entry does not match a manifest identity: ${capability.id}`);
    }
    if (seenIds.has(capability.id)) fail(`duplicate capability inventory entry: ${capability.id}`);
    seenIds.add(capability.id);
    if (!Array.isArray(capability.skillFiles) || capability.skillFiles.length === 0) {
      fail(`capability inventory entry has no skill files: ${capability.id}`);
    }
    if (capability.skillFileCount !== capability.skillFiles.length) {
      fail(`capability inventory skillFileCount does not match skillFiles for: ${capability.id}`);
    }
    if (!filePaths.has(normalizeRelative(capability.knowledgeFile))) {
      fail(`capability inventory knowledge file is not a generated file: ${capability.knowledgeFile}`);
    }
    if (!filePaths.has(normalizeRelative(capability.skillIndexFile))) {
      fail(`capability inventory skill index file is not a generated file: ${capability.skillIndexFile}`);
    }
  }
  for (const identity of manifest.identities) {
    if (!seenIds.has(identity.id)) {
      fail(`manifest identity has no corresponding capability inventory entry: ${identity.id}`);
    }
  }
  if (!filePaths.has(normalizeRelative(manifest.sharedCapability.indexFile))) {
    fail(`shared capability index is not a generated file: ${manifest.sharedCapability.indexFile}`);
  }
  if (!Array.isArray(manifest.sharedCapability.includedFiles)) {
    fail("shared capability inventory includedFiles must be an array");
  }
}

function verifyManifestFieldsShape(manifest) {
  if (typeof manifest.manifestFieldsDigest !== "string" || manifest.manifestFieldsDigest.length === 0) {
    fail("generated bundle manifest is missing a manifest fields digest");
  }
  if (
    manifestFieldsDigest(
      manifest.productAuthority,
      manifest.source,
      manifest.targetRepository,
      manifest.pluginEquivalentVersion
    ) !== manifest.manifestFieldsDigest
  ) {
    fail("manifest fields digest does not match the recorded productAuthority/source/targetRepository fields");
  }
}

function verifyManifestShape(manifest) {
  if (
    ![1, 2, 3].includes(manifest.schemaVersion) ||
    manifest.distribution !== "forge-agent-os-generated-bundle" ||
    manifest.activationMode !== "generated" ||
    typeof manifest.pluginEquivalentVersion !== "string" ||
    !Array.isArray(manifest.files)
  ) {
    fail("generated bundle manifest has an unsupported shape or version");
  }
  if (manifest.schemaVersion === 1) {
    if (
      manifest.identities !== undefined ||
      manifest.identityRegistryDigest !== undefined ||
      manifest.capabilities !== undefined ||
      manifest.sharedCapability !== undefined
    ) {
      fail("schemaVersion 1 manifest must not declare an identity inventory (possible downgrade tamper)");
    }
    if (manifest.bundleDigestAlgorithm !== BUNDLE_DIGEST_ALGORITHM_V1) {
      fail("schemaVersion 1 manifest must use the legacy bundle digest algorithm");
    }
  } else if (manifest.schemaVersion === 2) {
    if (manifest.capabilities !== undefined || manifest.sharedCapability !== undefined) {
      fail("schemaVersion 2 manifest must not declare a capability inventory (possible downgrade tamper)");
    }
    if (manifest.bundleDigestAlgorithm !== BUNDLE_DIGEST_ALGORITHM_V2) {
      fail("schemaVersion 2 manifest must use the v2 bundle digest algorithm");
    }
    verifyIdentityInventoryShape(manifest);
  } else {
    if (manifest.bundleDigestAlgorithm !== BUNDLE_DIGEST_ALGORITHM_V3) {
      fail("schemaVersion 3 manifest must use the current bundle digest algorithm");
    }
    verifyIdentityInventoryShape(manifest);
    verifyCapabilityInventoryShape(manifest);
    verifyManifestFieldsShape(manifest);
  }
}

function targetRoot(options) {
  const target = path.resolve(options.target || process.cwd());
  if (!fs.existsSync(target) || !fs.statSync(target).isDirectory()) {
    fail(`target repository does not exist: ${target}`);
  }
  return target;
}

const forbiddenPointerSegments = [".copilot", "session-state", "worktree", "appdata", "temp"];

function validatePointer(target, pointer) {
  if (!pointer) fail("manifest productAuthority.pointer is missing");
  const normalized = normalizeRelative(pointer);
  if (
    path.isAbsolute(pointer) ||
    /^[A-Za-z]:/.test(pointer) ||
    normalized.split("/").includes("..") ||
    forbiddenPointerSegments.some((segment) => normalized.toLowerCase().includes(segment))
  ) {
    fail(`unsafe product authority pointer: ${pointer}`);
  }
  const resolved = path.resolve(target, pointer);
  const relative = path.relative(target, resolved);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    fail(`product authority escapes repository: ${pointer}`);
  }
  if (!fs.existsSync(resolved) || !fs.statSync(resolved).isFile()) {
    fail(`product authority pointer does not resolve: ${pointer}`);
  }
  return normalized;
}

function manifestPath(target) {
  return path.join(target, ...manifestRelativePath.split("/"));
}

function readManifest(target) {
  const file = manifestPath(target);
  if (!fs.existsSync(file)) fail(`generated bundle manifest is missing: ${file}`);
  return readJson(file);
}

export function verifyBundle(target) {
  const manifest = readManifest(target);
  verifyManifestShape(manifest);
  validatePointer(target, manifest.productAuthority?.pointer);
  const seen = new Set();
  for (const entry of manifest.files) {
    const relativePath = normalizeRelative(entry.path);
    if (seen.has(relativePath)) fail(`duplicate generated path: ${relativePath}`);
    seen.add(relativePath);
    const file = path.resolve(target, ...relativePath.split("/"));
    if (!file.startsWith(`${target}${path.sep}`) || !fs.existsSync(file)) {
      fail(`generated file is missing: ${relativePath}`);
    }
    const bytes = fs.readFileSync(file);
    if (bytes.length !== entry.bytes || sha256(bytes) !== entry.sha256) {
      fail(`generated file digest mismatch: ${relativePath}`);
    }
  }
  if (computeBundleDigest(manifest) !== manifest.bundleDigest) {
    fail("generated bundle digest mismatch");
  }
  const ownedRoot = path.join(target, ".github", "forge-agent-os");
  for (const file of listFiles(ownedRoot)) {
    const relativePath = normalizeRelative(path.relative(target, file));
    if (relativePath === manifestRelativePath) continue;
    if (!seen.has(relativePath)) fail(`untracked generated file: ${relativePath}`);
  }
  return manifest;
}

function frontmatterName(file) {
  const text = fs.readFileSync(file, "utf8");
  const match = text.match(/^---\s*\r?\n[\s\S]*?^name:\s*([^\r\n]+)\s*$/m);
  if (match) return match[1].trim();
  if (path.basename(file).toLowerCase() === "skill.md") return path.basename(path.dirname(file));
  return null;
}

function addResources(resources, root, source, filter = () => true) {
  if (!root || !fs.existsSync(root)) return;
  for (const file of listFiles(root)) {
    if (!filter(file)) continue;
    const name = frontmatterName(file);
    if (!name) continue;
    if (!resources.has(name)) resources.set(name, []);
    resources.get(name).push({ source, path: path.resolve(file) });
  }
}

function defaultUserRoots() {
  const root = process.env.COPILOT_HOME || path.join(os.homedir(), ".copilot");
  return ["agents", "skills", "installed-plugins", "plugins"]
    .map((segment) => path.join(root, segment))
    .filter((candidate) => fs.existsSync(candidate));
}

export function preflight(target, options = {}) {
  const manifest = verifyBundle(target);
  const resources = new Map();
  const generatedPaths = new Set(
    manifest.files.map((entry) => path.resolve(target, ...normalizeRelative(entry.path).split("/")))
  );
  const resourceFilter = (file) =>
    file.endsWith(".agent.md") || path.basename(file).toLowerCase() === "skill.md";

  addResources(
    resources,
    path.join(target, ".github"),
    "repository",
    (file) => resourceFilter(file) && !generatedPaths.has(path.resolve(file))
  );
  for (const entry of manifest.files) {
    const file = path.resolve(target, ...normalizeRelative(entry.path).split("/"));
    if (!resourceFilter(file)) continue;
    const name = frontmatterName(file);
    if (!resources.has(name)) resources.set(name, []);
    resources.get(name).push({ source: "generated", path: file });
  }

  const explicitUserRoots = options["user-root"] ? options["user-root"].split(path.delimiter) : defaultUserRoots();
  for (const root of explicitUserRoots) {
    addResources(resources, path.resolve(root), "user", resourceFilter);
  }
  for (const [option, source] of [["plugin-root", "plugin"], ["cache-root", "cache"]]) {
    if (options[option]) {
      for (const root of options[option].split(path.delimiter)) {
        addResources(resources, path.resolve(root), source, resourceFilter);
      }
    }
  }

  const conflicts = [];
  for (const [name, locations] of resources) {
    if (locations.length > 1) conflicts.push({ name, locations });
  }
  if (conflicts.length > 0) {
    const details = conflicts
      .map(
        ({ name, locations }) =>
          `${name}: ${locations.map(({ source, path: resourcePath }) => `${source}=${resourcePath}`).join(", ")}`
      )
      .join("; ");
    fail(`resource collisions detected: ${details}`);
  }
  const pluginActive = [...resources.values()].flat().some((location) => location.source === "plugin");
  if (pluginActive) fail("plugin and generated bundle modes cannot be active together");

  const capabilitySummary = (manifest.capabilities ?? []).map((capability) => ({
    id: capability.id,
    skillFileCount: capability.skillFileCount,
  }));

  return {
    result: "PASS",
    bundleDigest: manifest.bundleDigest,
    schemaVersion: manifest.schemaVersion,
    sourceCommit: manifest.source?.commit ?? null,
    productAuthority: manifest.productAuthority.pointer,
    resources: [...resources.keys()].sort(),
    capabilities: capabilitySummary,
  };
}

function parseArguments(argv) {
  const [command, ...rest] = argv;
  const options = {};
  for (let index = 0; index < rest.length; index += 1) {
    const token = rest[index];
    if (!token.startsWith("--")) fail(`unknown argument: ${token}`);
    const name = token.slice(2);
    const value = rest[index + 1];
    if (!value || value.startsWith("--")) fail(`missing value for --${name}`);
    options[name] = value;
    index += 1;
  }
  return { command, options };
}

function output(value) {
  process.stdout.write(`${JSON.stringify(value, null, 2)}\n`);
}

function isMain() {
  return process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url));
}

if (isMain()) {
  try {
    const { command, options } = parseArguments(process.argv.slice(2));
    const target = targetRoot(options);
    if (command === "verify") {
      output({ result: "PASS", manifest: verifyBundle(target) });
    } else if (command === "preflight") {
      output(preflight(target, options));
    } else {
      fail(`unknown command: ${command ?? "<missing>"} (this self-contained entrypoint supports only 'verify' and 'preflight'; generate/rollback require the full Forge Agent OS CLI)`);
    }
  } catch (error) {
    process.stderr.write(`forge-agent-os-verify-error:${error.message}\n`);
    process.exitCode = 1;
  }
}
