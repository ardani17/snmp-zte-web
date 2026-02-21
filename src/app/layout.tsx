import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SNMP-ZTE Web",
  description: "OLT Monitoring Dashboard for ZTE devices",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-gray-100 text-gray-900 antialiased">
        {children}
      </body>
    </html>
  );
}
