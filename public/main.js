const projects = [...document.querySelectorAll(".project")];
const filters = document.querySelector(".filters");
const results = document.querySelector("#resultados");
const dialog = document.querySelector("#project-dialog");
let activeProject;

filters.hidden = false;
filters.addEventListener("click", (event) => {
  const selected = event.target.closest("[data-filter]");
  if (!selected) return;

  const category = selected.dataset.filter;
  for (const filter of filters.querySelectorAll("[data-filter]")) {
    filter.setAttribute("aria-pressed", String(filter === selected));
  }
  let count = 0;
  for (const project of projects) {
    const categories = project.dataset.categories.split(" ");
    project.hidden = category !== "todos" && !categories.includes(category);
    if (!project.hidden) count += 1;
  }
  results.textContent = count === 1 ? "1 proyecto visible" : `${count} proyectos visibles`;
});

for (const project of projects) {
  const button = project.querySelector("button");
  button.disabled = false;
  button.addEventListener("click", () => {
    activeProject = button;
    dialog.querySelector("#detail-title").textContent = project.querySelector("h3").textContent;
    dialog.querySelector("#detail-category").textContent = project.querySelector(".eyebrow").textContent;
    dialog.querySelector("#detail-body").replaceChildren(project.querySelector("template").content.cloneNode(true));
    dialog.showModal();
  });
}

dialog.addEventListener("click", (event) => {
  if (event.target !== dialog) return;
  const bounds = dialog.getBoundingClientRect();
  const clickedOutside =
    event.clientX < bounds.left || event.clientX > bounds.right ||
    event.clientY < bounds.top || event.clientY > bounds.bottom;
  if (clickedOutside) dialog.close();
});
dialog.addEventListener("close", () => activeProject?.focus());

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
  ".button, .nav-contact, .filters button, .music-toggle, .icon-button, .project-button"
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
