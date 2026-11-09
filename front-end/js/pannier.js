document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".add-to-cart-btn");

  function getCart() {
    return JSON.parse(localStorage.getItem("emaCart")) || [];
  }

  function saveCart(cart) {
    localStorage.setItem("emaCart", JSON.stringify(cart));
  }

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const name = button.dataset.name;
      const price = Number(button.dataset.price);
      const image = button.dataset.image;

      if (!name || !Number.isFinite(price) || price <= 0 || !image) {
        alert("Informations du plat manquantes.");
        return;
      }

      let cart = getCart();

      const existingItem = cart.find((item) => item.name === name);

      if (existingItem) {
        existingItem.quantity++;
      } else {
        cart.push({
          name: name,
          price: price,
          image: image,
          quantity: 1,
        });
      }

      saveCart(cart);

      button.innerHTML = '<i class="fa-solid fa-check"></i>';

      setTimeout(() => {
        button.innerHTML = '<i class="fas fa-cart-plus"></i>';
      }, 1000);
    });
  });
});

// Ouvrir et fermer la barre
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