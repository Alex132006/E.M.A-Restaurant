const menuToggle = document.getElementById("menuToggle");
const menuPanel = document.getElementById("menuPanel");

if (menuToggle && menuPanel) {
  menuToggle.setAttribute("aria-expanded", "false");

  menuToggle.addEventListener("click", () => {
    const isOpen = menuPanel.classList.toggle("active");

    menuToggle.classList.toggle("active", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  // Fermer après un clic sur un lien
  menuPanel.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menuPanel.classList.remove("active");
      menuToggle.classList.remove("active");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });

  // Fermer en cliquant à l'extérieur
  document.addEventListener("click", (event) => {
    if (
      !menuToggle.contains(event.target) &&
      !menuPanel.contains(event.target)
    ) {
      menuPanel.classList.remove("active");
      menuToggle.classList.remove("active");
      menuToggle.setAttribute("aria-expanded", "false");
    }
  });

  // Fermer avec Escape
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      menuPanel.classList.remove("active");
      menuToggle.classList.remove("active");
      menuToggle.setAttribute("aria-expanded", "false");
    }
  });
}
