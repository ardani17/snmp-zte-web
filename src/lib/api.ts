import type {
  QueryRequest,
  QueryResponse,
  ONUInfo,
  ONUDetail,
  EmptySlot,
  SystemInfo,
  APIError,
} from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

class APIClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    path: string,
    options: RequestInit = {}
  ): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(
        (data as APIError).message || `HTTP Error: ${res.status}`
      );
    }

    return data;
  }

  // Stateless query
  async query<T>(request: QueryRequest): Promise<QueryResponse<T>> {
    return this.request<QueryResponse<T>>("/api/v1/query", {
      method: "POST",
      body: JSON.stringify(request),
    });
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
    const res = await this.query<ONUInfo[]>({
      ip,
      port,
      community,
      model,
      query: "onu_list",
      board,
      pon,
    });
    return res.data.data;
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
    const res = await this.query<ONUDetail>({
      ip,
      port,
      community,
      model,
      query: "onu_detail",
      board,
      pon,
      onu_id: onuId,
    });
    return res.data.data;
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
    const res = await this.query<EmptySlot[]>({
      ip,
      port,
      community,
      model,
      query: "empty_slots",
      board,
      pon,
    });
    return res.data.data;
  }

  // System Info
  async getSystemInfo(
    ip: string,
    port: number,
    community: string,
    model: string
  ): Promise<SystemInfo> {
    const res = await this.query<SystemInfo>({
      ip,
      port,
      community,
      model,
      query: "system_info",
    });
    return res.data.data;
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
