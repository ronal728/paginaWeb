const projects = [...document.querySelectorAll(".project")];
const pages = [...document.querySelectorAll("[data-page]")];
const categories = {
  proyectos: { title: "Proyectos", description: "Aplicaciones, laboratorios de ciberseguridad y experiencias en el sector público y universitario.", filter: "todos" },
  ciberseguridad: { title: "Ciberseguridad", description: "Laboratorios de la maestría para explorar la protección de datos y documentar su implementación.", filter: "seguridad" },
  "paginas-web": { title: "Páginas web y aplicaciones", description: "Diseño de aplicaciones, administración web y gestión de plataformas digitales. Aquí puedes conocer mi aporte a cada proyecto.", filter: "web" },
  "comunicacion-digital": { title: "Comunicación digital", description: "Experiencias de gestión de contenidos, producción audiovisual y difusión de información institucional.", filter: "comunicacion" }
};

function showPage() {
  const route = location.hash.slice(1) || "inicio";
  if (route === "contenido") {
    document.querySelector("main").focus();
    return;
  }
  let pageName = route;
  let title = "Ingeniería con propósito";
  const category = categories[route];
  if (category) {
    pageName = "proyectos";
    title = category.title;
    document.querySelector("#project-title").textContent = title;
    document.querySelector(".section-heading > p").textContent = category.description;
    for (const project of projects) {
      project.hidden = category.filter !== "todos" && !project.dataset.categories.split(" ").includes(category.filter);
    }
    for (const link of document.querySelectorAll("[data-filter]")) {
      link.toggleAttribute("data-active", link.dataset.filter === category.filter);
      if (link.dataset.filter === category.filter) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    }
  } else if (route.startsWith("proyecto/")) {
    const slug = route.slice("proyecto/".length);
    const project = projects.find(item => item.querySelector("[data-project]").dataset.project === slug);
    pageName = project ? "detalle" : "no-encontrada";
    if (project) {
      title = project.querySelector("h3").textContent;
      document.querySelector("#detail-title").textContent = title;
      document.querySelector("#detail-category").textContent = project.querySelector(".eyebrow").textContent;
      document.querySelector("#detail-summary").textContent = project.querySelector(".card-content p").textContent;
      document.querySelector("#detail-body").replaceChildren(project.querySelector("template").content.cloneNode(true));
      const visual = project.querySelector("img, .task-illustration").cloneNode(true);
      document.querySelector("#detail-visual").replaceChildren(visual);
    }
  }
  if (!pages.some(page => page.dataset.page === pageName)) pageName = "no-encontrada";
  for (const page of pages) page.hidden = page.dataset.page !== pageName;
  const activePage = pages.find(page => !page.hidden);
  const heading = activePage.querySelector("h1");
  title = heading.textContent.trim();
  document.title = title + " · Ronal Estudio";
  for (const link of document.querySelectorAll(".site-header a")) {
    const target = link.hash.slice(1);
    const current = target === pageName || (target === "proyectos" && pageName === "detalle");
    if (current) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  }
  heading.tabIndex = -1;
  heading.focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: "instant" });
}

window.addEventListener("hashchange", showPage);
showPage();

const music = document.querySelector(".music");
const musicToggle = music.querySelector(".music-toggle");
const musicPanel = music.querySelector("#music-panel");
const musicClose = music.querySelector("#music-close");
const player = music.querySelector("#player");

function setMusicOpen(open) {
  if (open && !player.firstElementChild) {
    const playlist = music.querySelector(".spotify-link").href;
    const source = new URL(playlist);
    source.pathname = `/embed${source.pathname}`;
    const frame = document.createElement("iframe");
    frame.src = source.href;
    frame.title = "Spotify · lista lofi beats";
    frame.height = "152";
    frame.allow = "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture";
    frame.referrerPolicy = "strict-origin-when-cross-origin";
    player.append(frame);
  }
  musicToggle.setAttribute("aria-expanded", String(open));
  musicPanel.classList.toggle("is-open", open);
  musicPanel.inert = !open;
  if (open) musicClose.focus({ preventScroll: true });
  else musicToggle.focus({ preventScroll: true });
}

musicToggle.hidden = false;
musicToggle.addEventListener("click", () => setMusicOpen(musicPanel.inert));
musicClose.addEventListener("click", () => setMusicOpen(false));
music.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !musicPanel.inert) setMusicOpen(false);
});

const glassButtons = document.querySelectorAll(
  ".button, .filters a, .music-toggle, .icon-button, .project-button"
);
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

for (const control of glassButtons) {
  const surface = control.querySelector(".card-arrow") ?? control;

  function positionReflection(event) {
    if (reducedMotion.matches) return;

    const bounds = surface.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;

    const x = Math.max(0, Math.min(100, (event.clientX - bounds.left) / bounds.width * 100));
    const y = Math.max(0, Math.min(100, (event.clientY - bounds.top) / bounds.height * 100));
    surface.style.setProperty("--glass-x", `${Math.round(x)}%`);
    surface.style.setProperty("--glass-y", `${Math.round(y)}%`);
  }

  function resetReflection() {
    surface.style.removeProperty("--glass-x");
    surface.style.removeProperty("--glass-y");
  }

  control.addEventListener("pointermove", (event) => {
    if (event.pointerType !== "touch") positionReflection(event);
  }, { passive: true });
  control.addEventListener("pointerdown", positionReflection);
  control.addEventListener("pointerleave", resetReflection);
  control.addEventListener("pointercancel", resetReflection);
}
