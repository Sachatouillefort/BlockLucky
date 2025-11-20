import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    const { firstName, lastName, email, phone, address, walletAddress, prize, timestamp } = data;

    // Validation basique
    if (!firstName || !lastName || !email || !phone || !address || !walletAddress || !prize) {
      return NextResponse.json(
        { error: 'Tous les champs sont requis' },
        { status: 400 }
      );
    }

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Email invalide' },
        { status: 400 }
      );
    }

    // Log des informations (en production, vous devriez les enregistrer dans une base de données)
    console.log('=== NOUVEAU GAGNANT ===');
    console.log('Timestamp:', timestamp);
    console.log('Nom:', firstName, lastName);
    console.log('Email:', email);
    console.log('Téléphone:', phone);
    console.log('Adresse:', address);
    console.log('Wallet:', walletAddress);
    console.log('Prix:', prize, 'ETH');
    console.log('=======================');

    // TODO: Enregistrer dans une base de données
    // await db.winners.create({ ... });

    // TODO: Envoyer un email de confirmation
    // await sendEmail({
    //   to: email,
    //   subject: 'Félicitations ! Vous avez gagné !',
    //   body: `...`
    // });

    // TODO: Notifier l'administrateur
    // await sendAdminNotification({
    //   winner: `${firstName} ${lastName}`,
    //   email,
    //   prize,
    //   wallet: walletAddress
    // });

    return NextResponse.json({
      success: true,
      message: 'Informations enregistrées avec succès',
    });
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement des informations du gagnant:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
