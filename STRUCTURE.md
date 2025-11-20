# 📐 Structure et Conventions du Projet BlockLucky

## 🎯 Conventions de Nommage

### ✅ Normes Appliquées

| Type de Fichier | Convention | Exemples |
|----------------|-----------|----------|
| **Composants React** | `PascalCase.tsx` | `AnimatedBackground.tsx`, `DailyPrizeCard.tsx` |
| **Hooks React** | `useCamelCase.ts` | `useDailyLotteryContract.ts` |
| **Pages Next.js** | `kebab-case/page.tsx` | `comment-ca-marche/page.tsx` |
| **API Routes** | `kebab-case/route.ts` | `winner-info/route.ts` |
| **Utilitaires/Lib** | `kebab-case.ts` | `daily-lottery-abi.ts`, `wagmi-config.ts` |
| **Composants UI** | `kebab-case.tsx` | `button.tsx`, `dialog.tsx` |
| **Config** | `kebab-case.js/ts` | `hardhat.config.js`, `next.config.js` |
| **Scripts** | `kebab-case.sh/js` | `start.sh`, `deploy-daily.js` |

### 📝 Règles Générales

1. **Composants React personnalisés** → `PascalCase`
2. **Composants shadcn/ui** → `kebab-case` (convention shadcn)
3. **Fichiers de configuration** → `kebab-case`
4. **Smart Contracts** → `PascalCase.sol`

---

## 📁 Structure Complète du Projet

```
BlockLucky/
│
├── 📄 README.md                              # Documentation principale
├── 📄 .gitignore                             # Fichiers à ignorer
├── 📄 STRUCTURE.md                           # Ce fichier
├── 🚀 start.sh                               # Script de lancement
│
├── 🔗 blocklucky-smart-contract/             # Backend Blockchain
│   ├── 📂 contracts/
│   │   └── DailyLottery.sol                  # Smart contract principal
│   │
│   ├── 📂 scripts/
│   │   └── deploy-daily.js                   # Script de déploiement
│   │
│   ├── 📂 tests/                             # Tests unitaires (à venir)
│   │
│   ├── 📄 hardhat.config.js                  # Config Hardhat
│   ├── 📄 package.json
│   └── 📄 package-lock.json
│
└── 🌐 site/                                  # Frontend Next.js
    ├── 📂 src/
    │   │
    │   ├── 📂 app/                           # Pages & Routes (App Router)
    │   │   ├── page.tsx                      # 🏠 Page d'accueil
    │   │   ├── layout.tsx                    # Layout global
    │   │   ├── globals.css                   # Styles globaux
    │   │   ├── ClientBody.tsx                # Body côté client
    │   │   │
    │   │   ├── 📂 participer/
    │   │   │   └── page.tsx                  # 🎫 Achat de tickets
    │   │   │
    │   │   ├── 📂 tirage/
    │   │   │   └── page.tsx                  # 🎰 Page de tirage
    │   │   │
    │   │   ├── 📂 comment-ca-marche/
    │   │   │   └── page.tsx                  # ❓ Explications
    │   │   │
    │   │   ├── 📂 decouvrir/
    │   │   │   └── page.tsx                  # 📚 Intro blockchain
    │   │   │
    │   │   └── 📂 api/
    │   │       └── 📂 winner-info/
    │   │           └── route.ts              # API winners
    │   │
    │   ├── 📂 components/                    # Composants React
    │   │   │
    │   │   ├── AnimatedBackground.tsx        # ✨ Fond animé
    │   │   ├── DailyPrizeCard.tsx           # 🎁 Carte de prix
    │   │   ├── DayCard.tsx                   # 📅 Carte de jour
    │   │   ├── FeatureCard.tsx               # ⭐ Carte de feature
    │   │   ├── Footer.tsx                    # 🦶 Pied de page
    │   │   ├── Header.tsx                    # 🎩 En-tête
    │   │   ├── PrizeCard.tsx                 # 🏆 Carte de prix
    │   │   ├── StreamerCard.tsx              # 🎬 Carte streamer
    │   │   ├── Web3Provider.tsx              # 🦊 Provider Web3
    │   │   ├── WinnerFormModal.tsx           # 📝 Modal gagnant
    │   │   │
    │   │   └── 📂 ui/                        # Composants shadcn/ui
    │   │       ├── badge.tsx
    │   │       ├── button.tsx
    │   │       ├── card.tsx
    │   │       ├── dialog.tsx
    │   │       ├── input.tsx
    │   │       ├── progress.tsx
    │   │       └── textarea.tsx
    │   │
    │   ├── 📂 hooks/                         # Hooks personnalisés
    │   │   └── useDailyLotteryContract.ts    # Hook contrat
    │   │
    │   └── 📂 lib/                           # Utilitaires & Config
    │       ├── daily-lottery-abi.ts          # ABI + définitions prix
    │       ├── utils.ts                      # Fonctions utilitaires
    │       └── wagmi-config.ts               # Config Wagmi/RainbowKit
    │
    ├── 📄 .env.local                         # Variables d'environnement
    ├── 📄 .env.example                       # Exemple d'env
    ├── 📄 .gitignore
    ├── 📄 biome.json                         # Config Biome
    ├── 📄 components.json                    # Config shadcn
    ├── 📄 eslint.config.mjs                  # Config ESLint
    ├── 📄 next.config.js                     # Config Next.js
    ├── 📄 next-env.d.ts                      # Types Next.js
    ├── 📄 netlify.toml                       # Config Netlify
    ├── 📄 package.json
    ├── 📄 package-lock.json
    ├── 📄 postcss.config.mjs                 # Config PostCSS
    ├── 📄 tailwind.config.ts                 # Config Tailwind
    └── 📄 tsconfig.json                      # Config TypeScript
```

---

## 🎨 Organisation des Composants

### 📦 Composants par Catégorie

#### 🎨 Layout & Structure
- `Header.tsx` - En-tête avec connexion wallet
- `Footer.tsx` - Pied de page
- `AnimatedBackground.tsx` - Fond avec particules animées

#### 🎁 Cards & Affichage
- `DailyPrizeCard.tsx` - Affichage des prix quotidiens (avec statut)
- `PrizeCard.tsx` - Carte de prix générique
- `DayCard.tsx` - Carte pour afficher un jour
- `FeatureCard.tsx` - Carte de fonctionnalité
- `StreamerCard.tsx` - Carte de streamer/influenceur

#### 🔗 Web3 & Interactions
- `Web3Provider.tsx` - Provider Wagmi/RainbowKit
- `WinnerFormModal.tsx` - Modal de collecte d'infos gagnant

#### 🎨 UI Primitives (shadcn)
- `badge.tsx`, `button.tsx`, `card.tsx`, etc.

---

## 🔄 Flux de Données

```
┌─────────────────────────────────────────────────────────────┐
│                    🌐 Frontend (Next.js)                     │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  📄 Pages (app/)                                             │
│    └─> useDailyLotteryContract()  ← Hook personnalisé       │
│          │                                                    │
│          ├─> useReadContract()    ← Wagmi (lecture)         │
│          ├─> useWriteContract()   ← Wagmi (écriture)        │
│          └─> useWaitForTransactionReceipt() ← Confirmation  │
│                │                                              │
│                │                                              │
│                ▼                                              │
│         🦊 RainbowKit/Wagmi                                  │
│                │                                              │
│                │ (JSON-RPC via Viem)                         │
│                │                                              │
└────────────────┼──────────────────────────────────────────────┘
                 │
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│              🔗 Blockchain (Hardhat Local)                   │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  📜 DailyLottery.sol                                         │
│    ├─ buyTicket()         → Achat de ticket                 │
│    ├─ pickWinner()        → Tirage au sort                  │
│    ├─ getCurrentPrizeName() → Nom du prix                   │
│    └─ getWinners()        → Historique                      │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 Statistiques du Projet

### 📈 Taille du Code

- **Smart Contracts:** 1 fichier Solidity (~300 lignes)
- **Frontend:** ~2500 lignes TypeScript/React
- **Composants:** 16 composants React
- **Pages:** 4 pages principales
- **Hooks:** 1 hook personnalisé
- **API Routes:** 1 endpoint

### 🎯 Couverture Fonctionnelle

| Fonctionnalité | Status |
|----------------|--------|
| Connexion Wallet | ✅ |
| Achat de Tickets | ✅ |
| Tirage au Sort | ✅ |
| Détection Gagnant | ✅ |
| Formulaire Gagnant | ✅ |
| Historique Winners | ✅ |
| Affichage 3 Prix | ✅ |
| Countdown Timer | ✅ |
| Responsive Design | ✅ |
| Dark Mode | ✅ |

---

## 🛠️ Technologies & Versions

### Backend (Blockchain)
- Solidity: `^0.8.20`
- Hardhat: `^2.22.0`
- Ethers.js: `^6.4.0`

### Frontend
- Next.js: `15.5.6`
- React: `18.3.1`
- TypeScript: `5.0+`
- Wagmi: `2.19.2`
- Viem: `2.38.6`
- RainbowKit: `2.2.9`
- TanStack Query: `^5.59.16`
- Tailwind CSS: `^3.4.17`

---

## 📝 Règles de Contribution

### Ajouter un Nouveau Composant

1. Créer le fichier en `PascalCase.tsx` dans `src/components/`
2. Exporter le composant par défaut ou nommé
3. Ajouter les types TypeScript appropriés
4. Documenter avec des commentaires si complexe

### Ajouter une Nouvelle Page

1. Créer un dossier `kebab-case/` dans `src/app/`
2. Ajouter `page.tsx` dans ce dossier
3. Importer les composants nécessaires
4. Respecter la structure de layout existante

### Modifier le Smart Contract

1. Modifier `contracts/DailyLottery.sol`
2. Recompiler: `npx hardhat compile`
3. Mettre à jour l'ABI dans `src/lib/daily-lottery-abi.ts`
4. Tester localement avant déploiement

---

## ✅ Checklist de Qualité

Avant chaque commit, vérifier :

- [ ] Noms de fichiers respectent les conventions
- [ ] Pas de fichiers `.DS_Store`
- [ ] Pas de `console.log()` en production
- [ ] Types TypeScript corrects
- [ ] Imports optimisés (pas de duplication)
- [ ] Code formaté (avec Prettier/Biome)
- [ ] Pas d'erreurs ESLint
- [ ] Variables d'environnement dans `.env.local`
- [ ] README à jour si nouvelles fonctionnalités

---

## 🔍 Fichiers Importants

| Fichier | Description | À modifier pour |
|---------|-------------|-----------------|
| `start.sh` | Lancement projet | Changer ports/config |
| `DailyLottery.sol` | Contrat principal | Logique blockchain |
| `deploy-daily.js` | Déploiement | Params du contrat |
| `daily-lottery-abi.ts` | ABI + Prix | Changer les prix |
| `useDailyLotteryContract.ts` | Hook | Ajouter fonctions |
| `wagmi-config.ts` | Config Web3 | Changer réseaux |

---

<div align="center">

**Structure mise à jour le : 20 Novembre 2025**

🎯 **Projet propre et organisé !**

</div>
