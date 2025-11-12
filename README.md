# 🎰 BlockLucky - Loterie Blockchain

Une application de loterie décentralisée et transparente construite avec Next.js, Solidity et Ethereum.

## 📁 Structure du projet

```
blocklucky/
├── blocklucky-smart-contract/   # Smart contracts Solidity + Hardhat
│   ├── contracts/
│   │   └── Lottery.sol          # Contrat principal de la loterie
│   ├── scripts/
│   │   └── deploy.js            # Script de déploiement
│   └── hardhat.config.js        # Configuration Hardhat
│
├── site/                        # Application Next.js frontend
│   ├── src/
│   │   ├── app/                 # Pages et routes
│   │   ├── components/          # Composants React
│   │   ├── hooks/               # Hooks personnalisés (Web3)
│   │   └── lib/                 # Configuration (Wagmi, ABI)
│   └── public/                  # Ressources statiques
│
├── QUICKSTART.md               # Guide de démarrage rapide
└── start-blocklucky.sh         # Script de démarrage tout-en-un
```

## 🚀 Démarrage ultra-rapide

### Option 1 : Script automatique (Recommandé)

```bash
./start-blocklucky.sh
```

Ce script va :
1. ✅ Démarrer un nœud Hardhat local
2. ✅ Déployer le contrat Lottery
3. ✅ Configurer automatiquement l'adresse dans le frontend
4. ✅ Lancer l'application Next.js

### Option 2 : Manuel

**Terminal 1 - Hardhat:**
```bash
cd blocklucky-smart-contract
npx hardhat node
```

**Terminal 2 - Déploiement:**
```bash
cd blocklucky-smart-contract
npx hardhat run scripts/deploy.js --network localhost
# Copiez l'adresse du contrat affichée
```

**Terminal 3 - Frontend:**
```bash
cd site
# Mettez à jour l'adresse dans src/lib/lottery-abi.ts
npm run dev
```

## 🎯 Fonctionnalités

### Smart Contract (Solidity)
- ✅ Achat de tickets avec ETH
- ✅ Limite de joueurs configurable
- ✅ Deadline automatique
- ✅ Tirage au sort transparent
- ✅ Distribution automatique du prix
- ✅ Événements blockchain pour le suivi
- ✅ Gestion admin (start/stop)

### Frontend (Next.js + Web3)
- ✅ Connexion wallet multi-provider (MetaMask, WalletConnect, etc.)
- ✅ Lecture des données en temps réel
- ✅ Achat de tickets avec confirmation
- ✅ Suivi personnel des tickets
- ✅ Affichage de la cagnotte
- ✅ Historique des gagnants
- ✅ Interface moderne et responsive
- ✅ Animations et effets visuels

## 🛠️ Technologies

### Blockchain
- **Solidity** 0.8.20 - Langage du smart contract
- **Hardhat** - Environnement de développement Ethereum
- **Ethers.js** - Bibliothèque Ethereum

### Frontend
- **Next.js** 15 - Framework React
- **TypeScript** - Typage statique
- **Wagmi** - Hooks React pour Ethereum
- **Viem** - Client Ethereum TypeScript
- **RainbowKit** - Interface de connexion wallet
- **TanStack Query** - Gestion des requêtes
- **Tailwind CSS** - Framework CSS
- **shadcn/ui** - Composants UI

## 📖 Documentation

- [**QUICKSTART.md**](./QUICKSTART.md) - Guide de démarrage détaillé
- [**site/WEB3_INTEGRATION.md**](./site/WEB3_INTEGRATION.md) - Documentation de l'intégration Web3

## 🔧 Configuration

### Smart Contract

Paramètres par défaut (modifiables dans `scripts/deploy.js`) :
- **Prix du ticket:** 0.0001 ETH
- **Joueurs max:** 5
- **Durée:** 1 heure

### MetaMask (Réseau local)

```
Nom: Hardhat Local
RPC URL: http://127.0.0.1:8545
Chain ID: 31337
Symbole: ETH
```

## 🌐 Déploiement

### Testnet (Sepolia)

1. Configurez `.env` dans `blocklucky-smart-contract/` :
```bash
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
PRIVATE_KEY=your_private_key
```

2. Déployez :
```bash
cd blocklucky-smart-contract
npx hardhat run scripts/deploy.js --network sepolia
```

3. Mettez à jour l'adresse dans `site/src/lib/lottery-abi.ts`

### Production (Vercel/Netlify)

1. Déployez le contrat sur Mainnet
2. Mettez à jour l'adresse du contrat
3. Configurez les variables d'environnement :
```bash
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
NEXT_PUBLIC_ENABLE_MAINNET=true
```
4. Déployez le frontend sur Vercel/Netlify

## 📝 Utilisation

### 1. Connexion
- Cliquez sur "Connect Wallet" dans le header
- Sélectionnez votre wallet (MetaMask recommandé)
- Approuvez la connexion

### 2. Achat de tickets
- Allez sur la page "Participer"
- Vérifiez les informations (prix, participants, temps restant)
- Cliquez sur "Acheter un ticket"
- Confirmez la transaction dans votre wallet
- Attendez la confirmation ✅

### 3. Suivi
- Consultez vos tickets dans la section "Mes tickets"
- Suivez la cagnotte en temps réel
- Vérifiez le nombre de participants

### 4. Tirage (Automatique ou Manuel)
- **Automatique:** Quand le nombre max de joueurs est atteint
- **Manuel:** L'owner peut déclencher le tirage après la deadline

## 🎨 Pages

- **/** - Accueil avec statistiques en temps réel
- **/participer** - Interface d'achat de tickets
- **/comment-ca-marche** - Explication du fonctionnement
- **/tirage** - Page de tirage
- **/decouvrir** - Introduction à la blockchain

## 🐛 Dépannage

### Le contrat ne répond pas
→ Vérifiez que Hardhat tourne : `lsof -i :8545`
→ Vérifiez l'adresse dans `lottery-abi.ts`
→ Vérifiez que vous êtes sur le bon réseau dans MetaMask

### Erreur de transaction
→ Vérifiez votre solde ETH
→ Vérifiez que la loterie est active
→ Vérifiez que vous envoyez le bon montant

### Problèmes d'affichage
→ Videz le cache : Cmd+Shift+R (Mac) / Ctrl+Shift+R (Windows)
→ Redémarrez le serveur de développement

## 🔒 Sécurité

- ✅ Smart contract testé et vérifié
- ✅ Pas de stockage de clés privées
- ✅ Toutes les transactions nécessitent confirmation
- ✅ Validation des montants avant envoi
- ✅ Gestion des erreurs complète

## 📊 Événements Smart Contract

Le contrat émet les événements suivants :

- `TicketBought(address player, uint256 amount)` - Un ticket a été acheté
- `WinnerPicked(address winner, uint256 prize)` - Un gagnant a été tiré
- `LotteryReset(uint256 newDeadline)` - La loterie a été réinitialisée

Ces événements sont écoutés en temps réel par le frontend.

## 🤝 Contribution

Ce projet a été créé pour découvrir et démontrer :
- Le développement de smart contracts Solidity
- L'intégration Web3 avec React/Next.js
- Les bonnes pratiques blockchain
- Une UX moderne pour les dApps

## 📄 Licence

Projet éducatif - Epitech

## 🎉 C'est parti !

```bash
./start-blocklucky.sh
```

Ouvrez http://localhost:3000 et commencez à jouer ! 🚀
