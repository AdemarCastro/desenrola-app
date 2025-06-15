import "./globals.css";
import type { Metadata } from "next";
// import { Inter } from 'next/font/google'

// const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "Desenrola App",
  description: "Organize seus projetos e equipes.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      {/* a classe da fonte iria no body: className={inter.className} */}
      <body>{children}</body>
    </html>
  );
}