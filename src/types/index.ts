// OLT Configuration
export interface OLTConfig {
  ip: string;
  port: number;
  community: string;
  model: "C320" | "C300" | "C600";
}

// ONU Information
export interface ONUInfo {
  olt_id: string;
  board: number;
  pon: number;
  onu_id: number;
  name: string;
  type: string;
  serial_number: string;
  rx_power: string;
  status: string;
}

// ONU Detail
export interface ONUDetail extends ONUInfo {
  tx_power: string;
  ip_address: string;
  description: string;
  last_online: string;
  last_offline: string;
  uptime: string;
  last_down_duration: string;
  offline_reason: string;
  distance: string;
}

// Empty Slot
export interface EmptySlot {
  board: number;
  pon: number;
  onu_id: number;
}

// System Info
export interface SystemInfo {
  description: string;
  name: string;
  uptime: string;
  contact?: string;
  location?: string;
}

// Query Request
export interface QueryRequest {
  ip: string;
  port: number;
  community: string;
  model: string;
  query: "onu_list" | "onu_detail" | "empty_slots" | "system_info";
  board?: number;
  pon?: number;
  onu_id?: number;
}

// Query Response
export interface QueryResponse<T = unknown> {
  code: number;
  status: string;
  data: {
    query: string;
    data: T;
    timestamp: string;
    duration: string;
  };
}

// API Error Response
export interface APIError {
  code: number;
  status: string;
  message: string;
}
