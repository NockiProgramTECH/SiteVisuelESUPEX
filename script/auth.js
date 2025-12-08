// Gestionnaire de mot de passe
document.addEventListener('DOMContentLoaded', function() {
    // Fonction pour basculer la visibilité du mot de passe
    function setupPasswordToggle() {
        const toggleButtons = document.querySelectorAll('.toggle-password');
        
        toggleButtons.forEach(button => {
            button.addEventListener('click', function() {
                const input = this.parentElement.querySelector('input');
                const icon = this.querySelector('i');
                
                if (input.type === 'password') {
                    input.type = 'text';
                    icon.classList.remove('fa-eye');
                    icon.classList.add('fa-eye-slash');
                } else {
                    input.type = 'password';
                    icon.classList.remove('fa-eye-slash');
                    icon.classList.add('fa-eye');
                }
            });
        });
    }
    
    // Fonction pour vérifier la force du mot de passe
    function setupPasswordStrength() {
        const passwordInput = document.getElementById('password');
        const strengthBar = document.querySelector('.strength-bar');
        const strengthText = document.querySelector('.strength-text');
        
        if (passwordInput && strengthBar) {
            passwordInput.addEventListener('input', function() {
                const password = this.value;
                let strength = 0;
                
                if (password.length >= 8) strength += 25;
                if (/[A-Z]/.test(password)) strength += 25;
                if (/[0-9]/.test(password)) strength += 25;
                if (/[^A-Za-z0-9]/.test(password)) strength += 25;
                
                strengthBar.style.setProperty('--strength', strength + '%');
                
                // Mettre à jour la couleur et le texte
                if (strength < 50) {
                    strengthBar.style.backgroundColor = '#dc3545';
                    strengthText.textContent = 'Faible';
                } else if (strength < 75) {
                    strengthBar.style.backgroundColor = '#ffc107';
                    strengthText.textContent = 'Moyen';
                } else {
                    strengthBar.style.backgroundColor = '#28a745';
                    strengthText.textContent = 'Fort';
                }
            });
        }
    }
    
    // Gestionnaire de formulaire de connexion
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const errorMessage = document.getElementById('errorMessage');
            const loginBtn = document.getElementById('loginBtn');
            
            // Simulation de chargement
            loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Connexion...';
            loginBtn.disabled = true;
            
            // Simulation d'authentification
            setTimeout(() => {
                // Ici, vous ajouterez votre logique d'authentification réelle
                const email = document.getElementById('full_name').value;
                const password = document.getElementById('password').value;
                
                // Exemple de vérification basique
                if (email && password) {
                    // Connexion réussie
                    window.location.href = 'dashboard.html';
                } else {
                    // Échec de connexion
                    errorMessage.style.display = 'block';
                    loginBtn.innerHTML = '<span>Se connecter</span>';
                    loginBtn.disabled = false;
                }
            }, 1500);
        });
    }
    
    // Gestionnaire de formulaire d'inscription
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const successMessage = document.getElementById('successMessage');
            const registerBtn = document.getElementById('registerBtn');
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm_password').value;
            
            // Vérifier que les mots de passe correspondent
            if (password !== confirmPassword) {
                alert('Les mots de passe ne correspondent pas.');
                return;
            }
            
            // Simulation de chargement
            registerBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Création du compte...';
            registerBtn.disabled = true;
            
            // Simulation d'inscription
            setTimeout(() => {
                successMessage.style.display = 'block';
                
                // Redirection après succès
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);
            }, 1500);
        });
    }
    
    // Initialisation
    setupPasswordToggle();
    setupPasswordStrength();
});