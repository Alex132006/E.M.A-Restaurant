const forgotPasswordForm = document.getElementById("forgotPasswordForm");
const message = document.getElementById("message");

forgotPasswordForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    message.textContent = "";
    message.className = "message";

    const email = document.getElementById("email").value.trim();

    // VERIFICATION

    if (!email) {
        showMessage("Veuillez saisir votre adresse e-mail.", "error");
        return;
    }

    const button = forgotPasswordForm.querySelector(".reset-button");

    button.disabled = true;
    button.textContent = "ENVOI EN COURS...";

    try {

        // ENVOI DE LA DEMANDE AU SERVEUR

        const response = await fetch("/api/auth/forgot-password", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                email
            })

        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Une erreur est survenue."
            );
        }

        // CONFIRMATION

        showMessage(
            data.message ||
            "Si cette adresse correspond à un compte, vous recevrez un e-mail contenant les instructions de réinitialisation.",
            "success"
        );

        forgotPasswordForm.reset();

    } catch (error) {

        showMessage(
            error.message || "Impossible de contacter le serveur. Réessayez plus tard.",
            "error"
        );

    } finally {

        button.disabled = false;
        button.textContent = "ENVOYER LES INSTRUCTIONS";

    }

});


// AFFICHAGE DES MESSAGES

function showMessage(text, type) {

    message.textContent = text;
    message.className = "message " + type;

}