"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { api } from "@/lib/api";
import { formatPower, getStatusColor, cn } from "@/lib/utils";
import type { OLTConfig, ONUInfo } from "@/types";

interface ONUListProps {
  config: OLTConfig;
  onDisconnect: () => void;
}

export function ONUList({ config, onDisconnect }: ONUListProps) {
  const [board, setBoard] = useState(1);
  const [pon, setPon] = useState(1);
  const [onus, setOnus] = useState<ONUInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchONUs();
  }, [config, board, pon]);

  const fetchONUs = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log("Fetching ONUs with config:", config);
      console.log("Board:", board, "PON:", pon);

      const data = await api.getONUList(
        config.ip,
        config.port,
        config.community,
        config.model,
        board,
        pon
      );

      console.log("Received ONU data:", data);
      setOnus(data);
    } catch (err) {
      console.error("Error fetching ONUs:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch ONUs");
      setOnus([]);
    } finally {
      setLoading(false);
    }
  };

  const onlineCount = onus.filter((o) => o.status === "Online").length;
  const offlineCount = onus.length - onlineCount;

  return (
    <div className="space-y-4">
      {/* Connection Info */}
      <Card className="bg-blue-50 border border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-blue-700">
              Connected to{" "}
              <span className="font-semibold">
                {config.ip}:{config.port}
              </span>
            </p>
            <p className="text-xs text-blue-600">
              Model: {config.model} | Community: {config.community}
            </p>
          </div>
          <Button variant="secondary" size="sm" onClick={onDisconnect}>
            Disconnect
          </Button>
        </div>
      </Card>

      {/* Board/PON Selector */}
      <Card>
        <div className="flex items-center gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Board
            </label>
            <select
              value={board}
              onChange={(e) => setBoard(parseInt(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value={1}>Board 1</option>
              <option value={2}>Board 2</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              PON
            </label>
            <select
              value={pon}
              onChange={(e) => setPon(parseInt(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-md"
            >
              {Array.from({ length: 16 }, (_, i) => i + 1).map((p) => (
                <option key={p} value={p}>
                  PON {p}
                </option>
              ))}
            </select>
          </div>
          <div className="ml-auto">
            <Button variant="secondary" size="sm" onClick={fetchONUs}>
              Refresh
            </Button>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <p className="text-2xl font-bold text-gray-900">{onus.length}</p>
          <p className="text-sm text-gray-500">Total ONUs</p>
        </Card>
        <Card>
          <p className="text-2xl font-bold text-green-600">{onlineCount}</p>
          <p className="text-sm text-gray-500">Online</p>
        </Card>
        <Card>
          <p className="text-2xl font-bold text-red-600">{offlineCount}</p>
          <p className="text-sm text-gray-500">Offline</p>
        </Card>
      </div>

      {/* Error Display */}
      {error && (
        <Card className="bg-red-50 border border-red-200">
          <p className="text-red-700 font-medium">Error: {error}</p>
          <p className="text-red-600 text-sm mt-1">
            Pastikan backend berjalan di http://localhost:8080
          </p>
        </Card>
      )}

      {/* ONU Table */}
      <Card>
        <CardHeader title="ONU List" subtitle={`Board ${board}, PON ${pon}`} />

        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading...</div>
        ) : onus.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No ONUs found on this PON
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    ONU ID
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Name
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Type
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Serial Number
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    RX Power
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {onus.map((onu) => {
                  const power = formatPower(onu.rx_power);
                  return (
                    <tr key={onu.onu_id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm">{onu.onu_id}</td>
                      <td className="px-4 py-3 text-sm font-medium">
                        {onu.name || "-"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {onu.type || "-"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500 font-mono">
                        {onu.serial_number || "-"}
                      </td>
                      <td className={cn("px-4 py-3 text-sm", power.color)}>
                        {power.text}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={cn(
                            "px-2 py-1 text-xs font-medium rounded-full",
                            getStatusColor(onu.status)
                          )}
                        >
                          {onu.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
