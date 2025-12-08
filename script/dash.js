// Dashboard Admin - Fonctionnalités complètes
class DashboardAdmin {
    constructor() {
        this.currentSection = 'etudiants';
        this.modal = new bootstrap.Modal(document.getElementById('crudModal'));
        this.confirmModal = new bootstrap.Modal(document.getElementById('confirmModal'));
        this.itemToDelete = null;
        
        this.initialize();
    }

    initialize() {
        this.bindEvents();
        this.loadDashboardData();
        this.loadSectionContent();
        this.initDataTable();
    }

    bindEvents() {
        // Navigation sidebar
        document.querySelectorAll('.sidebar-nav .nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const section = item.dataset.section || 'etudiants';
                this.switchSection(section);
            });
        });

        // Boutons d'action des statistiques
        document.querySelectorAll('.btn-action').forEach(btn => {
            btn.addEventListener('click', () => {
                const action = btn.dataset.action;
                this.handleStatAction(action);
            });
        });

        // Boutons d'ajout
        document.getElementById('addStudentBtn')?.addEventListener('click', () => this.showAddStudentForm());
        document.getElementById('addEmploiBtn')?.addEventListener('click', () => this.showAddEmploiForm());
        document.getElementById('addEventBtn')?.addEventListener('click', () => this.showAddEventForm());
        document.getElementById('addActualiteBtn')?.addEventListener('click', () => this.showAddActualiteForm());
        document.getElementById('addAnnonceBtn')?.addEventListener('click', () => this.showAddAnnonceForm());

        // Boutons d'actions rapides
        document.querySelectorAll('.quick-action-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const action = btn.dataset.action;
                this.handleQuickAction(action);
            });
        });

        // Modal Save
        document.getElementById('modalSaveBtn')?.addEventListener('click', () => this.saveItem());

        // Confirmation delete
        document.getElementById('confirmDeleteBtn')?.addEventListener('click', () => this.deleteItem());

        // Auto-refresh des statistiques toutes les 30 secondes
        setInterval(() => this.updateStats(), 30000);
    }

    switchSection(section) {
        // Mettre à jour la navigation active
        document.querySelectorAll('.sidebar-nav .nav-item').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.section === section) {
                item.classList.add('active');
            }
        });

        // Changer la section active
        document.querySelectorAll('.content-section').forEach(sec => {
            sec.classList.remove('active');
        });

        const targetSection = document.getElementById(`section-${section}`);
        if (targetSection) {
            targetSection.classList.add('active');
            this.currentSection = section;
            this.loadSectionContent();
        }
    }

    async loadDashboardData() {
        try {
            // Simuler le chargement des données
            const stats = await this.fetchStats();
            this.updateStatsDisplay(stats);
            
            // Charger les données de la section actuelle
            await this.loadSectionData();
        } catch (error) {
            console.error('Erreur de chargement des données:', error);
            this.showToast('Erreur de chargement des données', 'error');
        }
    }

    async fetchStats() {
        // Simulation de données
        return {
            totalStudents: 1250,
            newStudents: 48,
            emploisCount: 15,
            eventsCount: 8,
            actualitesCount: 12,
            annoncesCount: 5,
            growthRate: 5.2
        };
    }

    updateStatsDisplay(stats) {
        document.getElementById('totalStudents').textContent = stats.totalStudents.toLocaleString();
        document.getElementById('totalPreinscriptions').textContent = stats.newStudents;
        document.getElementById('totalEmplois').textContent = stats.emploisCount;
        document.getElementById('totalEvenements').textContent = stats.eventsCount;
    }

    async loadSectionContent() {
        switch (this.currentSection) {
            case 'etudiants':
                await this.loadStudents();
                break;
            case 'preinscriptions':
                await this.loadPreinscriptions();
                break;
            case 'emplois':
                await this.loadEmplois();
                break;
            case 'evenements':
                await this.loadEvents();
                break;
            case 'actualites':
                await this.loadActualites();
                break;
            case 'annonces':
                await this.loadAnnonces();
                break;
        }
    }

    // CRUD Étudiants
    async loadStudents() {
        const students = [
            { id: 1, matricule: 'N50GJ5', nom: 'Enock Lankoande', email: 'enock@esuex.edu', filiere: 'SIR', annee: '3ème', statut: 'actif' },
            { id: 2, matricule: 'N51HJ8', nom: 'Marie Konaté', email: 'marie@esuex.edu', filiere: 'GCC', annee: '2ème', statut: 'actif' },
            { id: 3, matricule: 'N49FK2', nom: 'Jean Traoré', email: 'jean@esuex.edu', filiere: 'RIT', annee: '4ème', statut: 'inactif' },
            { id: 4, matricule: 'N52LM9', nom: 'Sophie Ouédraogo', email: 'sophie@esuex.edu', filiere: 'SIR', annee: '1ère', statut: 'actif' },
            { id: 5, matricule: 'N48PR3', nom: 'David Sissoko', email: 'david@esuex.edu', filiere: 'GCC', annee: '3ème', statut: 'actif' }
        ];

        const tbody = document.getElementById('studentsTableBody');
        tbody.innerHTML = '';

        students.forEach(student => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><strong>${student.matricule}</strong></td>
                <td>${student.nom}</td>
                <td>${student.email}</td>
                <td><span class="badge bg-info">${student.filiere}</span></td>
                <td>${student.annee}</td>
                <td><span class="status status-${student.statut}">${student.statut}</span></td>
                <td>
                    <div class="btn-action-group">
                        <button class="btn-action-small btn-view" data-id="${student.id}" title="Voir">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn-action-small btn-edit" data-id="${student.id}" title="Modifier">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-action-small btn-delete" data-id="${student.id}" title="Supprimer">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });

        // Ajouter les événements aux boutons
        this.bindStudentActions();
    }

    bindStudentActions() {
        document.querySelectorAll('#studentsTableBody .btn-edit').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.dataset.id;
                this.showEditStudentForm(id);
            });
        });

        document.querySelectorAll('#studentsTableBody .btn-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.dataset.id;
                this.confirmDelete('student', id, 'Voulez-vous vraiment supprimer cet étudiant ?');
            });
        });

        document.querySelectorAll('#studentsTableBody .btn-view').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.dataset.id;
                this.viewStudent(id);
            });
        });
    }

    showAddStudentForm() {
        const modalTitle = document.getElementById('modalTitle');
        const modalBody = document.getElementById('modalBody');
        
        modalTitle.textContent = 'Ajouter un nouvel étudiant';
        modalBody.innerHTML = `
            <form id="studentForm">
                <div class="row">
                    <div class="col-md-6">
                        <div class="form-group">
                            <label>Matricule *</label>
                            <input type="text" class="form-control" id="matricule" required>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group">
                            <label>Nom complet *</label>
                            <input type="text" class="form-control" id="nom" required>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-6">
                        <div class="form-group">
                            <label>Email *</label>
                            <input type="email" class="form-control" id="email" required>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group">
                            <label>Téléphone</label>
                            <input type="tel" class="form-control" id="phone">
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-6">
                        <div class="form-group">
                            <label>Filière *</label>
                            <select class="form-select" id="filiere" required>
                                <option value="">Sélectionner</option>
                                <option value="SIR">Système d'Information et Réseau</option>
                                <option value="GCC">Génie Civil et Construction</option>
                                <option value="RIT">Réseaux et Télécommunications</option>
                            </select>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group">
                            <label>Année d'étude *</label>
                            <select class="form-select" id="annee" required>
                                <option value="">Sélectionner</option>
                                <option value="1ère">1ère année</option>
                                <option value="2ème">2ème année</option>
                                <option value="3ème">3ème année</option>
                                <option value="4ème">4ème année</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="form-group">
                    <label>Statut</label>
                    <select class="form-select" id="statut">
                        <option value="actif">Actif</option>
                        <option value="inactif">Inactif</option>
                        <option value="suspendu">Suspendu</option>
                    </select>
                </div>
            </form>
        `;

        document.getElementById('modalSaveBtn').dataset.action = 'add-student';
        this.modal.show();
    }

    showEditStudentForm(id) {
        // Simulation de récupération des données
        const student = {
            matricule: 'N50GJ5',
            nom: 'Enock Lankoande',
            email: 'enock@esuex.edu',
            phone: '+226 70 12 34 56',
            filiere: 'SIR',
            annee: '3ème',
            statut: 'actif'
        };

        const modalTitle = document.getElementById('modalTitle');
        const modalBody = document.getElementById('modalBody');
        
        modalTitle.textContent = 'Modifier l\'étudiant';
        modalBody.innerHTML = `
            <form id="studentForm">
                <input type="hidden" id="studentId" value="${id}">
                <div class="row">
                    <div class="col-md-6">
                        <div class="form-group">
                            <label>Matricule *</label>
                            <input type="text" class="form-control" id="matricule" value="${student.matricule}" required>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group">
                            <label>Nom complet *</label>
                            <input type="text" class="form-control" id="nom" value="${student.nom}" required>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-6">
                        <div class="form-group">
                            <label>Email *</label>
                            <input type="email" class="form-control" id="email" value="${student.email}" required>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group">
                            <label>Téléphone</label>
                            <input type="tel" class="form-control" id="phone" value="${student.phone}">
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-6">
                        <div class="form-group">
                            <label>Filière *</label>
                            <select class="form-select" id="filiere" required>
                                <option value="SIR" ${student.filiere === 'SIR' ? 'selected' : ''}>Système d'Information et Réseau</option>
                                <option value="GCC" ${student.filiere === 'GCC' ? 'selected' : ''}>Génie Civil et Construction</option>
                                <option value="RIT" ${student.filiere === 'RIT' ? 'selected' : ''}>Réseaux et Télécommunications</option>
                            </select>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group">
                            <label>Année d'étude *</label>
                            <select class="form-select" id="annee" required>
                                <option value="1ère" ${student.annee === '1ère' ? 'selected' : ''}>1ère année</option>
                                <option value="2ème" ${student.annee === '2ème' ? 'selected' : ''}>2ème année</option>
                                <option value="3ème" ${student.annee === '3ème' ? 'selected' : ''}>3ème année</option>
                                <option value="4ème" ${student.annee === '4ème' ? 'selected' : ''}>4ème année</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="form-group">
                    <label>Statut</label>
                    <select class="form-select" id="statut">
                        <option value="actif" ${student.statut === 'actif' ? 'selected' : ''}>Actif</option>
                        <option value="inactif" ${student.statut === 'inactif' ? 'selected' : ''}>Inactif</option>
                        <option value="suspendu" ${student.statut === 'suspendu' ? 'selected' : ''}>Suspendu</option>
                    </select>
                </div>
            </form>
        `;

        document.getElementById('modalSaveBtn').dataset.action = 'edit-student';
        this.modal.show();
    }

    // Autres méthodes CRUD pour les autres sections...
    async loadPreinscriptions() {
        const container = document.getElementById('preinscriptionsList');
        container.innerHTML = `
            <div class="card-item">
                <div class="card-item-header">
                    <h5 class="card-item-title">Enock Lankoande</h5>
                    <span class="card-item-date">Aujourd'hui, 10:30</span>
                </div>
                <div class="card-item-content">
                    <p><strong>Filière:</strong> Système d'Information et Réseau</p>
                    <p><strong>Documents:</strong> Diplôme, Relevé de notes, Photo</p>
                    <p class="text-warning"><i class="fas fa-clock me-1"></i> En attente de vérification</p>
                </div>
                <div class="card-item-actions">
                    <button class="btn btn-sm btn-success" data-action="approve">
                        <i class="fas fa-check me-1"></i>Approuver
                    </button>
                    <button class="btn btn-sm btn-danger" data-action="reject">
                        <i class="fas fa-times me-1"></i>Rejeter
                    </button>
                    <button class="btn btn-sm btn-info" data-action="view-docs">
                        <i class="fas fa-file-pdf me-1"></i>Voir documents
                    </button>
                </div>
            </div>
        `;
    }

    async loadEmplois() {
        const container = document.getElementById('emploisList');
        container.innerHTML = `
            <div class="col-md-4 mb-3">
                <div class="card-item">
                    <div class="card-item-header">
                        <h5 class="card-item-title">SIR - 3ème année</h5>
                        <span class="badge bg-success">Publié</span>
                    </div>
                    <div class="card-item-content">
                        <p><strong>Semestre:</strong> S6</p>
                        <p><strong>Période:</strong> Janvier - Mars 2024</p>
                        <p><strong>Dernière modification:</strong> 15/12/2023</p>
                    </div>
                    <div class="card-item-actions">
                        <button class="btn-action-small btn-view">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn-action-small btn-edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-action-small btn-delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    async loadEvents() {
        const container = document.getElementById('eventsList');
        container.innerHTML = `
            <div class="card-item">
                <div class="card-item-header">
                    <h5 class="card-item-title">Journée Portes Ouvertes 2024</h5>
                    <span class="badge bg-primary">À venir</span>
                </div>
                <div class="card-item-content">
                    <p><strong>Date:</strong> 20 Janvier 2024</p>
                    <p><strong>Lieu:</strong> Campus Principal</p>
                    <p>Présentation des formations et rencontres avec les enseignants</p>
                </div>
                <div class="card-item-actions">
                    <button class="btn btn-sm btn-primary">Publier</button>
                    <button class="btn btn-sm btn-warning">Modifier</button>
                </div>
            </div>
        `;
    }

    async loadActualites() {
        const container = document.getElementById('actualitesList');
        container.innerHTML = `
            <div class="card-item">
                <div class="card-item-header">
                    <h5 class="card-item-title">Nouveau laboratoire informatique</h5>
                    <span class="badge bg-success">Publié</span>
                </div>
                <div class="card-item-content">
                    <p>Inauguration du nouveau laboratoire équipé des dernières technologies...</p>
                    <p class="text-muted"><small>Publié le: 10/12/2023</small></p>
                </div>
                <div class="card-item-actions">
                    <button class="btn-action-small btn-view">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-action-small btn-edit">
                        <i class="fas fa-edit"></i>
                    </button>
                </div>
            </div>
        `;
    }

    async loadAnnonces() {
        const container = document.getElementById('annoncesList');
        container.innerHTML = `
            <div class="card-item">
                <div class="card-item-header">
                    <h5 class="card-item-title">Fermeture exceptionnelle</h5>
                    <span class="badge bg-danger">Important</span>
                </div>
                <div class="card-item-content">
                    <p>Le campus sera fermé le 25 décembre pour les fêtes de Noël.</p>
                    <p class="text-muted"><small>Publié le: 20/12/2023</small></p>
                </div>
                <div class="card-item-actions">
                    <button class="btn-action-small btn-edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-action-small btn-delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }

    // Méthodes utilitaires
    saveItem() {
        const action = document.getElementById('modalSaveBtn').dataset.action;
        
        // Simulation de sauvegarde
        this.showToast('Enregistrement réussi !', 'success');
        this.modal.hide();
        
        // Recharger les données
        setTimeout(() => this.loadSectionContent(), 500);
    }

    confirmDelete(type, id, message) {
        this.itemToDelete = { type, id };
        document.getElementById('confirmMessage').textContent = message;
        this.confirmModal.show();
    }

    deleteItem() {
        if (this.itemToDelete) {
            // Simulation de suppression
            this.showToast('Élément supprimé avec succès', 'success');
            this.confirmModal.hide();
            
            // Recharger les données
            setTimeout(() => this.loadSectionContent(), 500);
            
            this.itemToDelete = null;
        }
    }

    handleStatAction(action) {
        switch(action) {
            case 'view-students':
                this.switchSection('etudiants');
                break;
            case 'review-documents':
                this.switchSection('preinscriptions');
                break;
            case 'add-emploi':
                this.showAddEmploiForm();
                break;
            case 'add-event':
                this.showAddEventForm();
                break;
        }
    }

    handleQuickAction(action) {
        switch(action) {
            case 'send-notification':
                this.showNotificationForm();
                break;
            case 'export-data':
                this.exportData();
                break;
            case 'backup-system':
                this.createBackup();
                break;
            case 'clear-cache':
                this.clearCache();
                break;
        }
    }

    showNotificationForm() {
        this.showToast('Fonctionnalité en développement', 'info');
    }

    exportData() {
        this.showToast('Export des données démarré...', 'info');
        // Simulation d'export
        setTimeout(() => {
            this.showToast('Export terminé ! Téléchargement en cours...', 'success');
        }, 2000);
    }

    createBackup() {
        this.showToast('Sauvegarde système en cours...', 'info');
        // Simulation de sauvegarde
        setTimeout(() => {
            this.showToast('Sauvegarde terminée avec succès !', 'success');
        }, 3000);
    }

    clearCache() {
        this.showToast('Cache vidé avec succès', 'success');
    }

    showToast(message, type = 'info') {
        // Créer un toast simple
        const toast = document.createElement('div');
        toast.className = `toast-notification toast-${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'} me-2"></i>
                ${message}
            </div>
        `;
        
        document.body.appendChild(toast);
        
        // Animation d'entrée
        setTimeout(() => toast.classList.add('show'), 10);
        
        // Supprimer après 3 secondes
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    updateStats() {
        // Simuler une mise à jour des statistiques
        const studentsElement = document.getElementById('totalStudents');
        const current = parseInt(studentsElement.textContent.replace(/,/g, ''));
        const newCount = current + Math.floor(Math.random() * 5);
        studentsElement.textContent = newCount.toLocaleString();
        
        this.showToast('Statistiques mises à jour', 'info');
    }

    initDataTable() {
        if ($.fn.DataTable) {
            $('#studentsTable').DataTable({
                language: {
                    url: '//cdn.datatables.net/plug-ins/1.13.4/i18n/fr-FR.json'
                },
                pageLength: 10,
                responsive: true
            });
        }
    }
}

// Initialiser le dashboard quand la page est chargée
document.addEventListener('DOMContentLoaded', () => {
    const dashboard = new DashboardAdmin();
    
    // Ajouter les styles pour les toasts
    const style = document.createElement('style');
    style.textContent = `
        .toast-notification {
            position: fixed;
            top: 100px;
            right: 20px;
            background: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            z-index: 9999;
            transform: translateX(120%);
            transition: transform 0.3s ease;
            border-left: 4px solid #007bff;
        }
        .toast-notification.show {
            transform: translateX(0);
        }
        .toast-success { border-left-color: #28a745; }
        .toast-error { border-left-color: #dc3545; }
        .toast-info { border-left-color: #17a2b8; }
        .toast-warning { border-left-color: #ffc107; }
        .toast-content {
            display: flex;
            align-items: center;
            font-weight: 500;
        }
    `;
    document.head.appendChild(style);
});