export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'REFUNDED';

export interface Address {
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface OrderItemDto {
  productId: string;
  quantity: number;
  price: number;
}

export interface CreateOrderDto {
  items: OrderItemDto[];
  shippingAddress: any;
  billingAddress?: any;
  [key: string]: any;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  subtotal: number;
  product: {
    id: string;
    name: string;
    slug: string;
    price?: number;
  };
}

export interface Order {
  id: string;
  userId: string;
  status: OrderStatus;
  total: number;
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  items: OrderItem[];
  shippingAddress: any;
  billingAddress?: any;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  payment?: {
    id: string;
    status: string;
    paymentMethod: string;
  };
}

export interface UpdateOrderStatusDto {
  status: OrderStatus;
}
