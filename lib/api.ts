import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  Property,
  CreatePropertyRequest,
  UpdatePropertyRequest,
  PropertyFilter,
  Inquiry,
  CreateInquiryRequest,
} from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

class ApiClient {
  private token: string | null = null;

  constructor() {
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("token");
    }
  }

  setToken(token: string | null) {
    this.token = token;
    if (typeof window !== "undefined") {
      if (token) {
        localStorage.setItem("token", token);
      } else {
        localStorage.removeItem("token");
      }
    }
  }

  getToken() {
    return this.token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    if (this.token) {
      (headers as Record<string, string>)["Authorization"] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `Request failed with status ${response.status}`);
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return response.json();
    }
    return response.text() as unknown as T;
  }

  // Auth endpoints
  async login(data: LoginRequest): Promise<AuthResponse> {
    const result = await this.request<AuthResponse>("/Auth/Login", {
      method: "POST",
      body: JSON.stringify(data),
    });
    this.setToken(result.token);
    return result;
  }

  async register(data: RegisterRequest): Promise<string> {
    return this.request<string>("/Auth/Register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  logout() {
    this.setToken(null);
  }

  // Property endpoints
  async getProperties(filters?: PropertyFilter): Promise<Property[]> {
    const params = new URLSearchParams();
    if (filters) {
      if (filters.location) params.append("location", filters.location);
      if (filters.priceMin) params.append("priceMin", filters.priceMin.toString());
      if (filters.priceMax) params.append("priceMax", filters.priceMax.toString());
      if (filters.type) params.append("type", filters.type);
      if (filters.bedrooms) params.append("bedrooms", filters.bedrooms.toString());
    }
    const query = params.toString();
    return this.request<Property[]>(`/Property${query ? `?${query}` : ""}`);
  }

  async getMyProperties(): Promise<Property[]> {
    return this.request<Property[]>("/Property/my");
  }

  async createProperty(data: CreatePropertyRequest): Promise<{ propertyId: number }> {
    return this.request<{ propertyId: number }>("/Property", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateProperty(id: number, data: UpdatePropertyRequest): Promise<string> {
    return this.request<string>(`/Property/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteProperty(id: number): Promise<string> {
    return this.request<string>(`/Property/${id}`, {
      method: "DELETE",
    });
  }

  async deleteMyProperty(id: number): Promise<string> {
    return this.request<string>(`/Property/my/${id}`, {
      method: "DELETE",
    });
  }

  async uploadImages(files: File[]): Promise<string[]> {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    const headers: HeadersInit = {};
    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${API_BASE_URL}/Property/upload-images`, {
      method: "POST",
      headers,
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to upload images");
    }
    return response.json();
  }

  // Favorites endpoints
  async getFavorites(): Promise<Property[]> {
    return this.request<Property[]>("/Property/favorites");
  }

  async addToFavorites(propertyId: number): Promise<string> {
    return this.request<string>(`/Property/favorite/${propertyId}`, {
      method: "POST",
    });
  }

  async removeFromFavorites(propertyId: number): Promise<string> {
    return this.request<string>(`/Property/favorite/${propertyId}`, {
      method: "DELETE",
    });
  }

  // Inquiry endpoints
  async createInquiry(data: CreateInquiryRequest): Promise<string> {
    return this.request<string>("/Inquiry", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getReceivedInquiries(): Promise<Inquiry[]> {
    return this.request<Inquiry[]>("/Inquiry/received");
  }
}

export const api = new ApiClient();
