import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/auth-context';
import { ToastProvider } from '@/context/toast-context';
import OnboardingModal from '@/components/dashboard/onboarding-modal';

export const metadata: Metadata = {
  title: 'ZentraGrid — Storage Infrastructure for Modern Applications',
  description: 'Developer-focused storage infrastructure for uploading, storing, streaming, and serving application files through a simple developer-first API.',
  openGraph: {
    title: 'ZentraGrid — Storage Infrastructure for Modern Applications',
    description: 'Developer-focused storage infrastructure for uploading, storing, streaming, and serving application files through a simple developer-first API.',
    type: 'website',
    siteName: 'ZentraGrid',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ZentraGrid — Storage Infrastructure for Modern Applications',
    description: 'Developer-focused storage infrastructure for uploading, storing, streaming, and serving application files.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="bg-[#06070B] text-[#F8FAFC] antialiased min-h-screen selection:bg-[#FF4FD8]/30 selection:text-white" suppressHydrationWarning>
        <AuthProvider>
          <ToastProvider>
            {children}
            <OnboardingModal />
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

