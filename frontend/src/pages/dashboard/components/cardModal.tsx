import { X } from "lucide-react";
import type { DetailOrderProps } from "../../../@types/types";

interface CardModalProps {
	order: DetailOrderProps | null;
	setModalVisible: (order_id: string, modalVisible: boolean) => void;
	closeOrder: (order_id: string) => void;
}

export default function CardModal({
	order,
	setModalVisible,
	closeOrder,
}: CardModalProps) {
	if (!order) return null;
	return (
		<div
			className=" left-0 absolute min-w-screen  flex w-full min-h-dvh top-0 p-4 bg-gray-700/20"
			onClick={() => setModalVisible(order?.id, false)}
		>
			<div
				onClick={(e) => e.stopPropagation()}
				className="bg-[#101026] flex flex-col  mx-auto my-auto relative  z-20 rounded-lg shadow-2xl text-white px-6 py-5 w-full max-w-3xl gap-3 border border-zinc-800/50"
			>
				<button
					type="button"
					onClick={() => setModalVisible(order?.id, false)}
					className="border rounded-full  w-12 h-12 flex justify-center items-center text-red-600 cursor-pointer transition-all duration-500 hover:bg-red-500/20"
				>
					<X size={30} />
				</button>
				<span className="text-2xl font-bold">Detalhes do pedido</span>
				<span className="text-[#3fffa3] text-lg font-medium">
					Mesa: {order?.table}
				</span>
				{order?.items?.map((item) => (
					<div key={item.id} className="flex flex-col">
						<span>
							{item.amount} -{" "}
							<span className="text-[#3fffa3]">{item.product.name}</span>
						</span>
						<span className="text-gray-400">{item.product.description}</span>
					</div>
				))}
				<button
					type="button"
					onClick={() => closeOrder(order.id)}
					className="rounded-lg bg-black/40 w-40  p-2 mt-20 flex justify-center items-center text-red-600 cursor-pointer transition-all duration-500 hover:text-white"
				>
					Concluir pedido
				</button>
			</div>
		</div>
	);
}
