"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { QueryPanel } from "@/components/features/QueryPanel";
import { OLTForm } from "@/components/features/OLTForm";
import { QueryType, OLTConfig } from "@/types";

export default function Home() {
  const [oltConfig, setOLTConfig] = useState<OLTConfig | null>(null);
  const [selectedQuery, setSelectedQuery] = useState<QueryType | null>(null);
  const [requiresOnuId, setRequiresOnuId] = useState(false);
  const [requiresName, setRequiresName] = useState(false);

  const handleConnect = (config: OLTConfig) => {
    setOLTConfig(config);
    setSelectedQuery("onu_list"); // Default query
    setRequiresOnuId(false);
    setRequiresName(false);
  };

  const handleDisconnect = () => {
    setOLTConfig(null);
    setSelectedQuery(null);
  };

  const handleSelectQuery = (
    query: QueryType,
    needsOnuId: boolean,
    needsName: boolean
  ) => {
    setSelectedQuery(query);
    setRequiresOnuId(needsOnuId);
    setRequiresName(needsName);
  };

  // Not connected - show connection form
  if (!oltConfig) {
    return (
      <main className="min-h-screen bg-gray-100">
        <div className="max-w-xl mx-auto py-12 px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">SNMP-ZTE Web</h1>
            <p className="text-gray-600 mt-2">
              OLT Monitoring Dashboard for ZTE devices
            </p>
          </div>

          {/* Connection Form */}
          <OLTForm onConnect={handleConnect} />

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
            <p className="mt-1">No credentials are stored. All queries are stateless.</p>
          </div>
        </div>
      </main>
    );
  }

  // Connected - show dashboard
  return (
    <main className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <Sidebar
        selectedQuery={selectedQuery}
        onSelectQuery={handleSelectQuery}
        isConnected={!!oltConfig}
        onDisconnect={handleDisconnect}
        oltConfig={oltConfig}
      />

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Top Bar */}
        <header className="bg-white border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                SNMP-ZTE Dashboard
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Connected to {oltConfig.ip}:{oltConfig.port} ({oltConfig.model})
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                Connected
              </span>
              <span className="text-sm text-gray-500">
                Community: {oltConfig.community}
              </span>
            </div>
          </div>
        </header>

        {/* Query Content */}
        <div className="p-6">
          {selectedQuery ? (
            <QueryPanel
              queryType={selectedQuery}
              config={oltConfig}
              requiresOnuId={requiresOnuId}
              requiresName={requiresName}
            />
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p>Select a query from the sidebar to begin</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
