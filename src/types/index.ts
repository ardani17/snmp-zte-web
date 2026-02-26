// Auth Credentials
export interface AuthConfig {
  username: string;
  password: string;
}

// OLT Configuration
export interface OLTConfig {
  ip: string;
  port: number;
  community: string;
  model: "C320" | "C300" | "C600";
}

// Connection Config (includes auth)
export interface ConnectionConfig extends OLTConfig {
  auth: AuthConfig;
}

// Query Types
export type QueryType =
  // Phase 1: Core
  | "health"
  | "onu_list"
  | "onu_detail"
  | "empty_slots"
  | "system_info"
  | "board_info"
  | "all_boards"
  | "pon_info"
  | "interface_stats"
  | "fan_info"
  | "temperature_info"
  | "onu_traffic"
  // Phase 2: Bandwidth
  | "onu_bandwidth"
  | "pon_port_stats"
  | "onu_errors"
  | "voltage_info"
  // Phase 3: Provisioning
  | "onu_create"
  | "onu_delete"
  | "onu_rename"
  | "onu_status"
  // Phase 4 & 5
  | "distance_info"
  | "vlan_list"
  | "vlan_info"
  | "profile_list";

// Query Categories
export const QUERY_CATEGORIES = {
  core: {
    name: "Core",
    icon: "Server",
    queries: [
      { type: "onu_list" as QueryType, name: "ONU List", requiresOnuId: false },
      { type: "onu_detail" as QueryType, name: "ONU Detail", requiresOnuId: true },
      { type: "empty_slots" as QueryType, name: "Empty Slots", requiresOnuId: false },
      { type: "system_info" as QueryType, name: "System Info", requiresOnuId: false },
      { type: "board_info" as QueryType, name: "Board Info", requiresOnuId: false },
      { type: "all_boards" as QueryType, name: "All Boards", requiresOnuId: false },
      { type: "pon_info" as QueryType, name: "PON Info", requiresOnuId: false },
      { type: "interface_stats" as QueryType, name: "Interface Stats", requiresOnuId: false },
      { type: "fan_info" as QueryType, name: "Fan Info", requiresOnuId: false },
      { type: "temperature_info" as QueryType, name: "Temperature", requiresOnuId: false },
      { type: "onu_traffic" as QueryType, name: "ONU Traffic", requiresOnuId: true },
    ],
  },
  bandwidth: {
    name: "Bandwidth",
    icon: "Activity",
    queries: [
      { type: "onu_bandwidth" as QueryType, name: "ONU Bandwidth", requiresOnuId: true },
      { type: "pon_port_stats" as QueryType, name: "PON Port Stats", requiresOnuId: false },
      { type: "onu_errors" as QueryType, name: "ONU Errors", requiresOnuId: true },
      { type: "voltage_info" as QueryType, name: "Voltage Info", requiresOnuId: false },
    ],
  },
  provisioning: {
    name: "Provisioning",
    icon: "Settings",
    queries: [
      { type: "onu_status" as QueryType, name: "ONU Status", requiresOnuId: true },
      { type: "onu_rename" as QueryType, name: "Rename ONU", requiresOnuId: true, requiresName: true },
      { type: "onu_create" as QueryType, name: "Create ONU", requiresOnuId: true, requiresName: true },
      { type: "onu_delete" as QueryType, name: "Delete ONU", requiresOnuId: true },
    ],
  },
  statistics: {
    name: "Statistics & VLAN",
    icon: "BarChart",
    queries: [
      { type: "distance_info" as QueryType, name: "Distance Info", requiresOnuId: true },
      { type: "vlan_list" as QueryType, name: "VLAN List", requiresOnuId: false },
      { type: "vlan_info" as QueryType, name: "VLAN Info", requiresOnuId: true },
      { type: "profile_list" as QueryType, name: "Profile List", requiresOnuId: false },
    ],
  },
};

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

// Board Info
export interface BoardInfo {
  board_id: number;
  type: string;
  real_type: string;
  status: string;
  port_count: number;
  cpu_load: number;
  mem_usage: number;
  soft_ver: string;
}

// PON Info
export interface PONInfo {
  board_id: number;
  pon_id: number;
  status: string;
  tx_power: number;
  rx_power: number;
  onu_count: number;
  rx_bytes: number;
  tx_bytes: number;
}

// Fan Info
export interface FanInfo {
  index: number;
  speed_level: number;
  speed: string;
  status: string;
  present: boolean;
}

// Temperature Info
export interface TemperatureInfo {
  system_temp: number;
  cpu_temp: number;
}

// Interface Stats
export interface InterfaceStats {
  index: number;
  description: string;
  type: number;
  mtu: number;
  speed: number;
  status: string;
}

// ONU Traffic
export interface ONUTraffic {
  board: number;
  pon: number;
  onu_id: number;
  rx_bytes: number;
  tx_bytes: number;
  rx_packets: number;
  tx_packets: number;
}

// ONU Bandwidth
export interface ONUBandwidth {
  board: number;
  pon: number;
  onu_id: number;
  name: string;
  assured_upstream: number;
  assured_downstream: number;
  max_upstream: number;
  max_downstream: number;
}

// PON Port Stats
export interface PONPortStats {
  board: number;
  pon: number;
  rx_bytes: number;
  tx_bytes: number;
  rx_packets: number;
  tx_packets: number;
  status: string;
}

// ONU Errors
export interface ONUErrors {
  board: number;
  pon: number;
  onu_id: number;
  crc_errors: number;
  fec_errors: number;
  dropped_frames: number;
  lost_packets: number;
}

// Voltage Info
export interface VoltageInfo {
  system_voltage: number;
  cpu_voltage: number;
}

// ONU Distance
export interface ONUDistance {
  board: number;
  pon: number;
  onu_id: number;
  distance: number;
  eqd: number;
}

// VLAN Info
export interface VLANInfo {
  vlan_id: number;
  name: string;
}

// VLAN List
export interface VLANList {
  count: number;
  vlans: VLANInfo[];
}

// Profile Info
export interface ProfileInfo {
  index: number;
  name: string;
  fixed_bw: number;
  assured_bw: number;
  max_bw: number;
}

// Profile List
export interface ProfileList {
  count: number;
  profiles: ProfileInfo[];
}

// ONU Status
export interface ONUStatus {
  board: number;
  pon: number;
  onu_id: number;
  status: number;
  status_str: string;
}

// Query Request
export interface QueryRequest {
  ip: string;
  port: number;
  community: string;
  model: string;
  query: QueryType;
  board?: number;
  pon?: number;
  onu_id?: number;
  name?: string;
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
    summary?: string;
  };
}

// API Error Response
export interface APIError {
  code: number;
  status: string;
  message: string;
}
