"use client";

import { useState } from "react";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { QueryType, ConnectionConfig, QUERY_CATEGORIES } from "@/types";
import { Loader2, Search, AlertCircle, User, Wifi, Clock, Server } from "lucide-react";

interface QueryPanelProps {
  queryType: QueryType;
  config: ConnectionConfig;
  requiresOnuId: boolean;
  requiresName: boolean;
}

// Result Display Components
function SystemInfoDisplay({ data }: { data: Record<string, unknown> }) {
  const info = data as {
    name?: string;
    description?: string;
    uptime?: string;
    contact?: string;
    location?: string;
  };

  const formatUptime = (seconds: string) => {
    const s = parseInt(seconds);
    const days = Math.floor(s / 86400);
    const hours = Math.floor((s % 86400) / 3600);
    const mins = Math.floor((s % 3600) / 60);
    return `${days}d ${hours}h ${mins}m`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <InfoCard icon={<Server className="w-5 h-5" />} label="System Name" value={info.name || "-"} />
      <InfoCard icon={<Clock className="w-5 h-5" />} label="Uptime" value={info.uptime ? formatUptime(info.uptime) : "-"} />
      <InfoCard icon={<User className="w-5 h-5" />} label="Contact" value={info.contact || "-"} span={2} />
      <InfoCard icon={<Wifi className="w-5 h-5" />} label="Location" value={info.location || "-"} span={2} />
      <InfoCard label="Description" value={info.description || "-"} span={2} />
    </div>
  );
}

function ONUListDisplay({ data }: { data: unknown }) {
  const onus = Array.isArray(data) ? data : [];

  if (onus.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Wifi className="w-12 h-12 mx-auto mb-2 opacity-50" />
        <p>No ONU found on this PON port</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-3 py-2 text-left font-medium">ID</th>
            <th className="px-3 py-2 text-left font-medium">Name</th>
            <th className="px-3 py-2 text-left font-medium">Serial Number</th>
            <th className="px-3 py-2 text-left font-medium">Status</th>
            <th className="px-3 py-2 text-left font-medium">Rx Power</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {onus.map((onu: Record<string, unknown>, i: number) => (
            <tr key={i} className="hover:bg-gray-50">
              <td className="px-3 py-2">{onu.onu_id as number}</td>
              <td className="px-3 py-2 font-medium">{onu.name as string}</td>
              <td className="px-3 py-2 text-gray-600 font-mono text-xs">{onu.serial_number as string}</td>
              <td className="px-3 py-2">
                <StatusBadge status={onu.status as string} />
              </td>
              <td className="px-3 py-2 text-gray-600">{onu.rx_power as string}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function BoardInfoDisplay({ data }: { data: Record<string, unknown> }) {
  const board = data as {
    board_id?: number;
    type?: string;
    real_type?: string;
    status?: string;
    port_count?: number;
    cpu_load?: number;
    mem_usage?: number;
    soft_ver?: string;
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      <InfoCard label="Board ID" value={board.board_id?.toString() || "-"} />
      <InfoCard label="Type" value={board.type || "-"} />
      <InfoCard label="Real Type" value={board.real_type || "-"} />
      <InfoCard label="Status" value={<StatusBadge status={board.status || ""} />} />
      <InfoCard label="Port Count" value={board.port_count?.toString() || "-"} />
      <InfoCard label="Software Version" value={board.soft_ver || "-"} />
      <InfoCard label="CPU Load" value={board.cpu_load ? `${board.cpu_load}%` : "-"} />
      <InfoCard label="Memory Usage" value={board.mem_usage ? `${board.mem_usage}%` : "-"} />
    </div>
  );
}

function AllBoardsDisplay({ data }: { data: unknown }) {
  const boards = Array.isArray(data) ? data : [];

  if (boards.length === 0) {
    return <EmptyState message="No boards found" />;
  }

  return (
    <div className="space-y-3">
      {boards.map((board: Record<string, unknown>, i: number) => (
        <div key={i} className="border rounded-lg p-4 hover:bg-gray-50">
          <div className="flex justify-between items-center">
            <div>
              <span className="font-medium">Board {board.board_id as number}</span>
              <span className="ml-2 text-gray-500">{board.type as string}</span>
            </div>
            <StatusBadge status={board.status as string} />
          </div>
          <div className="mt-2 text-sm text-gray-600 grid grid-cols-3 gap-4">
            <div>Ports: {board.port_count as number}</div>
            <div>CPU: {board.cpu_load as number}%</div>
            <div>MEM: {board.mem_usage as number}%</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function TemperatureDisplay({ data }: { data: Record<string, unknown> }) {
  const temp = data as { system_temp?: number; cpu_temp?: number };

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="border rounded-lg p-4 text-center">
        <div className="text-3xl font-bold text-blue-600">{temp.system_temp || 0}°C</div>
        <div className="text-sm text-gray-500 mt-1">System Temperature</div>
      </div>
      <div className="border rounded-lg p-4 text-center">
        <div className="text-3xl font-bold text-orange-600">{temp.cpu_temp || 0}°C</div>
        <div className="text-sm text-gray-500 mt-1">CPU Temperature</div>
      </div>
    </div>
  );
}

function FanInfoDisplay({ data }: { data: unknown }) {
  const fans = Array.isArray(data) ? data : [];

  if (fans.length === 0) {
    return <EmptyState message="No fan information available" />;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-3 py-2 text-left">Fan #</th>
            <th className="px-3 py-2 text-left">Speed</th>
            <th className="px-3 py-2 text-left">Status</th>
            <th className="px-3 py-2 text-left">Present</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {fans.map((fan: Record<string, unknown>, i: number) => (
            <tr key={i} className="hover:bg-gray-50">
              <td className="px-3 py-2 font-medium">{fan.index as number}</td>
              <td className="px-3 py-2">{fan.speed as string}</td>
              <td className="px-3 py-2"><StatusBadge status={fan.status as string} /></td>
              <td className="px-3 py-2">{fan.present ? "✅ Yes" : "❌ No"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function EmptySlotsDisplay({ data }: { data: unknown }) {
  const slots = Array.isArray(data) ? data : [];

  if (slots.length === 0) {
    return (
      <div className="text-center py-8 text-green-600">
        <div className="text-4xl mb-2">✅</div>
        <p>All ONU slots are occupied</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-sm text-gray-600 mb-3">Found {slots.length} empty slot(s):</p>
      <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
        {slots.map((slot: Record<string, unknown>, i: number) => (
          <div key={i} className="border rounded p-2 text-center bg-green-50 border-green-200">
            <div className="font-medium">Board {slot.board as number}</div>
            <div className="text-xs text-gray-500">PON {slot.pon as number}</div>
            <div className="text-lg font-bold text-green-600">#{slot.onu_id as number}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function GenericDisplay({ data }: { data: unknown }) {
  // Try to detect data type and show appropriately
  if (Array.isArray(data)) {
    if (data.length === 0) {
      return <EmptyState message="No data found" />;
    }

    // Check if it's an array of objects
    if (typeof data[0] === "object" && data[0] !== null) {
      const keys = Object.keys(data[0] as Record<string, unknown>);
      return (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                {keys.map((key) => (
                  <th key={key} className="px-3 py-2 text-left font-medium capitalize">
                    {key.replace(/_/g, " ")}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {data.map((item: Record<string, unknown>, i: number) => (
                <tr key={i} className="hover:bg-gray-50">
                  {keys.map((key) => (
                    <td key={key} className="px-3 py-2">
                      {formatValue(item[key])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    // Simple array
    return (
      <div className="flex flex-wrap gap-2">
        {data.map((item, i) => (
          <span key={i} className="px-3 py-1 bg-gray-100 rounded-full text-sm">
            {String(item)}
          </span>
        ))}
      </div>
    );
  }

  // Single object
  if (typeof data === "object" && data !== null) {
    const entries = Object.entries(data as Record<string, unknown>);
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {entries.map(([key, value]) => (
          <InfoCard key={key} label={formatLabel(key)} value={formatValue(value)} />
        ))}
      </div>
    );
  }

  // Primitive value
  return (
    <div className="text-center py-4 text-lg font-medium">
      {String(data)}
    </div>
  );
}

// Helper Components
function InfoCard({ 
  label, 
  value, 
  icon,
  span = 1 
}: { 
  label: string; 
  value: React.ReactNode;
  icon?: React.ReactNode;
  span?: number;
}) {
  return (
    <div className={`border rounded-lg p-4 ${span === 2 ? "col-span-2" : ""}`}>
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
        {icon}
        {label}
      </div>
      <div className="font-medium text-gray-900">{value}</div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const getStatusColor = (s: string) => {
    const lower = s.toLowerCase();
    if (lower.includes("online") || lower.includes("active") || lower.includes("up") || lower.includes("inservice") || lower === "1") {
      return "bg-green-100 text-green-700";
    }
    if (lower.includes("offline") || lower.includes("down") || lower.includes("inactive") || lower === "2") {
      return "bg-red-100 text-red-700";
    }
    if (lower.includes("warning") || lower.includes("degraded")) {
      return "bg-yellow-100 text-yellow-700";
    }
    return "bg-gray-100 text-gray-700";
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
      {status}
    </span>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center py-8 text-gray-500">
      <Server className="w-12 h-12 mx-auto mb-2 opacity-50" />
      <p>{message}</p>
    </div>
  );
}

function formatLabel(key: string): string {
  return key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}

function formatValue(value: unknown): React.ReactNode {
  if (value === null || value === undefined) return "-";
  if (typeof value === "boolean") return value ? "✅ Yes" : "❌ No";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

// Main QueryPanel Component
export function QueryPanel({
  queryType,
  config,
  requiresOnuId,
  requiresName,
}: QueryPanelProps) {
  const [board, setBoard] = useState(1);
  const [pon, setPon] = useState(1);
  const [onuId, setOnuId] = useState(1);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    data: unknown;
    duration: string;
    timestamp: string;
    summary?: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const queryInfo = Object.values(QUERY_CATEGORIES)
    .flatMap((cat) => cat.queries)
    .find((q) => q.type === queryType);

  const getAuthHeader = () => {
    const credentials = btoa(`${config.auth.username}:${config.auth.password}`);
    return `Basic ${credentials}`;
  };

  const handleExecute = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

      const response = await fetch(`${apiUrl}/api/v1/query`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: getAuthHeader(),
        },
        body: JSON.stringify({
          ip: config.ip,
          port: config.port,
          community: config.community,
          model: config.model,
          query: queryType,
          board,
          pon,
          onu_id: onuId,
          name: name || undefined,
        }),
      });

      const data = await response.json();

      if (response.status === 401) {
        setError("Unauthorized - Username atau password salah");
        return;
      }

      if (data.code === 200) {
        setResult({
          data: data.data.data,
          duration: data.data.duration,
          timestamp: data.data.timestamp,
          summary: data.data.summary,
        });
      } else {
        setError(data.message || "Query gagal");
      }
    } catch (err) {
      if (err instanceof TypeError && err.message === "Failed to fetch") {
        setError("Tidak bisa connect ke API server. Pastikan server sudah running?");
      } else {
        setError(err instanceof Error ? err.message : "Network error");
      }
    } finally {
      setLoading(false);
    }
  };

  // Render result based on query type
  const renderResult = () => {
    if (!result) return null;

    const data = result.data;

    switch (queryType) {
      case "system_info":
        return <SystemInfoDisplay data={data as Record<string, unknown>} />;
      case "onu_list":
        return <ONUListDisplay data={data} />;
      case "board_info":
        return <BoardInfoDisplay data={data as Record<string, unknown>} />;
      case "all_boards":
        return <AllBoardsDisplay data={data} />;
      case "temperature_info":
        return <TemperatureDisplay data={data as Record<string, unknown>} />;
      case "fan_info":
        return <FanInfoDisplay data={data} />;
      case "empty_slots":
        return <EmptySlotsDisplay data={data} />;
      default:
        return <GenericDisplay data={data} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Query Form */}
      <Card>
        <CardHeader title={queryInfo?.name || queryType} subtitle={`Query: ${queryType}`} />

        <div className="space-y-4">
          {/* Board & PON */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Board</label>
              <input
                type="number"
                value={board}
                onChange={(e) => setBoard(parseInt(e.target.value) || 1)}
                min={1}
                max={16}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">PON</label>
              <input
                type="number"
                value={pon}
                onChange={(e) => setPon(parseInt(e.target.value) || 1)}
                min={1}
                max={16}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* ONU ID */}
          {requiresOnuId && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ONU ID</label>
              <input
                type="number"
                value={onuId}
                onChange={(e) => setOnuId(parseInt(e.target.value) || 1)}
                min={1}
                max={128}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {/* Name */}
          {requiresName && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {/* Execute Button */}
          <div className="flex justify-end">
            <Button onClick={handleExecute} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Loading...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Execute Query
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>

      {/* Error */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-medium text-red-800">Error</h4>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Result */}
      {result && (
        <Card>
          <CardHeader title="Result" subtitle={result.summary || "Query response"}>
            <div className="flex gap-4 text-xs text-gray-500 mt-2">
              <span>⏱️ {result.duration}</span>
              <span>📅 {new Date(result.timestamp).toLocaleString()}</span>
            </div>
          </CardHeader>
          <div className="p-4">{renderResult()}</div>
        </Card>
      )}
    </div>
  );
}
