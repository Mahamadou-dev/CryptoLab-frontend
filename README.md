CryptoLab : Un Laboratoire de Cryptographie Interactif

CryptoLab est une plateforme web pédagogique conçue pour démystifier la cryptographie. L'objectif est de transformer des concepts théoriques et complexes (comme AES, DES, ou RSA) en expériences interactives et visuelles.

🎯 Le But du Projet

La cryptographie est souvent perçue comme une "boîte noire" mathématique. Ce projet a pour but d'ouvrir cette boîte.

Au lieu de simplement lire sur le fonctionnement d'un algorithme, CryptoLab permet aux utilisateurs de :

Tester les algorithmes en direct avec leurs propres données.

Visualiser chaque étape intermédiaire du processus (ex: les "rounds" de DES, la création de la matrice d'état d'AES).

Comprendre la différence fondamentale entre le chiffrement symétrique, asymétrique et les fonctions de hachage.

C'est un outil pensé pour les étudiants, les développeurs curieux et les passionnés de cybersécurité qui veulent comprendre comment la sécurité moderne fonctionne de l'intérieur.

🚀 Démo Live

Frontend (Next.js) : https://cryptolab.vercel.app/ 

Backend (API Docs) : https://cryptolab-api.onrender.com/docs

✨ Fonctionnalités Principales

Simulateur Interactif : Testez 8 algorithmes majeurs :

Classiques : César, Vigenère, Playfair

Symétriques : DES, AES

Asymétriques : RSA (génération de clés, chiffrement, déchiffrement)

Hachage : SHA-256, Bcrypt (avec vérification)

Visualisation Étape par Étape : Une fonctionnalité unique pour voir ce qui se passe à l'intérieur d'algorithmes complexes (César, Vigenère, Playfair, DES, AES).

Architecture Découplée : Un frontend Next.js rapide et un backend API Python (FastAPI) robuste.

Interface Moderne : Design épuré inspiré de Gemini, avec support du mode sombre et multilingue (FR/EN).

🛠️ Stack Technique

Ce projet utilise une architecture "headless" (découplée) :

Frontend (Déployé sur Vercel)

Next.js 14 (App Router)

React & TypeScript

TailwindCSS

Shadcn/ui (pour les composants)

React Three Fiber (pour les visualisations 3D à venir)

Backend (Déployé sur Render)

Python 3.12

FastAPI (pour l'API REST)

PyCryptodome (pour la logique cryptographique)

Uvicorn

🚀 Démarrage en Local

Pour lancer ce projet sur votre machine, vous devez cloner et lancer les deux dépôts (frontend et backend).

1. Backend (API FastAPI)

Assurez-vous d'avoir Python 3.10+ installé.

# 1. Clonez le dépôt du backend
git clone <URL_DU_REPO_BACKEND>
cd cryptolab-backend

# 2. Créez un environnement virtuel et activez-le
python -m venv venv
source venv/bin/activate  # (ou .\\venv\\Scripts\\activate sur Windows)

# 3. Installez les dépendances
pip install -r requirements.txt

# 4. Lancez le serveur
# L'API sera disponible sur [http://127.0.0.1:8000](http://127.0.0.1:8000)
uvicorn main:app --reload --port 8000


2. Frontend (Cette Application)

Assurez-vous d'avoir Node.js 18+ installé.

# 1. Clonez ce dépôt
git clone <URL_DE_CE_REPO>
cd CryptoLab-frontend

# 2. Installez les dépendances (pnpm, npm, ou yarn)
pnpm install

# 3. Créez un fichier .env.local à la racine
# Ce fichier dit à votre frontend où trouver votre backend local
echo "NEXT_PUBLIC_API_URL=[http://127.0.0.1:8000](http://127.0.0.1:8000)" > .env.local

# 4. Lancez le serveur de développement
pnpm run dev


Ouvrez http://localhost:3000 dans votre navigateur pour voir l'application.

(N'hésitez pas à ajouter une section "Auteur" ou "License" ici)
