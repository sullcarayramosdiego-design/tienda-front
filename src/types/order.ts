export type OrderStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED';

export interface OrderItem {
	productId: string;
	quantity: number;
	price: number;
}

export interface Order {
	id: string;
	userId: string;
	status: OrderStatus;
	total: number;
	items: OrderItem[];
	createdAt: string;
	updatedAt: string;
}
