export type ShipmentStatus =
  | 'order_received'
  | 'picked_up'
  | 'processing'
  | 'in_transit'
  | 'arrived_destination'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export interface TrackingEvent {
  id: string;
  status: ShipmentStatus;
  title: string;
  location: string;
  note?: string;
  timestamp: string;
}

export interface Shipment {
  id: string;
  trackingNumber: string;
  senderName: string;
  senderPhone: string;
  senderEmail: string;
  senderAddress: string;
  senderCity?: string;
  receiverName: string;
  receiverPhone: string;
  receiverEmail: string;
  receiverAddress: string;
  destinationCountry: string;
  destinationCountryCode: string;
  productId: string;
  productName: string;
  weight: number; // in KG
  quantity: number;
  dimensions?: string; // L x W x H cm
  totalPrice: number;
  currency: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: string;
  status: ShipmentStatus;
  currentLocation: string;
  estimatedDelivery: string;
  events: TrackingEvent[];
  createdAt: string;
  updatedAt: string;
}

export interface Country {
  id: string;
  name: string;
  code: string; // ISO 2 code e.g. MY, SA, US
  flag: string; // emoji or url
  currency: string;
  basePrice: number; // Default base price if no specific rule
  additionalKgPrice: number;
  estimatedDays: string; // e.g. "3-5 Business Days"
  availableProductIds: string[];
  status: 'active' | 'inactive';
  isPopular: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  code: string;
  category: string;
  description: string;
  icon: string;
  status: 'active' | 'inactive';
  maxWeight?: number;
  restricted?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WeightSlab {
  minKg: number;
  maxKg: number;
  price: number;
}

export interface PricingRule {
  id: string;
  countryId: string;
  countryName: string;
  productId: string;
  productName: string;
  pricingType: 'slabs' | 'base_plus_additional';
  baseKg?: number;
  basePrice?: number;
  additionalKgPrice?: number;
  slabs?: WeightSlab[];
  status: 'active' | 'draft' | 'inactive';
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface QuoteRequest {
  id: string;
  senderName: string;
  senderPhone: string;
  senderEmail: string;
  senderAddress: string;
  senderCity?: string;
  receiverName: string;
  receiverPhone: string;
  receiverEmail: string;
  receiverAddress: string;
  destinationCountry: string;
  destinationCountryCode?: string;
  productId: string;
  productName: string;
  weight: number;
  quantity: number;
  dimensions?: string;
  description?: string;
  calculatedPrice: number;
  currency: string;
  status: 'pending' | 'approved' | 'rejected' | 'converted';
  adminNotes?: string;
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  createdAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  featuredImage: string;
  description: string;
  content: string;
  category: string;
  author: string;
  status: 'draft' | 'published';
  seoTitle?: string;
  seoDescription?: string;
  keywords?: string;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface WebsiteSettings {
  brandName: string;
  tagline: string;
  heroTitle: string;
  heroSubtitle: string;
  phone: string;
  hotline: string;
  email: string;
  address: string;
  whatsappNumber: string;
  facebookUrl?: string;
  instagramUrl?: string;
  linkedinUrl?: string;
  noticeBanner: string;
  noticeBannerActive: boolean;
  currencySymbol: string;
  logoUrl?: string;
  logoType?: 'default' | 'image' | 'svg';
  updatedAt?: string;
}

export interface AdminNotification {
  id: string;
  title: string;
  message: string;
  type: 'quote' | 'shipment' | 'contact' | 'system';
  read: boolean;
  link?: string;
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  adminEmail: string;
  action: string;
  details: string;
  category: 'pricing' | 'country' | 'product' | 'shipment' | 'cms' | 'auth';
  oldValue?: string;
  newValue?: string;
  timestamp: string;
}

export interface AdminUser {
  uid: string;
  email: string;
  displayName: string;
  role: 'super_admin' | 'admin' | 'staff';
}
