import type { Metadata, Viewport } from "next";
import { Inter, Poppins } from "next/font/google";
import PwaRegister from "@/components/PwaRegister";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "Roteirize PB",
    template: "%s | Roteirize PB",
  },
  description:
    "Aplicação Web-Mobile para criação de roteiros turísticos personalizados na Paraíba.",
  applicationName: "Roteirize PB",
  manifest: "/manifest.webmanifest",
  keywords: [
    "turismo",
    "Paraíba",
    "roteiros turísticos",
    "João Pessoa",
    "experiências locais",
    "Roteirize PB",
  ],
  authors: [{ name: "Roteirize PB" }],
  creator: "Roteirize PB",
  publisher: "Roteirize PB",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: [
      { url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  appleWebApp: {
    capable: true,
    title: "Roteirize PB",
    statusBarStyle: "black-translucent",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: "Roteirize PB",
    description:
      "Crie roteiros turísticos personalizados e descubra experiências locais na Paraíba.",
    siteName: "Roteirize PB",
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: "/branding/logo-principal.png",
        width: 1200,
        height: 630,
        alt: "Roteirize PB",
      },
    ],
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-title": "Roteirize PB",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0F4C5C",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${poppins.variable}`}
    >
      <body>
        {children}
        <PwaRegister />
      </body>
    </html>
  );
}
