#!/bin/bash
cd "$(dirname "$0")"
echo "🚀 Démarrage du nœud Hardhat..."
echo "⚠️  NE PAS FERMER CE TERMINAL - Le nœud doit rester actif"
echo "----------------------------------------"
npx hardhat node
