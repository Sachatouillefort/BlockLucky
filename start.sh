#!/bin/bash

# Script pour lancer le projet BlockLucky

echo "🚀 Démarrage de BlockLucky..."

# Nettoyer les ports
echo "🧹 Nettoyage des ports..."
lsof -ti :8545 | xargs kill -9 2>/dev/null
lsof -ti :3000 | xargs kill -9 2>/dev/null
sleep 1

# Démarrer Hardhat node en arrière-plan
echo "⛓️  Démarrage du node Hardhat..."
cd blocklucky-smart-contract
npx hardhat node > hardhat.log 2>&1 &
HARDHAT_PID=$!
echo "   Node Hardhat démarré (PID: $HARDHAT_PID)"
cd ..

# Attendre que le node soit prêt
echo "⏳ Attente du node Hardhat..."
sleep 5

# Déployer le contrat
echo "📝 Déploiement du contrat Lottery..."
cd blocklucky-smart-contract
npx hardhat run scripts/deploy.js --network localhost
cd ..

# Démarrer Next.js
echo "🌐 Démarrage de Next.js..."
cd site
npm run dev &
NEXTJS_PID=$!
echo "   Next.js démarré (PID: $NEXTJS_PID)"
cd ..

echo ""
echo "✅ Projet lancé avec succès !"
echo ""
echo "📍 URLs:"
echo "   - Site web: http://localhost:3000"
echo "   - Hardhat RPC: http://127.0.0.1:8545"
echo ""
echo "💡 Pour arrêter:"
echo "   kill $HARDHAT_PID $NEXTJS_PID"
echo ""
echo "📋 Logs Hardhat: blocklucky-smart-contract/hardhat.log"
