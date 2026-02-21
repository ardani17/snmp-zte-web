import { useState } from "react";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import type { OLTConfig } from "@/types";

interface OLTFormProps {
  onConnect: (config: OLTConfig) => void;
}

export function OLTForm({ onConnect }: OLTFormProps) {
  const [formData, setFormData] = useState({
    ip: "",
    port: "161",
    community: "public",
    model: "C320" as const,
  });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate IP
    if (!formData.ip) {
      setError("IP address is required");
      return;
    }

    // Validate port
    const port = parseInt(formData.port);
    if (isNaN(port) || port < 1 || port > 65535) {
      setError("Port must be between 1 and 65535");
      return;
    }

    onConnect({
      ip: formData.ip,
      port,
      community: formData.community,
      model: formData.model,
    });
  };

  return (
    <Card>
      <CardHeader
        title="Connect to OLT"
        subtitle="Enter your OLT credentials (not stored)"
      />

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* IP Address */}
          <div>
            <label
              htmlFor="ip"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              IP Address *
            </label>
            <input
              type="text"
              id="ip"
              value={formData.ip}
              onChange={(e) =>
                setFormData({ ...formData, ip: e.target.value })
              }
              placeholder="192.168.1.1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Port */}
          <div>
            <label
              htmlFor="port"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Port
            </label>
            <input
              type="number"
              id="port"
              value={formData.port}
              onChange={(e) =>
                setFormData({ ...formData, port: e.target.value })
              }
              placeholder="161"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Community */}
          <div>
            <label
              htmlFor="community"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              SNMP Community
            </label>
            <input
              type="text"
              id="community"
              value={formData.community}
              onChange={(e) =>
                setFormData({ ...formData, community: e.target.value })
              }
              placeholder="public"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Model */}
          <div>
            <label
              htmlFor="model"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              OLT Model
            </label>
            <select
              id="model"
              value={formData.model}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  model: e.target.value as "C320" | "C300" | "C600",
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="C320">ZTE C320</option>
              <option value="C300">ZTE C300</option>
              <option value="C600">ZTE C600</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button type="submit">Connect</Button>
        </div>

        <p className="text-xs text-gray-500">
          * Your credentials are sent directly to the API and are never stored.
        </p>
      </form>
    </Card>
  );
}
