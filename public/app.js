// État de l'application
let currentUser = null;
let currentPage = 'tableau-de-bord';

// Initialiser l'application
function init() {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
        currentUser = JSON.parse(storedUser);
        showDashboard();
    } else {
        showLogin();
    }
}

// Afficher la page de connexion
function showLogin() {
    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="login-container">
            <h1>📚 Grand Paris</h1>
            <p class="subtitle">Établissement RP Discord</p>
            <form id="loginForm">
                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" id="email" name="email" required>
                </div>
                <div class="form-group">
                    <label for="password">Mot de passe</label>
                    <input type="password" id="password" name="password" required>
                </div>
                <button type="submit" class="btn-login">Se connecter</button>
            </form>
            <div class="demo-credentials">
                <strong>Identifiants de démo :</strong><br>
                Élève: <strong>jean.dupont@grandparis.fr</strong> / <strong>eleve123</strong><br>
                Admin: <strong>admin@grandparis.fr</strong> / <strong>admin123</strong>
            </div>
        </div>
    `;
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
}

// Gérer la connexion
async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) throw new Error('Connexion échouée');
        
        currentUser = await response.json();
        localStorage.setItem('user', JSON.stringify(currentUser));
        showDashboard();
    } catch (error) {
        alert('Erreur: ' + error.message);
    }
}

// Afficher le tableau de bord
function showDashboard() {
    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="dashboard">
            <div class="sidebar">
                <h2>Menu</h2>
                <ul class="sidebar-menu">
                    <li><button class="menu-btn active" data-page="tableau-de-bord">📊 Tableau de bord</button></li>
                    <li><button class="menu-btn" data-page="notes">📈 Notes</button></li>
                    <li><button class="menu-btn" data-page="devoirs">📝 Devoirs</button></li>
                    <li><button class="menu-btn" data-page="emploi-temps">⏰ Emploi du temps</button></li>
                    ${currentUser.role === 'eleve' ? '<li><button class="menu-btn" data-page="absences">❌ Absences</button></li>' : ''}
                    <li><button class="menu-btn" data-page="annonces">📣 Annonces</button></li>
                    <li><button class="menu-btn" data-page="messages">💬 Messages</button></li>
                    <li><button class="menu-btn" data-page="parametres">⚙️ Paramètres</button></li>
                    <li><button class="menu-btn" id="logoutBtn" style="color: #ffcccc; margin-top: 20px;">🚪 Déconnexion</button></li>
                </ul>
            </div>
            <div class="main-content">
                <div class="header">
                    <h1>Pronote</h1>
                    <div class="user-info">
                        <span>👤 ${currentUser.prenom} ${currentUser.nom}</span>
                        <span>👥 ${currentUser.classe || currentUser.matiere}</span>
                    </div>
                </div>
                <div id="content"></div>
            </div>
        </div>
    `;

    // Event listeners
    document.querySelectorAll('.menu-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (e.target.id === 'logoutBtn') {
                handleLogout();
            } else {
                currentPage = e.target.dataset.page;
                document.querySelectorAll('.menu-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                loadPage(currentPage);
            }
        });
    });

    loadPage('tableau-de-bord');
}

// Charger une page
async function loadPage(page) {
    const content = document.getElementById('content');
    
    switch(page) {
        case 'tableau-de-bord':
            loadTableauDeBord();
            break;
        case 'notes':
            loadNotes();
            break;
        case 'devoirs':
            loadDevoirs();
            break;
        case 'emploi-temps':
            loadEmploiDuTemps();
            break;
        case 'absences':
            loadAbsences();
            break;
        case 'annonces':
            loadAnnonces();
            break;
        case 'messages':
            loadMessages();
            break;
        case 'parametres':
            loadParametres();
            break;
    }
}

// Tableau de bord
async function loadTableauDeBord() {
    const content = document.getElementById('content');
    content.innerHTML = `
        <div class="card">
            <h2>Bienvenue, ${currentUser.prenom}! 👋</h2>
            <p style="color: #666; margin-bottom: 20px;">Vous êtes connecté en tant que <strong>${currentUser.role}</strong> dans la classe <strong>${currentUser.classe || currentUser.matiere}</strong></p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px;">
            <div class="card" style="text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
                <div style="font-size: 24px; margin-bottom: 10px;">📊</div>
                <h3 style="margin: 10px 0;">Moyenne</h3>
                <p style="font-size: 24px; font-weight: bold; margin-top: 10px;">15.33</p>
            </div>
            <div class="card" style="text-align: center; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white;">
                <div style="font-size: 24px; margin-bottom: 10px;">📝</div>
                <h3 style="margin: 10px 0;">Devoirs</h3>
                <p style="font-size: 24px; font-weight: bold; margin-top: 10px;">3</p>
            </div>
            <div class="card" style="text-align: center; background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white;">
                <div style="font-size: 24px; margin-bottom: 10px;">⏰</div>
                <h3 style="margin: 10px 0;">Cours aujourd'hui</h3>
                <p style="font-size: 24px; font-weight: bold; margin-top: 10px;">4</p>
            </div>
        </div>

        <div class="card">
            <h2>📣 Dernières annonces</h2>
            <div id="annoncesPreview"></div>
        </div>
    `;

    try {
        const response = await fetch('/api/annonces');
        const annonces = await response.json();
        const preview = annonces.slice(0, 3).map(a => `
            <div class="annonce-item">
                <div class="titre">${a.titre}</div>
                <div class="contenu">${a.contenu}</div>
                <div class="meta">${a.date} - ${a.auteur}</div>
            </div>
        `).join('');
        document.getElementById('annoncesPreview').innerHTML = preview;
    } catch (error) {
        console.error('Erreur:', error);
    }
}

// Notes
async function loadNotes() {
    const content = document.getElementById('content');
    content.innerHTML = '<div class="card"><p>Chargement...</p></div>';

    try {
        const response = await fetch(`/api/notes/${currentUser.id}`);
        const data = await response.json();
        
        let html = `
            <div class="moyenne">
                <div class="label">Moyenne générale</div>
                <div class="valeur">${data.moyenne}</div>
            </div>
            <div class="card">
                <h2>Mes notes</h2>
                <div class="notes-container">
        `;
        
        data.notes.forEach(note => {
            html += `
                <div class="note-card">
                    <div class="matiere">${note.matiere}</div>
                    <div class="note">${note.note}/20</div>
                    <div class="date">${note.date}</div>
                </div>
            `;
        });
        
        html += '</div></div>';
        content.innerHTML = html;
    } catch (error) {
        content.innerHTML = '<div class="card"><p>Erreur de chargement</p></div>';
    }
}

// Devoirs
async function loadDevoirs() {
    const content = document.getElementById('content');
    content.innerHTML = '<div class="card"><p>Chargement...</p></div>';

    try {
        const response = await fetch(`/api/devoirs/${currentUser.classe}`);
        const devoirs = await response.json();
        
        let html = '<div class="card"><h2>Mes devoirs</h2><table>';
        html += '<tr><th>Matière</th><th>Description</th><th>Date limite</th><th>Professeur</th></tr>';
        
        devoirs.forEach(devoir => {
            html += `
                <tr>
                    <td><strong>${devoir.matiere}</strong></td>
                    <td>${devoir.description}</td>
                    <td>${devoir.dateEcheance}</td>
                    <td>${devoir.prof}</td>
                </tr>
            `;
        });
        
        html += '</table></div>';
        content.innerHTML = html;
    } catch (error) {
        content.innerHTML = '<div class="card"><p>Erreur de chargement</p></div>';
    }
}

// Emploi du temps
async function loadEmploiDuTemps() {
    const content = document.getElementById('content');
    content.innerHTML = '<div class="card"><p>Chargement...</p></div>';

    try {
        const response = await fetch(`/api/emploi-du-temps/${currentUser.classe}`);
        const emplois = await response.json();
        
        let html = '<div class="card"><h2>Emploi du temps</h2><table>';
        html += '<tr><th>Jour</th><th>Heure</th><th>Matière</th><th>Professeur</th><th>Salle</th></tr>';
        
        emplois.forEach(emploi => {
            html += `
                <tr>
                    <td><strong>${emploi.jour}</strong></td>
                    <td>${emploi.heure}</td>
                    <td>${emploi.matiere}</td>
                    <td>${emploi.prof}</td>
                    <td>${emploi.salle}</td>
                </tr>
            `;
        });
        
        html += '</table></div>';
        content.innerHTML = html;
    } catch (error) {
        content.innerHTML = '<div class="card"><p>Erreur de chargement</p></div>';
    }
}

// Absences
async function loadAbsences() {
    const content = document.getElementById('content');
    content.innerHTML = '<div class="card"><p>Chargement...</p></div>';

    try {
        const response = await fetch(`/api/absences/${currentUser.id}`);
        const absences = await response.json();
        
        let html = '<div class="card"><h2>Mes absences</h2><table>';
        html += '<tr><th>Date</th><th>Durée</th><th>Motif</th><th>Statut</th></tr>';
        
        absences.forEach(absence => {
            const badge = absence.justifie ? '<span class="badge justifie">✓ Justifiée</span>' : '<span class="badge non-justifie">✗ Non justifiée</span>';
            html += `
                <tr>
                    <td>${absence.date}</td>
                    <td>${absence.duree}</td>
                    <td>${absence.motif}</td>
                    <td>${badge}</td>
                </tr>
            `;
        });
        
        html += '</table></div>';
        content.innerHTML = html;
    } catch (error) {
        content.innerHTML = '<div class="card"><p>Erreur de chargement</p></div>';
    }
}

// Annonces
async function loadAnnonces() {
    const content = document.getElementById('content');
    content.innerHTML = '<div class="card"><p>Chargement...</p></div>';

    try {
        const response = await fetch('/api/annonces');
        const annonces = await response.json();
        
        let html = '<div class="card"><h2>Toutes les annonces</h2>';
        annonces.forEach(annonce => {
            html += `
                <div class="annonce-item">
                    <div class="titre">${annonce.titre}</div>
                    <div class="contenu">${annonce.contenu}</div>
                    <div class="meta">${annonce.date} - ${annonce.auteur}</div>
                </div>
            `;
        });
        html += '</div>';
        content.innerHTML = html;
    } catch (error) {
        content.innerHTML = '<div class="card"><p>Erreur de chargement</p></div>';
    }
}

// Messages
function loadMessages() {
    document.getElementById('content').innerHTML = `
        <div class="card">
            <h2>💬 Messagerie</h2>
            <p style="color: #666; margin-bottom: 20px;">Fonctionnalité à venir...</p>
            <div style="background: #f0f4ff; padding: 15px; border-radius: 5px; color: #555; font-size: 14px;">
                La messagerie vous permettra de communiquer avec les professeurs et les autres élèves.
            </div>
        </div>
    `;
}

// Paramètres
function loadParametres() {
    document.getElementById('content').innerHTML = `
        <div class="card">
            <h2>⚙️ Paramètres</h2>
            <div style="margin-top: 20px;">
                <h3 style="margin-bottom: 15px; color: #333;">Informations du compte</h3>
                <table>
                    <tr>
                        <td style="padding: 10px; color: #666;"><strong>Nom</strong></td>
                        <td style="padding: 10px;">${currentUser.nom}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; color: #666;"><strong>Prénom</strong></td>
                        <td style="padding: 10px;">${currentUser.prenom}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; color: #666;"><strong>Email</strong></td>
                        <td style="padding: 10px;">${currentUser.email}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; color: #666;"><strong>Rôle</strong></td>
                        <td style="padding: 10px; text-transform: capitalize;">${currentUser.role}</td>
                    </tr>
                    ${currentUser.classe ? `<tr><td style="padding: 10px; color: #666;"><strong>Classe</strong></td><td style="padding: 10px;">${currentUser.classe}</td></tr>` : ''}
                </table>
            </div>
        </div>
    `;
}

// Déconnexion
function handleLogout() {
    localStorage.removeItem('user');
    currentUser = null;
    showLogin();
}

// Démarrer l'app
init();
