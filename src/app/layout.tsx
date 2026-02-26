import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SNMP-ZTE Web | OLT Monitoring Dashboard",
  description: "Web-based OLT Monitoring Dashboard for ZTE devices (C320, C300, C600)",
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
