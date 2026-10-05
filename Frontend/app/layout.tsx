import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Chatbot } from '@/components/Chatbot';
import { getChatbotConfig } from '@/lib/cms';
import { PageTransition } from '@/components/PageTransition';

export const metadata: Metadata = {
  title: {
    default: 'Supreme Supply Management',
    template: '%s | Supreme Supply Management',
  },
  description: 'Personalised, end-to-end logistics and supply chain solutions across South Africa and international markets.',
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const chatbot = await getChatbotConfig();

  return (
    <html lang="en">
      <body>
        <Header />
        <main>
          <PageTransition>
            {children}
          </PageTransition>
        </main>
        <Footer />
        {chatbot && <Chatbot config={chatbot} />}
      </body>
    </html>
  );
}
