"use client";

import { useState } from "react";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { QueryType, OLTConfig, QUERY_CATEGORIES } from "@/types";
import { Loader2, Search, AlertCircle } from "lucide-react";

interface QueryPanelProps {
  queryType: QueryType;
  config: OLTConfig;
  requiresOnuId: boolean;
  requiresName: boolean;
}

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
  const [result, setResult] = useState<unknown>(null);
  const [error, setError] = useState<string | null>(null);

  // Find query name
  const queryInfo = Object.values(QUERY_CATEGORIES)
    .flatMap((cat) => cat.queries)
    .find((q) => q.type === queryType);

  const handleExecute = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("http://localhost:8080/api/v1/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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

      if (data.code === 200) {
        setResult(data.data);
      } else {
        setError(data.message || "Query failed");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Query Form */}
      <Card>
        <CardHeader
          title={queryInfo?.name || queryType}
          subtitle={`Query: ${queryType}`}
        />

        <div className="space-y-4">
          {/* Board & PON */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Board
              </label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                PON
              </label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ONU ID
              </label>
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

          {/* Name (for create/rename) */}
          {requiresName && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
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
          <CardHeader title="Result" subtitle="Query response" />
          <div className="space-y-4">
            {/* Metadata */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Duration:</span>{" "}
                <span className="font-medium">
                  {(result as { duration: string })?.duration}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Timestamp:</span>{" "}
                <span className="font-medium">
                  {(result as { timestamp: string })?.timestamp}
                </span>
              </div>
            </div>

            {/* Data */}
            <div className="bg-gray-50 rounded-lg p-4 overflow-auto max-h-96">
              <pre className="text-sm text-gray-800 whitespace-pre-wrap">
                {JSON.stringify((result as { data: unknown })?.data, null, 2)}
              </pre>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
