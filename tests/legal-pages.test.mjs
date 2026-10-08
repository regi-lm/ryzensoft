import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const projectFile = (path) => new URL(`../${path}`, import.meta.url);

async function readProjectFile(path) {
  return readFile(projectFile(path), "utf8");
}

test("site footer separates section links from ordered legal links", async () => {
  const html = await readProjectFile("index.html");
  const footer = html.match(/<footer class="site-footer">[\s\S]*?<\/footer>/)?.[0] ?? "";

  assert.match(footer, /aria-label="Seções do site"/);
  assert.match(footer, /aria-label="Links legais"[\s\S]*?href="termos\.html">Termos<[\s\S]*?href="lgpd\.html">LGPD<[\s\S]*?href="politica-de-privacidade\.html">Privacidade</);
  assert.doesNotMatch(footer, />Política de privacidade</);
});

test("every legal page exposes the same ordered legal navigation", async () => {
  const pages = await Promise.all([
    readProjectFile("termos.html"),
    readProjectFile("lgpd.html"),
    readProjectFile("politica-de-privacidade.html")
  ]);

  for (const html of pages) {
    assert.match(html, /aria-label="Links legais"[\s\S]*?href="termos\.html"[\s\S]*?href="lgpd\.html"[\s\S]*?href="politica-de-privacidade\.html"/);
  }
});

test("legal pages do not render the skip-to-content control", async () => {
  const pages = await Promise.all([
    readProjectFile("termos.html"),
    readProjectFile("lgpd.html"),
    readProjectFile("politica-de-privacidade.html")
  ]);

  pages.forEach((page) => {
    assert.doesNotMatch(page, /class="skip-link"/);
    assert.doesNotMatch(page, />Pular para o conteúdo</);
  });
});

test("terms and privacy pages publish their updated content", async () => {
  const [terms, privacy] = await Promise.all([
    readProjectFile("termos.html"),
    readProjectFile("politica-de-privacidade.html")
  ]);

  assert.match(terms, /<h1>Termos de Uso<\/h1>/);
  assert.match(privacy, /Na configuração atual, esses dados são apenas validados no seu navegador e não são enviados nem armazenados/);
});
