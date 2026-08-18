const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Base de données mockée
const users = [
  { id: 1, nom: 'Dupont', prenom: 'Jean', email: 'jean.dupont@grandparis.fr', role: 'eleve', classe: '1A', password: 'eleve123' },
  { id: 2, nom: 'Martin', prenom: 'Sophie', email: 'sophie.martin@grandparis.fr', role: 'prof', matiere: 'Mathématiques' },
  { id: 3, nom: 'Admin', prenom: 'Grand', email: 'admin@grandparis.fr', role: 'admin', password: 'admin123' }
];

const classes = [
  { id: 1, nom: '1A', niveau: 'Première', responsable: 'Martin Sophie' },
  { id: 2, nom: '2B', niveau: 'Terminale', responsable: 'Lefevre Pierre' },
  { id: 3, nom: '3C', niveau: 'Troisième', responsable: 'Rousseau Marie' }
];

const notes = [
  { id: 1, eleveId: 1, matiere: 'Mathématiques', note: 15, coefficient: 2, date: '2026-08-15' },
  { id: 2, eleveId: 1, matiere: 'Français', note: 14, coefficient: 2, date: '2026-08-16' },
  { id: 3, eleveId: 1, matiere: 'Histoire', note: 16, coefficient: 1, date: '2026-08-17' }
];

const devoirs = [
  { id: 1, classe: '1A', matiere: 'Mathématiques', description: 'Exercices 12-15 page 45', dateEcheance: '2026-08-20', prof: 'Martin Sophie' },
  { id: 2, classe: '1A', matiere: 'Français', description: 'Résumé du chapitre 3', dateEcheance: '2026-08-21', prof: 'Lefevre Pierre' },
  { id: 3, classe: '1A', matiere: 'Anglais', description: 'Vocabulaire unit 5', dateEcheance: '2026-08-22', prof: 'Rousseau Marie' }
];

const absences = [
  { id: 1, eleveId: 1, date: '2026-08-10', duree: '2h', motif: 'Rendez-vous médical', justifie: true },
  { id: 2, eleveId: 1, date: '2026-08-12', duree: '4h', motif: 'Absent', justifie: false }
];

// Routes API

// LOGIN
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  
  if (!user) {
    return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
  }
  
  res.json({
    id: user.id,
    nom: user.nom,
    prenom: user.prenom,
    email: user.email,
    role: user.role,
    classe: user.classe,
    matiere: user.matiere
  });
});

// INFOS UTILISATEUR
app.get('/api/user/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });
  res.json(user);
});

// NOTES
app.get('/api/notes/:eleveId', (req, res) => {
  const notesEleve = notes.filter(n => n.eleveId === parseInt(req.params.eleveId));
  const moyenne = notesEleve.reduce((acc, n) => acc + n.note * n.coefficient, 0) / notesEleve.reduce((acc, n) => acc + n.coefficient, 0);
  res.json({ notes: notesEleve, moyenne: moyenne.toFixed(2) });
});

// DEVOIRS
app.get('/api/devoirs/:classe', (req, res) => {
  const devoirsClasse = devoirs.filter(d => d.classe === req.params.classe);
  res.json(devoirsClasse);
});

// ABSENCES
app.get('/api/absences/:eleveId', (req, res) => {
  const absencesEleve = absences.filter(a => a.eleveId === parseInt(req.params.eleveId));
  res.json(absencesEleve);
});

// CLASSES
app.get('/api/classes', (req, res) => {
  res.json(classes);
});

// ANNONCES
app.get('/api/annonces', (req, res) => {
  const annonces = [
    { id: 1, titre: 'Rentrée scolaire', contenu: 'Les cours reprennent le 1er septembre', date: '2026-08-18', auteur: 'Admin' },
    { id: 2, titre: 'Modification emploi du temps', contenu: 'Le mercredi 25 août, pas de cours', date: '2026-08-17', auteur: 'Admin' },
    { id: 3, titre: 'Sortie pédagogique', contenu: 'Sortie au musée pour les 1A le 30 août', date: '2026-08-16', auteur: 'Martin Sophie' }
  ];
  res.json(annonces);
});

// EMPLOI DU TEMPS
app.get('/api/emploi-du-temps/:classe', (req, res) => {
  const emploiDuTemps = [
    { jour: 'Lundi', heure: '08:00-09:00', matiere: 'Mathématiques', prof: 'Martin Sophie', salle: '101' },
    { jour: 'Lundi', heure: '09:00-10:00', matiere: 'Français', prof: 'Lefevre Pierre', salle: '102' },
    { jour: 'Mardi', heure: '08:00-09:00', matiere: 'Anglais', prof: 'Rousseau Marie', salle: '103' },
    { jour: 'Mardi', heure: '10:00-11:00', matiere: 'Histoire', prof: 'Dupont Jean', salle: '104' },
    { jour: 'Mercredi', heure: '08:00-09:00', matiere: 'SVT', prof: 'Bernard Claude', salle: '105' },
    { jour: 'Jeudi', heure: '09:00-10:00', matiere: 'EPS', prof: 'Moreau Laurent', salle: 'Gymnase' },
    { jour: 'Vendredi', heure: '08:00-09:00', matiere: 'Informatique', prof: 'Petit Michel', salle: '201' }
  ];
  res.json(emploiDuTemps);
});

// DÉMARRAGE DU SERVEUR
app.listen(PORT, () => {
  console.log(`🚀 Serveur Pronote Grand Paris lancé sur http://localhost:${PORT}`);
});
