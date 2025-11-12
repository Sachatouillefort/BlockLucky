#!/bin/bash
cd "$(dirname "$0")"
echo "📦 Déploiement du contrat..."
echo "----------------------------------------"
npx hardhat run scripts/deploy.js --network localhost
echo ""
echo "✅ N'oubliez pas de copier l'adresse du contrat dans blocklucky-site/lottery-dapp/.env.local"
