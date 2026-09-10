import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Learning Haptic Active Compliance for Force-Aware Dexterous Manipulation',
  description: 'HACo learns force-regulating actions from fingertip tactile and joint-torque feedback for contact-rich dexterous manipulation.',
  openGraph: {
    title: 'Learning Haptic Active Compliance for Force-Aware Dexterous Manipulation',
    description: 'HACo learns force-regulating actions from fingertip tactile and joint-torque feedback.',
    images: ['/og.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Learning Haptic Active Compliance for Force-Aware Dexterous Manipulation',
    description: 'HACo learns force-regulating actions from fingertip tactile and joint-torque feedback.',
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
