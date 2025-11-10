import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { ClientProviders } from '@/components/ClientProviders';
import './globals.css';
import { Toaster } from 'sonner';

const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
});

export const metadata: Metadata = {
  title: 'Supervisor Reports',
  description: 'Created with Supervisor Reports',
  generator: 'Supervisor Reports.app',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <ClientProviders>{children}</ClientProviders>
        <Toaster richColors position='top-right' /> {/* 👈 Add this */}
        <Analytics />
      </body>
    </html>
  );
}
