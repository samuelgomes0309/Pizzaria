import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Keyboard } from "react-native";
import Toast from "react-native-toast-message";
import {
	CategoryProps,
	DetailOrderProps,
	ItemProps,
	OrderProps,
	ProductProps,
} from "../@types";
import { api } from "../services/api";

interface UseOrderProps {
	order_id: string;
	table?: number | string;
}

export function useOrder({ order_id, table }: UseOrderProps) {
	useEffect(() => {
		const loadInitial = async () => {
			await loadCategories();
			setLoadingOrder(false);
		};
		loadInitial();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	const router = useRouter();
	const [amount, setAmount] = useState("");
	const [detailOrder, setDetailOrder] = useState<DetailOrderProps>();
	const [categories, setCategories] = useState<CategoryProps[]>([]);
	const [products, setProducts] = useState<ProductProps[]>([]);
	const [productSelected, setProductSelected] = useState<ProductProps>();
	const [categorySelected, setCategorySelected] = useState<CategoryProps>();
	const [modalVisible, setModalVisible] = useState<boolean>(false);
	const [loadingModal, setLoadingModal] = useState<boolean>(false);
	const [modalData, setModalData] = useState<CategoryProps[] | ProductProps[]>(
		[]
	);
	const [loadingOrder, setLoadingOrder] = useState<boolean>(true);
	const [typeModal, setTypeModal] = useState<"category" | "product">(
		"category"
	);
	const [tableInput, setTableInput] = useState("");
	const [loading, setLoading] = useState<boolean>(false);
	async function loadCategories(selected_id?: string) {
		try {
			const response = await api.get<CategoryProps[]>("/categories");
			if (response.data.length === 0) return;
			setCategories(response.data);
			if (!selected_id) {
				setCategorySelected(response.data[0]);
				await loadProducts(response.data[0].id);
				return;
			}
			const itemIndex = response.data.findIndex(
				(item) => item.id === selected_id
			);
			const selectedCategory =
				itemIndex !== -1 ? response.data[itemIndex] : response.data[0];
			setCategorySelected(selectedCategory);
			await loadProducts(selectedCategory.id);
		} catch (error) {
			console.log(error);
		}
	}
	async function loadProducts(category_id: string) {
		try {
			const response = await api.get<ProductProps[]>("/products/category", {
				params: {
					category_id,
				},
			});
			setProducts(response.data);
			if (response.data.length > 0) {
				setProductSelected(response.data[0]);
			}
		} catch (error) {
			console.log(error);
		}
	}
	async function navigateToSendOrder() {
		Keyboard.dismiss();
		if (!detailOrder || detailOrder?.items.length === 0) {
			return;
		}
		router.push({
			pathname: "/(authenticated)/sendOrder",
			params: {
				order_id,
				table,
			},
		});
	}
	function handleOpenModal(select: "category" | "product") {
		Keyboard.dismiss();
		if (select === "category") {
			setModalData(categories);
			setModalVisible(true);
			setTypeModal("category");
		} else {
			setModalData(products);
			setModalVisible(true);
			setTypeModal("product");
		}
	}
	function handleCloseModal() {
		setModalVisible(false);
	}
	async function handleSelectItem(
		item: ProductProps | CategoryProps,
		type: "category" | "product"
	) {
		if (type === "category") {
			setLoadingModal(true);
			await loadCategories(item.id);
			setLoadingModal(false);
		} else {
			setProductSelected(item as ProductProps);
		}
		setModalVisible(false);
	}
	async function handleDeleteOrder() {
		if (detailOrder && detailOrder?.items.length > 0) {
			Toast.show({
				type: "error",
				text1: "Atenção!",
				text1Style: { fontSize: 16, color: "#000" },
				text2: "É necessário excluir os itens antes de remover o pedido.",
				text2Style: { fontSize: 14, color: "#000" },
			});
			return;
		}
		try {
			await api.delete("/remove/orders", {
				params: {
					order_id: order_id,
				},
			});
			router.push("/(authenticated)/dashboard");
		} catch (error) {
			console.log(error);
		}
	}
	async function handleAddItens() {
		Keyboard.dismiss();
		if (!productSelected || !amount) {
			return;
		}
		try {
			const amountNumber = parseInt(amount);
			if (isNaN(amountNumber) || amountNumber <= 0) {
				return;
			}
			await api.post<ItemProps>("/orders/add/items", {
				order_id: order_id,
				amount: amountNumber,
				product_id: productSelected.id,
			});
			Toast.show({ type: "success", text1: "Produto adicionado com sucesso." });
			setAmount("");
			await handleDetailOrder();
		} catch (error) {
			console.log(error);
			Toast.show({
				type: "error",
				text1: "Não foi possivel adicionar o produto.",
			});
		}
	}
	// detailOrder só é carregado após adicionar/remover itens
	async function handleDetailOrder() {
		try {
			const response = await api.get<DetailOrderProps>("/orders/detail", {
				params: {
					order_id: order_id,
				},
			});
			setDetailOrder(response.data);
		} catch (error) {
			console.log(error);
		}
	}
	async function handleDeleteItem(product_id: string) {
		try {
			await api.delete("/orders/remove/items", {
				data: {
					product_id: product_id,
					order_id: order_id,
				},
			});
			await handleDetailOrder();
			Toast.show({ type: "success", text1: "Produto excluido com sucesso." });
		} catch (error) {
			console.log(error);
			Toast.show({
				type: "error",
				text1: "Não foi possivel excluir o produto.",
			});
		}
	}
	async function handleOpenOrder() {
		Keyboard.dismiss();
		if (!tableInput.trim()) {
			Alert.alert("Atenção!", "Necessario preencher o numero da mesa");
			return;
		}
		const tableNumber = parseInt(tableInput);
		if (isNaN(tableNumber) || tableNumber <= 0) {
			Alert.alert("Atenção!", "Necessario preencher o numero valido");
			return;
		}
		try {
			setLoading(true);
			const response = await api.post<OrderProps>("/add/orders", {
				table: tableNumber,
			});
			router.push({
				pathname: "/(authenticated)/order",
				params: {
					table: response.data.table.toString(),
					order_id: response.data.id,
				},
			});
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	}
	async function handleSendOrder() {
		Keyboard.dismiss();
		if (!order_id) {
			Toast.show({
				type: "error",
				text1: "Pedido não encontrado.",
			});
			router.push("/(authenticated)/dashboard");
			return;
		}
		try {
			setLoading(true);
			await api.post(`/orders/${order_id}/startOrder`);
			Toast.show({ type: "success", text1: "Pedido enviado com sucesso." });
			router.push("/(authenticated)/dashboard");
		} catch (error) {
			console.log(error);
			Toast.show({
				type: "error",
				text1: "Não foi possivel iniciar o pedido.",
			});
		} finally {
			setLoading(false);
		}
	}
	return {
		loadCategories,
		loadProducts,
		router,
		amount,
		detailOrder,
		categories,
		products,
		productSelected,
		categorySelected,
		modalVisible,
		loadingModal,
		modalData,
		loadingOrder,
		typeModal,
		setAmount,
		setLoadingOrder,
		handleOpenOrder,
		handleDeleteItem,
		handleAddItens,
		handleDeleteOrder,
		handleSelectItem,
		handleCloseModal,
		handleOpenModal,
		navigateToSendOrder,
		tableInput,
		setTableInput,
		handleSendOrder,
		loading,
	};
}
