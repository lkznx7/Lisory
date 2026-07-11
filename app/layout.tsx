import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "@/styles/globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CartProvider } from "@/hooks/use-cart";
import { WishlistProvider } from "@/hooks/use-wishlist";
import { AuthProvider } from "@/hooks/use-auth";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://lisory.com.br"),
  title: {
    default: "LISORY - É luxo? É Lisory! | Acessórios Surpresa",
    template: "%s | LISORY",
  },
  description:
    "Lisory: acessórios surpresa em aço inoxidável. Abra seu Scoop e descubra peças exclusivas selecionadas para você.",
  keywords: [
    "scoop",
    "acessorios surpresa",
    "lisory",
    "joias",
    "aco inoxidavel",
    "presente",
  ],
  openGraph: {
    title: "LISORY - É luxo? É Lisory!",
    description:
      "Lisory: acessórios surpresa em aço inoxidável.",
    siteName: "LISORY",
    locale: "pt_BR",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: "/icons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/favicon.ico", sizes: "any" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png" }],
    other: [
      { rel: "manifest", url: "/icons/manifest.json" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${cormorant.variable}`}>
      <body className="min-h-screen bg-[#FFF9F8] font-sans antialiased">
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <Navbar />
              <main>{children}</main>
              <Footer />
              <Toaster richColors closeButton position="bottom-right" />
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
