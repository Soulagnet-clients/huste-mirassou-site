import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SARL Husté-Mirassou - Maçonnerie et Aménagements Extérieurs',
  description: 'Spécialiste en maçonnerie, terrasses et aménagements extérieurs. Devis gratuit et travaux de qualité.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
