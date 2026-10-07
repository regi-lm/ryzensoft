import { getTechnologyIcon } from "./technology-icons.js";

const fallbackProjectImage = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=76";

export const projects = [
  {
    id: "barbearia-los-parcas",
    title: "Barbearia Los Parças",
    category: "Site institucional • Beleza",
    description: "Site criado para uma barbearia local, com identidade visual marcante e animações em JavaScript. A estrutura também serve como referência para salões de beleza, barbearias e estúdios de maquiagem e beleza.",
    image: "assets/images/projects/barbearia-los-parcas.png",
    imageWidth: 1423,
    imageHeight: 763,
    technologies: ["HTML", "CSS", "JavaScript"],
    url: "https://barbearialosparcas.vercel.app/",
    note: "Projeto desenvolvido"
  },
  {
    id: "cardapio-online",
    title: "Cardápio Online",
    category: "Landing Page • Alimentação",
    description: "Modelo de site e landing page para cardápio online, pensado para hamburguerias, pizzarias, lanchonetes, sorveterias, panificadoras e outros negócios do setor de alimentação.",
    image: "assets/images/projects/cardapio-online.png",
    imageWidth: 1424,
    imageHeight: 764,
    technologies: ["HTML", "CSS", "JavaScript", "Bootstrap", "Bibliotecas JS"],
    url: "https://cardapioonline-plum.vercel.app/",
    note: "Modelo demonstrativo"
  },
  {
    id: "advocacia",
    title: "Advocacia",
    category: "Landing Page • Jurídico",
    description: "Modelo de site e landing page para escritórios de advocacia e profissionais do ramo, com apresentação institucional, áreas de atuação e contato em destaque.",
    image: "assets/images/projects/advocacia.png",
    imageWidth: 1422,
    imageHeight: 648,
    technologies: ["HTML", "CSS", "JavaScript", "Bibliotecas JS"],
    url: "https://margalhoadv.vercel.app/",
    note: "Modelo demonstrativo"
  }
];

function formatBrandName(text) {
  return text.replaceAll(
    "RyzenSoft",
    '<span class="brand-word"><span class="brand-initial">R</span>yzen<span class="brand-accent">S</span>oft</span>'
  );
}

function escapeHtmlAttribute(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

export function renderProjects(container, list = projects) {
  if (!container) return;

  container.innerHTML = list.map((project) => `
    <article class="project-panel" data-project data-project-panel>
      <img class="project-panel__media" src="${project.image || fallbackProjectImage}" alt="" loading="lazy" width="${project.imageWidth || 1600}" height="${project.imageHeight || 1067}">
      <div class="project-panel__overlay" aria-hidden="true"></div>
      <div class="project-panel__content" data-project-content>
        <p class="eyebrow">${project.category}</p>
        <h3>${project.title}</h3>
        <p>${formatBrandName(project.description)}</p>
        <ul class="tech-list" aria-label="Tecnologias">
          ${project.technologies.map((tech) => {
            const icon = getTechnologyIcon(tech);
            const iconName = escapeHtmlAttribute(icon.name);
            return `<li class="tech-icon" title="${iconName}"><img src="${icon.src}" alt="${iconName}" width="28" height="28" loading="lazy"></li>`;
          }).join("")}
        </ul>
        ${project.url ? `<a class="button button--ghost project-panel__action" href="${project.url}" target="_blank" rel="noreferrer">Ver projeto</a>` : `<span class="project-panel__note">${project.note || "Modelo demonstrativo"}</span>`}
      </div>
    </article>
  `).join("");
}
