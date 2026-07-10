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
    default: "LISORY - Scoop Experience | Acessorios Surpresa",
    template: "%s | LISORY",
  },
  description:
    "Experiencia Lisory Scoop: acessorios surpresa mix dourado e prata com video exclusivo. Escolha seu scoop e surpreenda-se!",
  keywords: [
    "scoop",
    "acessorios surpresa",
    "lisory",
    "joias",
    "mix dourado e prata",
    "experiencia",
    "presente",
  ],
  openGraph: {
    title: "LISORY - Scoop Experience",
    description:
      "Experiencia Lisory Scoop: acessorios surpresa mix dourado e prata com video exclusivo.",
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
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/apple-icon.svg" }],
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
