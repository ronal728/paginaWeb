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
