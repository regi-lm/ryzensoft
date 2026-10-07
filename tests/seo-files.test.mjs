import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const projectFile = (path) => new URL(`../${path}`, import.meta.url);

async function readProjectFile(path) {
  return readFile(projectFile(path), "utf8");
}

test("sitemap lists every public HTML page under the configured canonical domain", async () => {
  const [sitemap, config] = await Promise.all([
    readProjectFile("sitemap.xml"),
    readProjectFile("js/config.js")
  ]);
  const canonical = config.match(/canonicalUrl:\s*"([^"]+)"/)?.[1];
  const locations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);

  assert.equal(canonical, "https://rsoftware-site.regi-lima.chatgpt.site/");
  assert.deepEqual(locations, [
    canonical,
    `${canonical}termos.html`,
    `${canonical}lgpd.html`,
    `${canonical}politica-de-privacidade.html`
  ]);
  assert.equal((sitemap.match(/<lastmod>2026-10-07<\/lastmod>/g) ?? []).length, 4);
});

test("robots allows the public site and keeps internal project paths out of search", async () => {
  const robots = await readProjectFile("robots.txt");

  assert.match(robots, /^User-agent: \*\r?\nAllow: \/$/m);
  assert.match(robots, /^Disallow: \/docs\/$/m);
  assert.match(robots, /^Disallow: \/tests\/$/m);
  assert.match(robots, /^Disallow: \/README\.md$/m);
  assert.match(robots, /^Sitemap: https:\/\/rsoftware-site\.regi-lima\.chatgpt\.site\/sitemap\.xml$/m);
});
