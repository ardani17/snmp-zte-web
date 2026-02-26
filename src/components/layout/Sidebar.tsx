"use client";

import { useState } from "react";
import { QueryType, QUERY_CATEGORIES } from "@/types";
import {
  Server,
  Activity,
  Settings,
  BarChart,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  Wifi,
  LogOut,
} from "lucide-react";

interface SidebarProps {
  selectedQuery: QueryType | null;
  onSelectQuery: (query: QueryType, requiresOnuId: boolean, requiresName: boolean) => void;
  isConnected: boolean;
  onDisconnect: () => void;
  oltConfig: { ip: string } | null;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Server,
  Activity,
  Settings,
  BarChart,
};

export function Sidebar({
  selectedQuery,
  onSelectQuery,
  isConnected,
  onDisconnect,
  oltConfig,
}: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([
    "core",
    "bandwidth",
    "provisioning",
    "statistics",
  ]);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((c) => c !== categoryId)
        : [...prev, categoryId]
    );
  };

  if (!isConnected) return null;

  return (
    <>
      {/* Mobile Overlay */}
      {collapsed && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setCollapsed(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full bg-white shadow-lg transition-all duration-300
          ${collapsed ? "-translate-x-full lg:translate-x-0 lg:w-16" : "w-64"}
          lg:relative lg:translate-x-0
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            {!collapsed && (
              <div className="flex items-center gap-2">
                <Wifi className="w-5 h-5 text-blue-600" />
                <span className="font-bold text-gray-900">SNMP-ZTE</span>
              </div>
            )}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              {collapsed ? (
                <Menu className="w-5 h-5" />
              ) : (
                <X className="w-5 h-5 lg:hidden" />
              )}
            </button>
          </div>

          {/* OLT Info */}
          {!collapsed && oltConfig && (
            <div className="px-4 py-3 bg-blue-50 border-b">
              <div className="text-xs text-gray-500">Connected to</div>
              <div className="font-medium text-blue-700 truncate">
                {oltConfig.ip}
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-2">
            {Object.entries(QUERY_CATEGORIES).map(([categoryId, category]) => {
              const Icon = iconMap[category.icon] || Server;
              const isExpanded = expandedCategories.includes(categoryId);

              return (
                <div key={categoryId} className="mb-1">
                  {/* Category Header */}
                  <button
                    onClick={() => toggleCategory(categoryId)}
                    className={`
                      w-full flex items-center gap-2 px-3 py-2 text-sm font-medium
                      text-gray-600 hover:bg-gray-100 rounded-lg transition-colors
                      ${collapsed ? "justify-center" : ""}
                    `}
                  >
                    <Icon className="w-4 h-4" />
                    {!collapsed && (
                      <>
                        <span className="flex-1 text-left">{category.name}</span>
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </>
                    )}
                  </button>

                  {/* Query Items */}
                  {isExpanded && !collapsed && (
                    <div className="ml-4 mt-1 space-y-1">
                      {category.queries.map((queryItem) => {
                        const isActive = selectedQuery === queryItem.type;
                        return (
                          <button
                            key={queryItem.type}
                            onClick={() =>
                              onSelectQuery(
                                queryItem.type,
                                queryItem.requiresOnuId,
                                queryItem.requiresName || false
                              )
                            }
                            className={`
                              w-full text-left px-3 py-1.5 text-sm rounded-md
                              transition-colors
                              ${
                                isActive
                                  ? "bg-blue-100 text-blue-700 font-medium"
                                  : "text-gray-600 hover:bg-gray-100"
                              }
                            `}
                          >
                            {queryItem.name}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="border-t p-4">
            <button
              onClick={onDisconnect}
              className={`
                w-full flex items-center gap-2 px-3 py-2 text-sm
                text-red-600 hover:bg-red-50 rounded-lg transition-colors
                ${collapsed ? "justify-center" : ""}
              `}
            >
              <LogOut className="w-4 h-4" />
              {!collapsed && <span>Disconnect</span>}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
