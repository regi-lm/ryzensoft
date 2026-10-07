import test from "node:test";
import assert from "node:assert/strict";
import { stat } from "node:fs/promises";

const projectsModuleUrl = new URL("../js/projects.js", import.meta.url);

async function importProjectsModule() {
  return import(`${projectsModuleUrl.href}?test=${Date.now()}-${Math.random()}`);
}

test("project cards use the three supplied local images in order", async () => {
  const { projects } = await importProjectsModule();

  assert.deepEqual(projects.map(({ title }) => title), [
    "Barbearia Los Parças",
    "Cardápio Online",
    "Advocacia"
  ]);
  assert.deepEqual(projects.map(({ url }) => url), [
    "https://barbearialosparcas.vercel.app/",
    "https://cardapioonline-plum.vercel.app/",
    "https://margalhoadv.vercel.app/"
  ]);

  for (const project of projects) {
    const image = new URL(`../${project.image}`, import.meta.url);
    assert.ok((await stat(image)).size > 0);
  }
});

test("project cards expose the informed technologies without placeholder copy", async () => {
  const { projects, renderProjects } = await importProjectsModule();
  const container = { innerHTML: "" };

  renderProjects(container, projects);

  assert.equal((container.innerHTML.match(/class="project-panel"/g) ?? []).length, 3);
  assert.match(container.innerHTML, /Bootstrap/);
  assert.match(container.innerHTML, /Bibliotecas JavaScript/);
  assert.equal((container.innerHTML.match(/>Ver projeto<\/a>/g) ?? []).length, 3);
  assert.doesNotMatch(container.innerHTML, /Placeholder/);
});
