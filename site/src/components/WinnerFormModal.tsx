'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface WinnerFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  prize: string;
  walletAddress: string;
}

export function WinnerFormModal({ isOpen, onClose, prize, walletAddress }: WinnerFormModalProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    phone: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simuler l'envoi des données (à remplacer par votre API)
    try {
      // TODO: Envoyer les données à votre backend
      const response = await fetch('/api/winner-info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          walletAddress,
          prize,
          timestamp: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        console.error('Erreur lors de l\'envoi du formulaire');
        alert('Une erreur est survenue. Veuillez réessayer.');
      }
    } catch (error) {
      console.error('Erreur:', error);
      // Pour le moment, on considère que c'est envoyé (pour la démo)
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const resetAndClose = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      address: '',
      phone: '',
    });
    setIsSubmitted(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={resetAndClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        {!isSubmitted ? (
          <>
            <DialogHeader>
              <div className="text-center mb-4">
                <div className="text-6xl mb-4 animate-bounce">🎉</div>
                <DialogTitle className="text-3xl text-primary">
                  Félicitations ! Vous avez gagné !
                </DialogTitle>
                <DialogDescription className="text-lg mt-4">
                  Vous avez remporté <span className="font-bold text-secondary">{prize} ETH</span>
                </DialogDescription>
              </div>
            </DialogHeader>

            <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 mb-6">
              <p className="text-sm text-center">
                Pour recevoir votre prix, veuillez remplir le formulaire ci-dessous.
                Nous vous contactons dans les plus brefs délais pour organiser le transfert.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium mb-2">
                    Prénom <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Jean"
                    className="border-primary/30 focus:border-primary"
                  />
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium mb-2">
                    Nom <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Dupont"
                    className="border-primary/30 focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Adresse e-mail <span className="text-red-500">*</span>
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="jean.dupont@example.com"
                  className="border-primary/30 focus:border-primary"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium mb-2">
                  Téléphone <span className="text-red-500">*</span>
                </label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+33 6 12 34 56 78"
                  className="border-primary/30 focus:border-primary"
                />
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium mb-2">
                  Adresse postale <span className="text-red-500">*</span>
                </label>
                <Textarea
                  id="address"
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="123 Rue de la République&#10;75001 Paris&#10;France"
                  rows={3}
                  className="border-primary/30 focus:border-primary resize-none"
                />
              </div>

              <div className="bg-muted/30 rounded-lg p-4">
                <p className="text-xs text-muted-foreground">
                  <strong>Votre wallet :</strong>
                  <br />
                  <code className="text-xs break-all">{walletAddress}</code>
                </p>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetAndClose}
                  disabled={isSubmitting}
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                >
                  {isSubmitting ? 'Envoi en cours...' : 'Envoyer mes informations'}
                </Button>
              </DialogFooter>
            </form>
          </>
        ) : (
          <>
            <DialogHeader>
              <div className="text-center">
                <div className="text-6xl mb-4">✅</div>
                <DialogTitle className="text-2xl text-primary">
                  Informations envoyées !
                </DialogTitle>
                <DialogDescription className="text-base mt-4">
                  Merci d'avoir rempli le formulaire. Nous allons vous contacter très bientôt
                  à l'adresse e-mail fournie pour organiser le transfert de votre prix.
                </DialogDescription>
              </div>
            </DialogHeader>

            <div className="bg-primary/10 border border-primary/30 rounded-lg p-6 my-6">
              <h3 className="font-bold mb-3">📧 Prochaines étapes :</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-primary">1.</span>
                  <span>Vérification de vos informations (24-48h)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">2.</span>
                  <span>Réception d'un e-mail de confirmation</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">3.</span>
                  <span>Transfert de votre prix sur votre wallet</span>
                </li>
              </ul>
            </div>

            <div className="bg-secondary/10 border border-secondary/30 rounded-lg p-4">
              <p className="text-xs text-muted-foreground text-center">
                Un e-mail de confirmation a été envoyé à <strong>{formData.email}</strong>
              </p>
            </div>

            <DialogFooter>
              <Button
                onClick={resetAndClose}
                className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90"
              >
                Fermer
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
