# 📝 Changelog - BlockLucky

## [2.0.0] - 20 Novembre 2025

### 🎉 Refonte Majeure : Loterie Quotidienne

#### ✨ Nouvelles Fonctionnalités
- **Système de loterie sur 3 jours** avec un prix unique chaque jour
- **Prix physiques exclusifs** :
  - Jour 1 : Rue à votre nom
  - Jour 2 : 2 Accès VIP EtherBay
  - Jour 3 : Transports gratuits pendant 1 an
- **Détection automatique des gagnants** avec modal de contact
- **Formulaire de collecte d'informations** pour les gagnants
- **Historique complet** des 3 gagnants avec leurs prix

#### 🔧 Smart Contract
- **Nouveau contrat `DailyLottery.sol`** remplaçant `Lottery.sol`
  - Gestion du cycle de 3 jours
  - Stockage des gagnants avec leur jour de victoire
  - Fonctions `getCurrentPrizeName()` et `getWinners()`
  - Structure `Winner` avec timestamp et jour du prix

#### 🎨 Frontend
- **Composants créés** :
  - `DailyPrizeCard.tsx` : Affichage des prix quotidiens
  - `WinnerFormModal.tsx` : Formulaire de contact gagnant
  - `DayCard.tsx`, `FeatureCard.tsx`, `PrizeCard.tsx`
- **Hook personnalisé** : `useDailyLotteryContract.ts`
- **Pages mises à jour** :
  - Page d'accueil avec les 3 cartes de prix
  - Page `/participer` adaptée au système quotidien
  - Page `/tirage` avec countdown et détection gagnant
- **API endpoint** : `/api/winner-info` pour collecter les données

#### 📐 Normalisation et Nettoyage
- ✅ **Tous les composants React en PascalCase**
  - `animated-background.tsx` → `AnimatedBackground.tsx`
  - `footer.tsx` → `Footer.tsx`
  - `header.tsx` → `Header.tsx`
  - etc. (7 composants renommés)
- ✅ **Fichiers obsolètes supprimés** (27+ fichiers)
  - Anciens contrats Remix (Storage, Owner, Ballot)
  - Ancien contrat `Lottery.sol`
  - Scripts de déploiement obsolètes
  - Anciennes versions de pages (-test, -old, -broken, etc.)
  - Hooks et ABIs inutilisés
- ✅ **Imports automatiquement mis à jour** dans tous les fichiers
- ✅ **Conventions de nommage cohérentes** appliquées partout

#### 📚 Documentation
- **README.md complet** (12 sections, 500+ lignes)
  - Guide de démarrage ultra-rapide
  - Documentation technique complète
  - Instructions de déploiement
  - Section dépannage
- **STRUCTURE.md** : Documentation de l'architecture
  - Conventions de nommage détaillées
  - Structure complète du projet
  - Flux de données illustré
  - Règles de contribution
- **CHANGELOG.md** : Ce fichier
- **.gitignore** optimisé

#### 🛠️ Scripts et Automatisation
- **`start.sh`** : Lancement en une commande
  - Démarre Hardhat
  - Déploie le contrat
  - Configure automatiquement le frontend
  - Lance Next.js
- **`deploy-daily.js`** : Script de déploiement unique et propre

#### 🔄 Migrations
- Migration de `Lottery.sol` vers `DailyLottery.sol`
- Migration de `useLotteryContract` vers `useDailyLotteryContract`
- Migration de `lottery-abi.ts` vers `daily-lottery-abi.ts`
- Toutes les pages adaptées au nouveau système

### 🐛 Corrections
- Fix : Erreurs de compilation dues aux anciens imports
- Fix : Fichiers `.DS_Store` macOS supprimés
- Fix : Variables non définies dans la page participer
- Fix : Incohérences de nommage entre fichiers

### 🔒 Sécurité
- Validation des entrées dans le formulaire gagnant
- Vérification des adresses wallet
- Protection contre les doublons de tickets

### 📊 Statistiques
- **Fichiers supprimés** : 27+
- **Fichiers renommés** : 7
- **Fichiers créés** : 10+
- **Lignes de code** : ~3000 total
- **Composants React** : 16
- **Pages** : 4 principales

### ⚡ Performance
- Build optimisé Next.js 15
- Compilation Solidity sans warnings
- Imports optimisés (tree shaking)
- Images et assets compressés

### 🎯 État Actuel
- ✅ Projet 100% fonctionnel
- ✅ Code propre et normalisé
- ✅ Documentation complète
- ✅ Prêt pour la production
- ✅ Compilation sans erreurs
- ✅ Structure professionnelle

---

## [1.0.0] - Version Initiale

### Fonctionnalités de Base
- Smart contract `Lottery.sol` simple
- Achat de tickets en ETH
- Tirage au sort basique
- Interface Next.js avec Wagmi
- Connexion MetaMask

---

<div align="center">

**Maintenu par Sacha - Epitech 2025**

[📖 README](./README.md) | [📐 Structure](./STRUCTURE.md)

</div>
