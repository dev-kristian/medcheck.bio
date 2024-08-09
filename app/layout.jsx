// app/layout.jsx
export const dynamic = 'force-dynamic'

import { Inter, IBM_Plex_Serif } from "next/font/google";
import "@/styles/globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next"

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const ibmPlexSerif = IBM_Plex_Serif({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-ibm-plex-serif'
});

export const metadata = {
  title: "Medcheck",
  description: "Medcheck is an AI powered medical assistant.",
  icons: {
    icon: '/icons/logo.png'
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${ibmPlexSerif.className}`}>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
