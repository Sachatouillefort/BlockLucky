const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🎫 Déploiement du contrat DailyLottery...\n");

  // Paramètres de la loterie quotidienne
  const ticketPrice = hre.ethers.parseEther("0.01"); // 0.01 ETH par ticket
  const maxPlayers = 5; // Tirage dès qu'on a 5 joueurs
  const durationSeconds = 60 * 60; // 1 heure pour les tests (24h en prod)

  console.log("📋 Paramètres:");
  console.log("  - Prix du ticket: 0.01 ETH");
  console.log("  - Joueurs max: 5");
  console.log("  - Durée: 60 minutes\n");

  console.log("🎁 Prix quotidiens:");
  console.log("  Jour 1: La rue de ton choix prend ton nom");
  console.log("  Jour 2: 2 Accès VIP à tout event dans EtherBay");
  console.log("  Jour 3: Un an de transports en commun gratuits + parking gratuit\n");

  // Déploiement
  const DailyLottery = await hre.ethers.getContractFactory("DailyLottery");
  const lottery = await DailyLottery.deploy(
    ticketPrice,
    maxPlayers,
    durationSeconds
  );

  await lottery.waitForDeployment();
  const address = await lottery.getAddress();

  console.log(`✅ DailyLottery déployé à l'adresse: ${address}\n`);

  // Mettre à jour le fichier .env.local
  const envPath = path.join(__dirname, "../../site/.env.local");
  
  try {
    let envContent = "";
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, "utf8");
    }

    // Remplacer ou ajouter l'adresse du contrat
    const addressRegex = /NEXT_PUBLIC_CONTRACT_ADDRESS=.*/;
    const newAddressLine = `NEXT_PUBLIC_CONTRACT_ADDRESS=${address}`;

    if (addressRegex.test(envContent)) {
      envContent = envContent.replace(addressRegex, newAddressLine);
    } else {
      envContent += `\n${newAddressLine}\n`;
    }

    fs.writeFileSync(envPath, envContent);
    console.log("✅ Fichier .env.local mis à jour automatiquement\n");
  } catch (error) {
    console.log("⚠️  Impossible de mettre à jour .env.local automatiquement");
    console.log("📋 Copie cette ligne dans ton .env.local:\n");
    console.log(`NEXT_PUBLIC_CONTRACT_ADDRESS=${address}\n`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
