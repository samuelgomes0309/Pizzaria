export interface UserProps {
	email: string;
	id: string;
	name: string;
}

export interface CategoryProps {
	id: string;
	name: string;
}

export interface LoginResponse {
	id: string;
	email: string;
	token: string;
	name: string;
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

export interface ItemProps {
	id: string;
	amount: number;
	orderId: string;
	productId: string;
	created_at: string;
	updated_at: string;
}

export type ModalType = "category" | "product";
