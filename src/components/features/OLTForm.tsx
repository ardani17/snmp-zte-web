import { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import type { ConnectionConfig } from "@/types";
import { Lock, User } from "lucide-react";

interface OLTFormProps {
  onConnect: (config: ConnectionConfig) => void;
}

type OLTModel = "C320" | "C300" | "C600";

interface FormData {
  ip: string;
  port: string;
  community: string;
  model: OLTModel;
  username: string;
  password: string;
}

export function OLTForm({ onConnect }: OLTFormProps) {
  const [formData, setFormData] = useState<FormData>({
    ip: "",
    port: "161",
    community: "public",
    model: "C320",
    username: "admin",
    password: "",
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

    // Validate auth
    if (!formData.username || !formData.password) {
      setError("Username and password are required");
      return;
    }

    onConnect({
      ip: formData.ip,
      port,
      community: formData.community,
      model: formData.model,
      auth: {
        username: formData.username,
        password: formData.password,
      },
    });
  };

  return (
    <Card>
      <CardHeader
        title="Connect to OLT"
        subtitle="Enter your OLT and API credentials"
      />
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          {/* API Auth Section */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-blue-800 mb-3 flex items-center gap-2">
              <Lock className="w-4 h-4" />
              API Authentication
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Username *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                  <input
                    type="text"
                    id="username"
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                    placeholder="admin"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                  <input
                    type="password"
                    id="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    placeholder="••••••••"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* OLT Connection Section */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">
              OLT Connection
            </h4>
            <div className="grid grid-cols-2 gap-4">
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
                  SNMP Port
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
                      model: e.target.value as OLTModel,
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
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit">Connect</Button>
          </div>

          <p className="text-xs text-gray-500">
            * Credentials are sent directly to the API and are never stored.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
