import { RefreshCcw } from "lucide-react";
import Container from "../../components/container";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../contexts/app/AppContext";
import CardOrder from "./components/cardOrder";
import CardModal from "./components/cardModal";

export default function Dashboard() {
	const {
		handleListOrders,
		listOrders,
		setDetailOrder,
		handleDetailOrder,
		detailOrder,
		handleCloseOrder,
	} = useContext(AppContext);
	const [loadingOrders, setLoadingOrders] = useState<boolean>(true);
	const [loadingModal, setLoadingModal] = useState<boolean>(false);
	const [loadingRefreshOrders, setLoadingRefreshOrders] =
		useState<boolean>(false);
	const [modalVisible, setModalVisible] = useState<boolean>(false);
	useEffect(() => {
		const loadProducts = async () => {
			await handleListOrders();
			setLoadingOrders(false);
		};
		loadProducts();
	}, [handleListOrders]);
	async function handleModal(order_id: string, modalVisible: boolean) {
		if (!modalVisible) {
			setDetailOrder(null);
			setModalVisible(false);
			return;
		}
		if (!order_id) return;
		try {
			setLoadingModal(true);
			const response = await handleDetailOrder(order_id);
			if (response) {
				setModalVisible(true);
			}
		} catch (error) {
			console.error(error);
		} finally {
			setLoadingModal(false);
		}
	}
	async function handleRefreshOrders() {
		setLoadingRefreshOrders(true);
		await handleListOrders();
		setLoadingRefreshOrders(false);
	}
	if (loadingOrders)
		return (
			<Container>
				<div className="w-full max-w-3xl mx-auto flex flex-col justify-center  mt-5 p-4">
					<span className="text-white text-2xl text-center mt-4 animate-pulse">
						Carregando...
					</span>
				</div>
			</Container>
		);
	return (
		<Container>
			<div className="w-full max-w-3xl mx-auto flex flex-col justify-center mt-20">
				<div className="flex gap-3">
					<span className="text-2xl text-white italic font-medium text-start mb-2">
						Pedidos
					</span>
					<button
						type="button"
						onClick={handleRefreshOrders}
						disabled={loadingRefreshOrders}
						className={`transition-all duration-500  px-3 text-[#3fffa3] hover:scale-105 hover:cursor-pointer ${
							loadingRefreshOrders && "disabled:cursor-not-allowed "
						}`}
					>
						<RefreshCcw
							className={`${
								loadingRefreshOrders && "animate-spin text-blue-600"
							}`}
						/>
					</button>
				</div>
				{listOrders.length === 0 ? (
					<span className="text-white mt-5">
						Não possui pedidos no momento...
					</span>
				) : (
					<>
						<div className="mt-2 gap-2 flex flex-col">
							{listOrders.map((item) => (
								<CardOrder
									key={item.id}
									item={item}
									modal={handleModal}
									loadingRefresh={loadingRefreshOrders}
									loadingModal={loadingModal}
								/>
							))}
						</div>
						{modalVisible && detailOrder && (
							<CardModal
								key={detailOrder?.id}
								order={detailOrder}
								setModalVisible={handleModal}
								closeOrder={handleCloseOrder}
							/>
						)}
					</>
				)}
			</div>
		</Container>
	);
}
