#!/bin/bash

# Script pour déployer le contrat et mettre à jour l'adresse dans le frontend
# Usage: ./deploy-and-update.sh [network]
# Example: ./deploy-and-update.sh localhost

NETWORK=${1:-localhost}

echo "🚀 Déploiement sur $NETWORK..."
cd ../blocklucky-smart-contract

# Déployer le contrat
OUTPUT=$(npx hardhat run scripts/deploy.js --network $NETWORK)
echo "$OUTPUT"

# Extraire l'adresse du contrat
CONTRACT_ADDRESS=$(echo "$OUTPUT" | grep -oE '0x[a-fA-F0-9]{40}')

if [ -z "$CONTRACT_ADDRESS" ]; then
    echo "❌ Impossible de trouver l'adresse du contrat"
    exit 1
fi

echo ""
echo "📝 Mise à jour de l'adresse dans le frontend..."

# Mettre à jour lottery-abi.ts
cd ../site
sed -i '' "s/export const LOTTERY_CONTRACT_ADDRESS = \"0x[a-fA-F0-9]*\"/export const LOTTERY_CONTRACT_ADDRESS = \"$CONTRACT_ADDRESS\"/" src/lib/lottery-abi.ts

echo "✅ Adresse mise à jour: $CONTRACT_ADDRESS"
echo ""
echo "🎉 Prêt à utiliser !"
echo "   Lancez: npm run dev"
