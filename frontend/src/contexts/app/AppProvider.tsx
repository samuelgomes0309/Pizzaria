import { useCallback, useState, type ReactNode } from "react";
import { AppContext } from "./AppContext";
import type { CategoryFormData } from "../../pages/category/schema/schema";
import { toast } from "react-toastify";
import { api } from "../../services/api/axios";
import type {
	CategoryProps,
	CreateProductProps,
	DetailOrderProps,
	OrderProps,
	ProductProps,
} from "../../@types/types";

interface ContextProvider {
	children: ReactNode;
}

export function AppProvider({ children }: ContextProvider) {
	const [listCategory, setListCategory] = useState<CategoryProps[]>([]);
	const [listProducts, setProducts] = useState<ProductProps[]>([]);
	const [listOrders, setListOrders] = useState<OrderProps[]>([]);
	const [detailOrder, setDetailOrder] = useState<DetailOrderProps | null>(null);
	const handleListOrders = useCallback(async () => {
		try {
			const response = await api.get("/orders");
			setListOrders(response.data);
		} catch (error) {
			console.log(error);
		}
	}, []);
	async function createCategory(data: CategoryFormData) {
		try {
			await api.post("/add/categories", data);
			toast.success("Categoria cadastrada com sucesso");
			return true;
		} catch (error) {
			console.log(error);
			return false;
		}
	}
	const handleListCategories = useCallback(async () => {
		try {
			const response = await api.get("/categories");
			setListCategory(response.data);
		} catch (error) {
			console.log(error);
		}
	}, []);
	async function createProduct(data: CreateProductProps) {
		try {
			if (!data) return false;
			// Necessario criar o formdata devido ser multipart/form-data
			const formData = new FormData();
			formData.append("file", data.file); // arquivo
			formData.append("name", data.name); // texto
			formData.append("price", data.price);
			formData.append("description", data.description);
			formData.append("category_id", data.category);
			await api.post("/add/products", formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});
			toast.success("Produto cadastrado com sucesso.");
			return true;
		} catch (error) {
			console.log(error);
			return false;
		}
	}
	const handleListProducts = useCallback(async () => {
		try {
			const response = await api.get("/products");
			setProducts(response.data);
		} catch (error) {
			console.log(error);
		}
	}, []);
	const handleDetailOrder = useCallback(async (order_id: string) => {
		try {
			const response = await api.get("/orders/detail", {
				params: { order_id },
			});
			setDetailOrder(response.data);
			return true;
		} catch (error) {
			console.error(error);
			setDetailOrder(null);
			return false;
		}
	}, []);
	const handleCloseOrder = useCallback(async (order_id: string) => {
		try {
			await api.post(`/orders/${order_id}/closeOrder`);
			setListOrders((prev) => prev.filter((order) => order.id !== order_id));
			setDetailOrder(null);
		} catch (error) {
			console.log(error);
		}
	}, []);
	return (
		<AppContext.Provider
			value={{
				createCategory,
				listCategory,
				handleListCategories,
				createProduct,
				handleListProducts,
				listProducts,
				handleListOrders,
				listOrders,
				detailOrder,
				handleDetailOrder,
				setDetailOrder,
				handleCloseOrder,
			}}
		>
			{children}
		</AppContext.Provider>
	);
}
