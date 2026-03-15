import { createContext } from "react";
import type { CategoryFormData } from "../../pages/category/schema/schema";
import type {
	CategoryProps,
	CreateProductProps,
	DetailOrderProps,
	OrderProps,
	ProductProps,
} from "../../@types/types";

interface ContextData {
	createCategory: (data: CategoryFormData) => Promise<boolean>;
	listCategory: CategoryProps[];
	handleListCategories: () => Promise<void>;
	createProduct: (data: CreateProductProps) => Promise<boolean>;
	handleListProducts: () => Promise<void>;
	listProducts: ProductProps[];
	listOrders: OrderProps[];
	handleListOrders: () => Promise<void>;
	handleDetailOrder: (order_id: string) => Promise<boolean>;
	detailOrder: DetailOrderProps | null;
	setDetailOrder: React.Dispatch<React.SetStateAction<DetailOrderProps | null>>;
	handleCloseOrder: (order_id: string) => Promise<void>;
}

// Contexto do app
export const AppContext = createContext({} as ContextData);
