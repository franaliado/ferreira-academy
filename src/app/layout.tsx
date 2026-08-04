import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ferreira Academy | Seminarios Internacionales de Barbería con Antonio Ferreira",
  description: "Academia internacional de corte masculino y barbería profesional. Capacitación de alto nivel con certificación digital oficial impartida en vivo por Antonio Ferreira.",
  keywords: ["barberia profesional", "antonio ferreira", "seminario barberia", "corte masculino", "barber academy", "masterclass barberia"],
  authors: [{ name: "Ferreira Academy" }],
  openGraph: {
    title: "Ferreira Academy | Seminarios Internacionales en Vivo",
    description: "Eleva tu nivel profesional con la academia internacional líder en corte masculino.",
    type: "website",
    locale: "es_ES",
    siteName: "Ferreira Academy",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark scroll-smooth">
      <head>
        <link rel="icon" href="/Logo_Simbolo_FA.png" type="image/png" />
      </head>
      <body suppressHydrationWarning className="bg-black text-white antialiased selection:bg-amber-400 selection:text-black">
        {children}
        <script src="https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}&currency=USD" defer></script>
      </body>
    </html>
  );
}
