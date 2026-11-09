document.addEventListener("DOMContentLoaded", () => {
  const CART_KEY = "emaCart";
  const ORDER_KEY = "emaPendingOrder";

  const form = document.getElementById("checkout-form");

  const itemsContainer = document.getElementById("checkout-items");
  const quantityElement = document.getElementById("order-quantity");
  const subtotalElement = document.getElementById("order-subtotal");
  const totalElement = document.getElementById("order-total");
  const deliveryPriceElement = document.getElementById("delivery-price");

  const deliveryFields = document.getElementById("delivery-fields");
  const paymentNotice = document.getElementById("payment-notice");

  const checkoutButton = document.getElementById("place-order-btn");

  // FORMAT DES PRIX
  function formatPrice(price) {
    return new Intl.NumberFormat("fr-FR").format(price) + " FCFA";
  }

  // RÉCUPÉRER LE PANIER
  function getCart() {
    try {
      const cart = JSON.parse(localStorage.getItem(CART_KEY));

      if (!Array.isArray(cart)) return [];

      return cart.filter(
        (item) =>
          item &&
          item.id !== undefined &&
          typeof item.name === "string" &&
          Number.isFinite(Number(item.price)) &&
          Number(item.price) > 0 &&
          Number.isInteger(Number(item.quantity)) &&
          Number(item.quantity) > 0,
      );
    } catch (error) {
      console.error("Erreur panier :", error);
      return [];
    }
  }

  // CRÉER UN ÉLÉMENT HTML
  function createElement(tag, className, text = "") {
    const element = document.createElement(tag);

    if (className) {
      element.className = className;
    }

    element.textContent = text;

    return element;
  }

  // AFFICHER LES PRODUITS
  function displayOrderSummary() {
    const cart = getCart();

    itemsContainer.innerHTML = "";

    if (cart.length === 0) {
      const empty = createElement("div", "checkout-empty");

      const icon = createElement("i", "fa-solid fa-basket-shopping");

      const message = createElement(
        "p",
        "",
        "Votre panier est vide. Ajoutez des plats avant de passer commande.",
      );

      const link = createElement("a", "", "Retourner au menu");

      link.href = "menu.html";

      empty.append(icon, message, link);
      itemsContainer.appendChild(empty);

      checkoutButton.disabled = true;
      checkoutButton.style.opacity = "0.5";
      checkoutButton.style.cursor = "not-allowed";

      quantityElement.textContent = "0";
      subtotalElement.textContent = formatPrice(0);
      totalElement.textContent = formatPrice(0);

      return;
    }

    checkoutButton.disabled = false;
    checkoutButton.style.opacity = "1";
    checkoutButton.style.cursor = "pointer";

    let subtotal = 0;
    let totalQuantity = 0;

    cart.forEach((item) => {
      const quantity = Number(item.quantity);
      const price = Number(item.price);

      subtotal += price * quantity;
      totalQuantity += quantity;

      const product = createElement("div", "checkout-product");

      const image = createElement("img");

      image.src = item.image || "images/placeholder.jpg";
      image.alt = item.name;

      image.addEventListener("error", () => {
        image.style.display = "none";
      });

      const info = createElement("div", "checkout-product-info");

      const name = createElement("h4", "", item.name);

      const details = createElement(
        "p",
        "",
        quantity + " × " + formatPrice(price),
      );

      info.append(name, details);

      const lineTotal = createElement(
        "strong",
        "checkout-product-total",
        formatPrice(price * quantity),
      );

      product.append(image, info, lineTotal);

      itemsContainer.appendChild(product);
    });

    quantityElement.textContent = totalQuantity;
    subtotalElement.textContent = formatPrice(subtotal);
    totalElement.textContent = formatPrice(subtotal);
  }

  // MODE DE RÉCEPTION
  function updateReception() {
    const selected = document.querySelector('input[name="reception"]:checked');

    if (!selected) return;

    const isDelivery = selected.value === "livraison";

    deliveryFields.style.display = isDelivery ? "block" : "none";

    document.getElementById("quartier").required = isDelivery;
    document.getElementById("adresse").required = isDelivery;

    deliveryPriceElement.textContent = isDelivery
      ? "À confirmer"
      : formatPrice(0);

    updateTotal();
  }

  // METTRE À JOUR LE TOTAL
  function updateTotal() {
    const cart = getCart();

    const subtotal = cart.reduce((total, item) => {
      return total + Number(item.price) * Number(item.quantity);
    }, 0);

    // Les frais de livraison ne sont pas encore configurés.
    // Le total affiché reste donc provisoire.
    totalElement.textContent = formatPrice(subtotal);
  }

  // MODE DE PAIEMENT
  function updatePaymentNotice() {
    const selected = document.querySelector('input[name="paiement"]:checked');

    if (!selected) {
      paymentNotice.textContent =
        "Sélectionnez un mode de paiement pour afficher les informations correspondantes.";
      return;
    }

    const messages = {
      mtn: "MTN Mobile Money sélectionné. Les instructions de paiement vous seront communiquées après confirmation de la commande.",

      airtel:
        "Airtel Money sélectionné. Les instructions de paiement vous seront communiquées après confirmation de la commande.",

      especes:
        "Paiement en espèces sélectionné. Vous réglerez votre commande à la livraison ou au retrait au restaurant.",
    };

    paymentNotice.textContent = messages[selected.value] || "";
  }

  // ÉCOUTER LE MODE DE RÉCEPTION
  document.querySelectorAll('input[name="reception"]').forEach((input) => {
    input.addEventListener("change", updateReception);
  });

  // ÉCOUTER LE MODE DE PAIEMENT
  document.querySelectorAll('input[name="paiement"]').forEach((input) => {
    input.addEventListener("change", updatePaymentNotice);
  });

  // VALIDATION ET PRÉPARATION DE LA COMMANDE
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const cart = getCart();

    if (cart.length === 0) {
      alert("Votre panier est vide. Veuillez ajouter des plats.");
      window.location.href = "menu.html";

      return;
    }

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const telephone = document.getElementById("telephone").value.trim();

    if (!/^[0-9+\s().-]{8,20}$/.test(telephone)) {
      alert("Veuillez saisir un numéro de téléphone valide.");
      return;
    }

    const reception = document.querySelector('input[name="reception"]:checked');

    const paiement = document.querySelector('input[name="paiement"]:checked');

    if (!reception || !paiement) {
      alert("Veuillez choisir un mode de réception et de paiement.");
      return;
    }

    const subtotal = cart.reduce((total, item) => {
      return total + Number(item.price) * Number(item.quantity);
    }, 0);

    // INFORMATIONS DU CLIENT
    const customer = {
      nom: document.getElementById("nom").value.trim(),

      telephone: telephone,

      email: document.getElementById("email").value.trim(),

      reception: reception.value,

      quartier:
        reception.value === "livraison"
          ? document.getElementById("quartier").value.trim()
          : "",

      adresse:
        reception.value === "livraison"
          ? document.getElementById("adresse").value.trim()
          : "",

      indication:
        reception.value === "livraison"
          ? document.getElementById("indication").value.trim()
          : "",

      commune:
        reception.value === "livraison"
          ? document.getElementById("commune").value
          : "",

      paiement: paiement.value,

      commentaire: document.getElementById("commentaire").value.trim(),
    };

    // PRÉPARER LA COMMANDE
    const order = {
      reference: "EMA-" + Date.now(),

      date: new Date().toISOString(),

      client: customer,

      produits: cart,

      quantiteTotale: cart.reduce((total, item) => {
        return total + Number(item.quantity);
      }, 0),

      sousTotal: subtotal,

      fraisLivraison: null,

      totalProvisoire: subtotal,

      statut: "En attente de confirmation",
    };

    // SAUVEGARDER LA DEMANDE SUR LE NAVIGATEUR
    try {
      localStorage.setItem(ORDER_KEY, JSON.stringify(order));

      // Aller vers la page de confirmation
      window.location.href = "confirmation.html";
    } catch (error) {
      console.error("Erreur d'enregistrement :", error);

      alert("Impossible de préparer votre commande. Réessayez.");
    }
  });

  // INITIALISATION
  displayOrderSummary();

  updateReception();

  updatePaymentNotice();
});
