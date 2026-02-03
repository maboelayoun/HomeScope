// User types
export interface User {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  role: "Admin" | "Customer";
  createdAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  phone: string;
}

export interface AuthResponse {
  token: string;
}

// Property types
export interface Property {
  id: number;
  title: string;
  description: string;
  location: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  type: string;
  createdAt: string;
  imageUrls: string[];
  ownerName: string;
}

export interface CreatePropertyRequest {
  title: string;
  description: string;
  location: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  type: string;
  imageUrls?: string[];
}

export interface UpdatePropertyRequest {
  title?: string;
  description?: string;
  location?: string;
  price?: number;
  bedrooms?: number;
  bathrooms?: number;
  type?: string;
  imageUrls?: string[];
}

export interface PropertyFilter {
  location?: string;
  priceMin?: number;
  priceMax?: number;
  type?: string;
  bedrooms?: number;
}

// Inquiry types
export interface Inquiry {
  id: number;
  propertyId: number;
  propertyTitle: string;
  userId: number;
  userName: string;
  message: string;
  createdAt: string;
}

export interface CreateInquiryRequest {
  propertyId: number;
  message: string;
}

// Favorite types
export interface Favorite {
  id: number;
  propertyId: number;
  property: Property;
}
