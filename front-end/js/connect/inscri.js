const registerForm = document.getElementById("registerForm");
const message = document.getElementById("message");


// AFFICHER / MASQUER LE MOT DE PASSE

document.querySelectorAll(".toggle-password").forEach(button => {

    button.addEventListener("click", () => {

        const input = document.getElementById(button.dataset.target);

        if (input.type === "password") {
            input.type = "text";
            button.textContent = "Masquer";
        } else {
            input.type = "password";
            button.textContent = "Afficher";
        }

    });

});


// INSCRIPTION

registerForm.addEventListener("submit", async function(event) {

    event.preventDefault();

    message.textContent = "";
    message.className = "message";

    const nom = document.getElementById("nom").value.trim();
    const prenom = document.getElementById("prenom").value.trim();
    const telephone = document.getElementById("telephone").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    const conditions = document.getElementById("conditions").checked;

    // Vérification des champs

    if (!nom || !prenom || !telephone || !email || !password || !confirmPassword) {
        showMessage("Veuillez remplir tous les champs.", "error");
        return;
    }

    // Vérification du mot de passe

    if (password.length < 8) {
        showMessage("Le mot de passe doit contenir au moins 8 caractères.", "error");
        return;
    }

    if (password !== confirmPassword) {
        showMessage("Les mots de passe ne correspondent pas.", "error");
        return;
    }

    if (!conditions) {
        showMessage("Veuillez accepter les conditions générales.", "error");
        return;
    }

    // Préparation des données

    const client = {
        nom,
        prenom,
        telephone,
        email,
        password
    };

    const button = registerForm.querySelector(".register-button");

    button.disabled = true;
    button.textContent = "INSCRIPTION EN COURS...";

    try {

        // Envoi vers le serveur Node.js

        const response = await fetch("/api/auth/register", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(client)

        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Une erreur est survenue.");
        }

        showMessage(
            "Votre compte a été créé avec succès ! Redirection...",
            "success"
        );

        registerForm.reset();

        setTimeout(() => {
            window.location.href = "connexion.html";
        }, 2000);

    } catch (error) {

        showMessage(
            error.message || "Impossible de contacter le serveur.",
            "error"
        );

    } finally {

        button.disabled = false;
        button.textContent = "CRÉER MON COMPTE";

    }

});


// AFFICHAGE DES MESSAGES

function showMessage(text, type) {

    message.textContent = text;
    message.className = "message " + type;

}