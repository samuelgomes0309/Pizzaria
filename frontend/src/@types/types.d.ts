import type { ProductFormData } from "../pages/product/schema/schema";

export interface CategoryProps {
	id: string;
	name: string;
}

export interface CreateProductProps extends ProductFormData {
	file: File;
}

export interface ProductProps {
	banner: string;
	id: string;
	name: string;
	price: number;
	description: string;
}

export interface OrderProps {
	id: string;
	table: number;
	status: boolean;
	draft: boolean;
	name: string | null;
}

export interface OrderItemProps {
	id: string;
	amount: number;
	orderId: string;
	productId: string;
	created_at: string;
	updated_at: string;
	product: ProductProps;
}
export interface DetailOrderProps extends OrderProps {
	items: OrderItemProps[];
}
