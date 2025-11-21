# 🎰 BlockLucky - Loterie Blockchain

> **Une loterie décentralisée sur 3 jours avec des prix uniques chaque jour**

[![Solidity](https://img.shields.io/badge/Solidity-^0.8.20-363636?logo=solidity)](https://soliditylang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15.5.6-black?logo=next.js)](https://nextjs.org/)
[![Hardhat](https://img.shields.io/badge/Hardhat-Latest-yellow?logo=ethereum)](https://hardhat.org/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## 🎯 Concept

BlockLucky est une **loterie blockchain gamifiée** qui se déroule sur **3 jours** avec un **prix différent chaque jour** :

| Jour | Prix | Description |
|------|------|-------------|
| 🏛️ **Jour 1** | **Rue à ton nom** | Une rue de la ville portera votre nom |
| 🎭 **Jour 2** | **2 Accès VIP EtherBay** | Accès illimité aux événements blockchain |
| 🚇 **Jour 3** | **Transports + Parking gratuits** | 1 an de transports et parking offerts |

**Prix du ticket :** `0.01 ETH`  
**Maximum de joueurs :** `10 par jour`  
**Durée :** `24h par jour`

---

## 🚀 Démarrage Rapide

### Prérequis

- Node.js 18+
- MetaMask installé
- Git

### Installation

```bash
# 1. Cloner le projet
git clone https://github.com/Sachatouillefort/BlockLucky.git
cd BlockLucky

# 2. Installer les dépendances du contrat
cd blocklucky-smart-contract
npm install

# 3. Installer les dépendances du site
cd ../site
npm install

# 4. Retour à la racine
cd ..
```

### Lancement

```bash
# Lancer tout le projet (Hardhat + Next.js)
./start.sh
```

Le script lance automatiquement :
- 🔗 **Blockchain Hardhat** sur `http://localhost:8545`
- 🌐 **Site Next.js** sur `http://localhost:3000`
- 📝 **Déploiement automatique** du contrat

### Accès

- **Site web :** http://localhost:3000
- **RPC Hardhat :** http://localhost:8545

---

## 📖 Comment ça marche ?

### 1. Le Smart Contract (`DailyLottery.sol`)

Le contrat gère automatiquement la loterie sur 3 jours :

```solidity
// Structure principale
contract DailyLottery {
    uint256 public currentDay;      // Jour actuel (0, 1, ou 2)
    uint256 public ticketPrice;     // Prix d'un ticket
    uint256 public deadline;        // Limite de participation
    address[] public players;       // Liste des participants
    Winner[] public winners;        // Historique des gagnants
}
```

**Fonctions principales :**

| Fonction | Description | Qui peut l'appeler |
|----------|-------------|-------------------|
| `buyTicket()` | Acheter un ticket | Tout le monde |
| `pickWinner()` | Tirer au sort le gagnant | Owner uniquement |
| `getPlayers()` | Liste des participants | Tout le monde |
| `getWinners()` | Historique des gagnants | Tout le monde |

### 2. Cycle d'une journée

```
📅 JOUR 1 (currentDay = 0)
├─ 00:00 → Loterie ouverte
├─ Users → Achètent des tickets (0.01 ETH)
├─ 23:59 → Deadline atteinte
├─ Owner → Lance le tirage
└─ 🎉 Gagnant désigné !
     ↓
     currentDay++ (passe à 1)
     players[] = [] (reset)
     deadline = maintenant + 24h
     
📅 JOUR 2 (currentDay = 1)
├─ Nouvelle loterie...
└─ Même processus

📅 JOUR 3 (currentDay = 2)
├─ Dernière loterie
└─ Fin → lotteryActive = false
```

### 3. Tirage au sort

Le gagnant est sélectionné de manière **pseudo-aléatoire** :

```solidity
function _pickWinner() internal {
    // Génération aléatoire
    uint256 random = uint256(keccak256(abi.encodePacked(
        block.timestamp,
        block.prevrandao,
        players.length
    )));
    
    // Sélection du gagnant
    uint256 winnerIndex = random % players.length;
    address winner = players[winnerIndex];
    
    // Enregistrement
    winners.push(Winner({
        winnerAddress: winner,
        prizeDay: currentDay + 1,
        timestamp: block.timestamp
    }));
    
    // Passage au jour suivant
    currentDay++;
    _resetLottery();
}
```

> ⚠️ **Note :** Pour la production, utiliser **Chainlink VRF** pour une vraie génération aléatoire sécurisée.

### 4. Frontend (Next.js + Wagmi)

Le site web interagit avec le contrat via **Wagmi v2** et **RainbowKit** :

```typescript
// Hook personnalisé
const {
    ticketPrice,      // Prix d'un ticket
    playersCount,     // Nombre de participants
    currentDay,       // Jour actuel
    currentPrize,     // Prix du jour
    buyTicket,        // Fonction pour acheter
    winners,          // Historique
} = useDailyLotteryContract();

// Achat d'un ticket
<Button onClick={buyTicket}>
    Acheter un ticket ({ticketPrice} ETH)
</Button>
```

**Pages principales :**
- 🏠 **/** : Accueil + présentation des 3 prix
- 🎫 **/participer** : Achat de tickets
- 🎰 **/tirage** : Compte à rebours + résultats
- 📚 **/decouvrir** : Apprendre la blockchain
- ❓ **/comment-ca-marche** : Explications détaillées

---

## 🏗️ Architecture

```
BlockLucky/
├── 📁 blocklucky-smart-contract/    # Smart contracts
│   ├── contracts/
│   │   └── DailyLottery.sol         # Contrat principal
│   ├── scripts/
│   │   └── deploy-daily.js          # Script de déploiement
│   └── hardhat.config.js            # Config Hardhat
│
├── 📁 site/                         # Frontend Next.js
│   ├── src/
│   │   ├── app/                     # Pages
│   │   │   ├── page.tsx            # Accueil
│   │   │   ├── participer/         # Achat tickets
│   │   │   └── tirage/             # Résultats
│   │   ├── components/              # Composants React
│   │   ├── hooks/
│   │   │   └── useDailyLotteryContract.ts  # Hook principal
│   │   └── lib/
│   │       └── daily-lottery-abi.ts        # ABI + Config
│   └── package.json
│
├── 📄 start.sh                      # Script de lancement
├── 📖 README.md                     # Ce fichier
├── 📘 SMART_CONTRACT_GUIDE.md       # Guide technique détaillé
├── 📐 STRUCTURE.md                  # Architecture complète
└── 📝 CHANGELOG.md                  # Historique des versions
```

---

## 🔐 Sécurité

### ✅ Mécanismes implémentés

1. **Modificateurs de contrôle**
   ```solidity
   modifier onlyOwner() {
       require(msg.sender == owner, "Not owner");
       _;
   }
   ```

2. **Validations strictes**
   ```solidity
   require(msg.value == ticketPrice, "Wrong price");
   require(block.timestamp <= deadline, "Too late");
   require(currentDay < 3, "Lottery ended");
   ```

3. **Transparence totale**
   - Toutes les variables sont `public`
   - Tous les événements sont émis
   - Code open-source vérifiable

### ⚠️ Limitations (version démo)

- **Aléatoire pseudo-random** : Utiliser Chainlink VRF en production
- **Pas de ReentrancyGuard** : À ajouter pour la production
- **Tests limités** : Besoin de tests unitaires complets

---

## 📊 Flux de données

```
┌─────────────┐
│ UTILISATEUR │ 1. Clic "Acheter ticket"
└──────┬──────┘
       ↓
┌──────────────────┐
│   FRONTEND       │ 2. useDailyLotteryContract()
│   (Next.js)      │    → buyTicket()
└──────┬───────────┘
       ↓
┌──────────────────┐
│   WAGMI/VIEM     │ 3. Signe la transaction
│                  │    → Envoie via RPC
└──────┬───────────┘
       ↓
┌──────────────────┐
│   BLOCKCHAIN     │ 4. DailyLottery.sol
│   (Hardhat)      │    → Vérifie & Execute
│                  │    → Émet TicketBought
└──────┬───────────┘
       ↓
┌──────────────────┐
│   FRONTEND       │ 5. Détecte confirmation
│   (Réaction)     │    → Affiche "✅ Acheté !"
└──────────────────┘
```

---

## 🛠️ Commandes utiles

### Smart Contract

```bash
cd blocklucky-smart-contract

# Compiler le contrat
npx hardhat compile

# Lancer le node local
npx hardhat node

# Déployer sur le réseau local
npx hardhat run scripts/deploy-daily.js --network localhost

# Tests (à créer)
npx hardhat test
```

### Frontend

```bash
cd site

# Dev (avec Turbopack)
npm run dev

# Build production
npm run build

# Linter
npm run lint

# Formater le code
npm run format
```

---

## 📚 Documentation

- **📖 [README.md](./README.md)** *(ce fichier)* : Vue d'ensemble et démarrage rapide
- **📘 [SMART_CONTRACT_GUIDE.md](./SMART_CONTRACT_GUIDE.md)** : Guide technique complet du contrat
- **📐 [STRUCTURE.md](./STRUCTURE.md)** : Architecture détaillée du projet
- **📝 [CHANGELOG.md](./CHANGELOG.md)** : Historique des versions

---

## 🎮 Utilisation

### 1. Acheter un ticket

1. Allez sur http://localhost:3000/participer
2. Connectez votre wallet MetaMask
3. Cliquez sur "Acheter un ticket (0.01 ETH)"
4. Confirmez la transaction dans MetaMask
5. Attendez la confirmation ✅

### 2. Vérifier les participants

```bash
# Dans la console Hardhat
const lottery = await ethers.getContractAt("DailyLottery", "0x5FbDB2...");
const players = await lottery.getPlayers();
console.log("Participants:", players);
```

### 3. Lancer le tirage (Owner uniquement)

1. Allez sur http://localhost:3000/tirage
2. Attendez que la deadline soit passée
3. Cliquez sur "Lancer le tirage"
4. Le gagnant est désigné automatiquement ! 🎉

---

## 🔧 Configuration

### Variables d'environnement

Créez un fichier `site/.env.local` :

```env
# Adresse du contrat (auto-générée)
NEXT_PUBLIC_DAILY_LOTTERY_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3

# WalletConnect Project ID (optionnel)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id

# Activer mainnet (false par défaut)
NEXT_PUBLIC_ENABLE_MAINNET=false
```

### Réseaux supportés

```typescript
// site/src/lib/wagmi-config.ts
chains: [
    localhost,    // http://localhost:8545
    hardhat,      // http://localhost:8545
    sepolia,      // Testnet Ethereum
]
```

---

## 🤝 Contribuer

Les contributions sont les bienvenues ! Pour contribuer :

1. **Fork** le projet
2. Créez une **branche** (`git checkout -b feature/amazing-feature`)
3. **Commit** vos changements (`git commit -m 'Add amazing feature'`)
4. **Push** vers la branche (`git push origin feature/amazing-feature`)
5. Ouvrez une **Pull Request**

---

## 📄 License

Ce projet est sous licence **MIT**. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

## 🙏 Remerciements

- [Hardhat](https://hardhat.org/) - Framework Ethereum
- [Next.js](https://nextjs.org/) - Framework React
- [Wagmi](https://wagmi.sh/) - Hooks React pour Ethereum
- [RainbowKit](https://www.rainbowkit.com/) - Connexion wallet
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS
- [shadcn/ui](https://ui.shadcn.com/) - Composants UI

---

## 📞 Contact

**Projet GitHub :** [BlockLucky](https://github.com/Sachatouillefort/BlockLucky)

**Auteur :** Sacha Touillefort

---

<div align="center">

**🎰 BlockLucky - La loterie blockchain transparente**

*Créé avec ❤️ pour découvrir la technologie blockchain*

</div>
