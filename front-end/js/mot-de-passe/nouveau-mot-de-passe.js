const resetForm = document.getElementById("resetPasswordForm");

const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirmPassword");

const message = document.getElementById("message");

// RECUPERATION DU TOKEN DANS L'URL

const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get("token");

// VERIFICATION DE LA PRESENCE DU TOKEN

if (!token) {

    showMessage(
        "Lien de réinitialisation invalide ou incomplet. Veuillez refaire une demande.",
        "error"
    );

    resetForm.querySelector(".reset-button").disabled = true;

}

// AFFICHER / MASQUER LES MOTS DE PASSE

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

// VERIFICATION DES CRITERES DU MOT DE PASSE

function checkPasswordRules() {

    const password = passwordInput.value;

    const rules = {
        length: password.length >= 8,
        letter: /[a-zA-Z]/.test(password),
        number: /[0-9]/.test(password)
    };

    document.getElementById("lengthRule")
        .classList.toggle("valid", rules.length);

    document.getElementById("letterRule")
        .classList.toggle("valid", rules.letter);

    document.getElementById("numberRule")
        .classList.toggle("valid", rules.number);

    return Object.values(rules).every(Boolean);

}

passwordInput.addEventListener("input", checkPasswordRules);

// ENVOI DU NOUVEAU MOT DE PASSE

resetForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    message.textContent = "";
    message.className = "message";

    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    // VERIFICATION DU TOKEN

    if (!token) {

        showMessage(
            "Lien invalide. Veuillez demander une nouvelle réinitialisation.",
            "error"
        );

        return;
    }

    // VERIFICATION DU MOT DE PASSE

    if (!checkPasswordRules()) {

        showMessage(
            "Votre mot de passe ne respecte pas les critères de sécurité.",
            "error"
        );

        return;
    }

    // VERIFICATION DE LA CONFIRMATION

    if (password !== confirmPassword) {

        showMessage(
            "Les deux mots de passe ne correspondent pas.",
            "error"
        );

        return;
    }

    const button = resetForm.querySelector(".reset-button");

    button.disabled = true;
    button.textContent = "MODIFICATION EN COURS...";

    try {

        // ENVOI AU SERVEUR NODE.JS

        const response = await fetch("/api/auth/reset-password", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                token,
                password
            })

        });

        const data = await response.json();

        if (!response.ok) {

            throw new Error(
                data.message || "Impossible de modifier le mot de passe."
            );

        }

        // SUCCES

        showMessage(
            "Votre mot de passe a été modifié avec succès. Redirection vers la connexion...",
            "success"
        );

        resetForm.reset();
        checkPasswordRules();

        setTimeout(() => {

            window.location.href = "connexion.html";

        }, 2500);

    } catch (error) {

        showMessage(
            error.message || "Une erreur est survenue. Réessayez.",
            "error"
        );

    } finally {

        button.disabled = false;
        button.textContent = "MODIFIER MON MOT DE PASSE";

    }

});

// AFFICHAGE DES MESSAGES

function showMessage(text, type) {

    message.textContent = text;
    message.className = "message " + type;

}