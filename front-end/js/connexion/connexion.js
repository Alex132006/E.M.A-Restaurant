const loginForm = document.getElementById("loginForm");
const message = document.getElementById("message");

const passwordInput = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");


// AFFICHER / MASQUER LE MOT DE PASSE

togglePassword.addEventListener("click", () => {

    if (passwordInput.type === "password") {

        passwordInput.type = "text";
        togglePassword.textContent = "Masquer";
        togglePassword.setAttribute(
            "aria-label",
            "Masquer le mot de passe"
        );

    } else {

        passwordInput.type = "password";
        togglePassword.textContent = "Afficher";
        togglePassword.setAttribute(
            "aria-label",
            "Afficher le mot de passe"
        );

    }

});


// CONNEXION CLIENT

loginForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    message.textContent = "";
    message.className = "message";

    const email = document.getElementById("email").value.trim();
    const password = passwordInput.value;

    const remember = document.getElementById("remember").checked;

    // VERIFICATION DES CHAMPS

    if (!email || !password) {

        showMessage(
            "Veuillez renseigner votre adresse e-mail et votre mot de passe.",
            "error"
        );

        return;
    }

    const button = loginForm.querySelector(".login-button");

    button.disabled = true;
    button.textContent = "CONNEXION EN COURS...";


    try {

        // ENVOI DES INFORMATIONS AU SERVEUR

        const response = await fetch("/api/auth/login", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            credentials: "include",

            body: JSON.stringify({
                email,
                password,
                remember
            })

        });


        const data = await response.json();


        // VERIFICATION DE LA REPONSE

        if (!response.ok) {

            throw new Error(
                data.message || "Adresse e-mail ou mot de passe incorrect."
            );

        }


        // CONNEXION REUSSIE

        showMessage(
            "Connexion réussie ! Bienvenue chez E.M.A.",
            "success"
        );

        loginForm.reset();

        setTimeout(() => {

            window.location.href = "../../index.html";

        }, 1500);


    } catch (error) {

        showMessage(
            error.message || "Impossible de contacter le serveur.",
            "error"
        );

    } finally {

        button.disabled = false;
        button.textContent = "SE CONNECTER";

    }

});


// AFFICHAGE DES MESSAGES

function showMessage(text, type) {

    message.textContent = text;
    message.className = "message " + type;

}