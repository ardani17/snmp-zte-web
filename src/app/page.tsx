"use client";

import { useState } from "react";
import { ONUList } from "@/components/features/ONUList";
import { OLTForm, OLTConfig } from "@/components/features/OLTForm";

export default function Home() {
  const [oltConfig, setOLTConfig] = useState<OLTConfig | null>(null);

  const handleConnect = (config: OLTConfig) => {
    setOLTConfig(config);
  };

  const handleDisconnect = () => {
    setOLTConfig(null);
  };

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 px-4">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">SNMP-ZTE Web</h1>
          <p className="text-gray-600 mt-1">
            OLT Monitoring Dashboard for ZTE devices (C320, C300, C600)
          </p>
        </div>

        {/* Connection Form or ONU List */}
        {!oltConfig ? (
          <OLTForm onConnect={handleConnect} />
        ) : (
          <ONUList config={oltConfig} onDisconnect={handleDisconnect} />
        )}

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>
            Powered by{" "}
            <a
              href="https://github.com/ardani17/snmp-zte"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              SNMP-ZTE API
            </a>
          </p>
          <p className="mt-1">
            No credentials are stored. All queries are stateless.
          </p>
        </div>
      </div>
    </main>
  );
}
