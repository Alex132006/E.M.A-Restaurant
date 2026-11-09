document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("reservation-form");

    if (!form) return;

    const dateInput = document.getElementById("date");
    const heureInput = document.getElementById("heure");
    const personnesInput = document.getElementById("personnes");
    const nomInput = document.getElementById("nom");
    const telephoneInput = document.getElementById("telephone");
    const conditionsInput = document.getElementById("conditions");

    // Empêcher de sélectionner une date passée
    const aujourdHui = new Date();
    const annee = aujourdHui.getFullYear();
    const mois = String(aujourdHui.getMonth() + 1).padStart(2, "0");
    const jour = String(aujourdHui.getDate()).padStart(2, "0");

    dateInput.min = `${annee}-${mois}-${jour}`;

    // Gestion du formulaire
    form.addEventListener("submit", function (event) {

        event.preventDefault();

        // Vérification des champs
        if (
            !dateInput.value ||
            !heureInput.value ||
            !personnesInput.value ||
            !nomInput.value.trim() ||
            !telephoneInput.value.trim()
        ) {
            alert("Veuillez remplir tous les champs obligatoires.");
            return;
        }

        // Vérification de la date
        const dateChoisie = new Date(dateInput.value + "T00:00:00");
        const dateActuelle = new Date();
        dateActuelle.setHours(0, 0, 0, 0);

        if (dateChoisie < dateActuelle) {
            alert("Veuillez choisir une date valide.");
            return;
        }

        // Vérification du nombre de personnes
        const nombrePersonnes = Number(personnesInput.value);

        if (!Number.isInteger(nombrePersonnes) || nombrePersonnes < 1) {
            alert("Veuillez indiquer un nombre de personnes valide.");
            return;
        }

        // Vérification du téléphone
        const telephone = telephoneInput.value.trim();

        if (!/^[0-9+\s().-]{8,20}$/.test(telephone)) {
            alert("Veuillez saisir un numéro de téléphone valide.");
            return;
        }

        // Vérification des conditions
        if (!conditionsInput.checked) {
            alert("Veuillez accepter les conditions de réservation.");
            return;
        }

        // Confirmation des informations
        const nom = nomInput.value.trim();

        alert(
            "Merci " + nom + " !\n\n" +
            "Votre demande de réservation a été prise en compte sur cette page.\n\n" +
            "Notre équipe E.M.A devra confirmer votre réservation."
        );

        // Réinitialisation du formulaire
        form.reset();

        // Réappliquer la date minimale
        dateInput.min = `${annee}-${mois}-${jour}`;
    });

});