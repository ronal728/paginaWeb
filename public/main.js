const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let pageAnimation;
const projects = [...document.querySelectorAll(".project")];
const pages = [...document.querySelectorAll("[data-page]")];
const categories = {
  proyectos: { title: "Proyectos", description: "Aplicaciones, laboratorios de ciberseguridad y experiencias en el sector público y universitario.", filter: "todos" },
  ciberseguridad: { title: "Ciberseguridad", description: "Laboratorios de la maestría para explorar la protección de datos y documentar su implementación.", filter: "seguridad" },
  "paginas-web": { title: "Páginas web y aplicaciones", description: "Diseño de aplicaciones, administración web y gestión de plataformas digitales. Aquí puedes conocer mi aporte a cada proyecto.", filter: "web" },
  "comunicacion-digital": { title: "Comunicación digital", description: "Experiencias de gestión de contenidos, producción audiovisual y difusión de información institucional.", filter: "comunicacion" }
};

function showPage() {
  pageAnimation?.cancel();
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
  if (!reducedMotion.matches && activePage.animate) {
    pageAnimation = activePage.animate([{ opacity: 0, transform: "translateY(16px)" }, { opacity: 1, transform: "translateY(0)" }], { duration: 360, easing: "cubic-bezier(.22,1,.36,1)" });
  }
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
    const artistUrl = music.querySelector(".spotify-link").href;
    const source = new URL(artistUrl);
    source.pathname = `/embed${source.pathname.replace(/^\/intl-[^/]+/, "")}`;
    const frame = document.createElement("iframe");
    frame.src = source.href;
    frame.title = "Spotify · Bad Bunny";
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

// Download the report without leaving the project, including HTMLPreview.
document.addEventListener("click", async (event) => {
  const link = event.target.closest(".report-download-link");
  if (!link || link.href.startsWith("data:") || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  if (link.getAttribute("aria-busy") === "true") return;
  const status = link.parentElement.querySelector(".download-status");
  link.setAttribute("aria-busy", "true");
  status.textContent = "Preparando descarga…";
  try {
    const response = await fetch(link.href);
    if (!response.ok) throw new Error("Download failed");
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url; anchor.download = link.download;
    document.body.append(anchor); anchor.click(); anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 60000);
    status.textContent = "Descarga iniciada.";
  } catch {
    status.textContent = "No se pudo descargar el informe. Inténtalo de nuevo.";
  } finally { link.removeAttribute("aria-busy"); }
});
