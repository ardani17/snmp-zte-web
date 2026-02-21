import type {
  QueryRequest,
  ONUInfo,
  ONUDetail,
  EmptySlot,
  SystemInfo,
} from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

// Raw response from backend
interface RawResponse<T> {
  code: number;
  status: string;
  data: {
    query: string;
    data: T;
    timestamp: string;
    duration: string;
  };
}

class APIClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(path: string, body?: object): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`HTTP ${res.status}: ${text}`);
    }

    const json: RawResponse<T> = await res.json();
    
    // Extract the actual data from nested structure
    // Backend returns: { code, status, data: { query, data: [...], timestamp, duration } }
    return json.data.data;
  }

  // ONU List
  async getONUList(
    ip: string,
    port: number,
    community: string,
    model: string,
    board: number,
    pon: number
  ): Promise<ONUInfo[]> {
    return this.request<ONUInfo[]>("/api/v1/query", {
      ip,
      port,
      community,
      model,
      query: "onu_list",
      board,
      pon,
    });
  }

  // ONU Detail
  async getONUDetail(
    ip: string,
    port: number,
    community: string,
    model: string,
    board: number,
    pon: number,
    onuId: number
  ): Promise<ONUDetail> {
    return this.request<ONUDetail>("/api/v1/query", {
      ip,
      port,
      community,
      model,
      query: "onu_detail",
      board,
      pon,
      onu_id: onuId,
    });
  }

  // Empty Slots
  async getEmptySlots(
    ip: string,
    port: number,
    community: string,
    model: string,
    board: number,
    pon: number
  ): Promise<EmptySlot[]> {
    return this.request<EmptySlot[]>("/api/v1/query", {
      ip,
      port,
      community,
      model,
      query: "empty_slots",
      board,
      pon,
    });
  }

  // System Info
  async getSystemInfo(
    ip: string,
    port: number,
    community: string,
    model: string
  ): Promise<SystemInfo> {
    return this.request<SystemInfo>("/api/v1/query", {
      ip,
      port,
      community,
      model,
      query: "system_info",
    });
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      const res = await fetch(`${this.baseUrl}/health`);
      return res.ok;
    } catch {
      return false;
    }
  }
}

export const api = new APIClient(API_URL);
