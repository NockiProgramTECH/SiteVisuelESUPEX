// Pour l'affichage dans le container des filières
const titleElement = document.querySelector(".entry-title u");
const imageElement = document.querySelector("#filiere-image");
const textElement = document.querySelector("#filiere-text");

// Sélection de TOUS les boutons de filière (querySelectorAll au lieu de querySelector)
const sidebarLinks = document.querySelectorAll(".filiere-btn");

// Objet qui contient chaque donnée de chaque filière 
const filieresData = {
    SIR: {
        title: "Système d’information et réseaux",
        image: "/img/SIR.jpg",
        text: "Voici la description complète de la filière Système d'information et réseaux..."
    },
    EII: {
        title: "Electronique Informatique Industriel",
        image: "/img/gbm.jpg",
        text: "Description de la filière Electronique INformatique Industriel",
    },

    RIT: {
        title: "Réseaux Informatiques et Télécommunications",
        image: "/img/RIT.avif",
        text: "Description de la filière Réseaux & Télécoms..."
    },
    ELM: {
        title: "Génie Electrique : Electromécanique",
        image: "/img/ETM.webp",
        text: "Description de la filière Electromécanique..."
    },
    GCC: {
        title: "Génie Civile: Construction",
        image: "/img/GCC.jpg",
        text: "Description de la filière Génie Electrique et Informatique Industrielle..."
    },
    ETH:{
        title:" Génie Electrique :ElectroTechnique",
        image:"/img/ETH.avif",
        text:"Description de la filiere ElectroTechnique"
    }

};

console.log("Nombre de boutons trouvés :", sidebarLinks.length);

sidebarLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        // Correction : preventDefault() (pas preventDefautl)
        e.preventDefault();
        
        // Correction : dataset.filiere (pas filliere)
        const filiere = this.dataset.filiere;
        const data = filieresData[filiere];

        console.log("Filière cliquée :", filiere);
        console.log("Données trouvées :", data);

        if (data) {
            // Correction : innerHTML -> textContent pour le titre
            // et innerHTML -> src pour l'image
            titleElement.textContent = data.title;
            imageElement.src = data.image;
            imageElement.alt = data.title;
            textElement.textContent = data.text;
            
            // Optionnel : Ajouter un effet visuel pour le bouton actif
            sidebarLinks.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        } else {
            // Message d'erreur si la filière n'est pas trouvée
            titleElement.textContent = "BTS";
            textElement.textContent = "Description non disponible pour cette filière.";
        }
    });
});

// Optionnel : Initialiser avec une filière par défaut
document.addEventListener('DOMContentLoaded', function() {
    // Sélectionner la première filière par défaut
    if (sidebarLinks.length > 0) {
        const defaultData = filieresData[sidebarLinks[0].dataset.filiere];
        if (defaultData) {
            titleElement.textContent = defaultData.title;
            imageElement.src = defaultData.image;
            imageElement.alt = defaultData.title;
            textElement.textContent = defaultData.text;
            sidebarLinks[0].classList.add('active');
        }
    }
});