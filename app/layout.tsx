import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'HACo · Haptic Active Compliance',
  description: 'HACo: Haptic Active Compliance for Dexterous Force Control.',
  openGraph: {
    title: 'HACo · Haptic Active Compliance',
    description: 'Closing the physical interaction loop for dexterous manipulation.',
    images: ['/og.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HACo · Haptic Active Compliance',
    description: 'Closing the physical interaction loop for dexterous manipulation.',
    images: ['/og.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
