# SmartShop Frontend

Application de gestion commerciale pour MicroTech Maroc - Interface React

##  Technologies

- **React 18** - Framework UI
- **Vite** - Build tool & dev server
- **React Router** - Routing & navigation
- **Redux Toolkit** - State management
- **Axios** - HTTP client
- **React Hook Form** - Gestion des formulaires
- **Tailwind CSS** - Styling
- **Jest & React Testing Library** - Tests unitaires
- **Cypress** - Tests E2E

##  Installation

```bash
# Installer les dépendances
npm install

# Copier le fichier d'environnement
cp .env.example .env

# Démarrer le serveur de développement
npm run dev
```

L'application sera accessible sur `http://localhost:3000`

##  Configuration

Configurez les variables d'environnement dans le fichier `.env` :

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

##  Scripts disponibles

```bash

# Développement
npm run dev              # Démarre le serveur de développement

# Build
npm run build           # Crée le build de production
npm run preview         # Preview du build de production
<!--

# Tests
npm run test            # Lance les tests unitaires
npm run test:watch      # Tests en mode watch
npm run test:coverage   # Tests avec coverage

# E2E
npm run cypress         # Ouvre Cypress
npm run cypress:run     # Lance les tests Cypress en mode headless

# Linting
npm run lint            # Vérifie le code avec ESLint
-->

```

## 📁 Structure du projet

```
smartshop-frontend/
├── src/
│   ├── assets/           # Images, fonts, etc.
│   ├── components/       # Composants réutilisables
│   │   ├── common/       # Composants génériques (Button, Input, etc.)
│   │   ├── layout/       # Layout components (Header, Sidebar, etc.)
│   │   └── features/     # Composants métier
│   ├── pages/            # Pages de l'application
│   ├── services/         # Services API
│   ├── store/            # Redux store
│   │   ├── slices/       # Redux slices
│   │   └── store.js      # Configuration du store
│   ├── hooks/            # Custom hooks
│   ├── utils/            # Utilitaires
│   ├── routes/           # Configuration des routes
│   ├── App.jsx           # Composant racine
│   ├── main.jsx          # Point d'entrée
│   └── index.css         # Styles globaux
├── public/               # Assets statiques
├── cypress/              # Tests E2E
└── package.json
```

##  Authentification

L'application utilise une authentification basée sur des sessions HTTP avec cookies. Les rôles disponibles sont :

- **ADMIN** : Accès complet à toutes les fonctionnalités
- **CLIENT** : Accès limité aux fonctionnalités client

##  Fonctionnalités

### Authentification
-  Login / Logout
-  Gestion de session
-  Protection des routes par rôle

### Gestion des Clients (ADMIN)
-  Liste des clients
-  Création / Modification / Suppression
-  Profil client avec statistiques
-  Historique des commandes

### Gestion des Produits
-  Liste des produits (avec pagination)
-  CRUD produits (ADMIN uniquement)
-  Soft delete
-  Gestion du stock

### Gestion des Commandes
-  Création de commandes multi-produits
-  Calcul automatique des montants
-  Application des remises (fidélité + promo)
-  Gestion des statuts
-  Suivi des paiements

### Système de Fidélité
-  4 niveaux (BASIC, SILVER, GOLD, PLATINUM)
-  Calcul automatique des remises
-  Mise à jour automatique du niveau

### Paiements
-  Paiements multi-moyens (Espèces, Chèque, Virement)
-  Paiements fractionnés
-  Suivi du montant restant dû
<!--

## 🐳 Docker

```bash
# Build de l'image Docker
docker build -t smartshop-frontend .

# Lancer le conteneur
docker run -p 80:80 smartshop-frontend
```

## 🧪 Tests

Le projet utilise Jest et React Testing Library pour les tests unitaires, et Cypress pour les tests E2E.

```bash
# Tests unitaires
npm run test

# Tests E2E
npm run cypress
```
-->

##  Licence

Propriétaire - MicroTech Maroc © 2024