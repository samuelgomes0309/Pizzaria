import type { OrderProps } from "../../../@types/types";

interface CardOrderProps {
	item: OrderProps;
	modal: (order_id: string, modalVisible: boolean) => Promise<void>;
	loadingRefresh: boolean;
	loadingModal: boolean;
}

export default function CardOrder({
	item,
	modal,
	loadingRefresh,
	loadingModal,
}: CardOrderProps) {
	function handleStartModal() {
		if (!loadingRefresh) {
			modal(item.id, true);
		}
	}
	const isDisabled = loadingRefresh || loadingModal;
	return (
		<button
			className={`bg-[#101026]  w-full rounded-lg flex text-white font-medium transition-all duration-500 border  ${
				isDisabled
					? " disabled:cursor-not-allowed border-red-600 "
					: " border-transparent hover:border-[#3fffa3] hover:cursor-pointer"
			}`}
			onClick={handleStartModal}
			disabled={isDisabled}
		>
			<div
				className={` w-2 h-10 border-2  rounded-bl-lg rounded-tl-lg ${
					isDisabled
						? "cursor-not-allowed border-red-600  bg-red-600"
						: " border-[#3fffa3] bg-[#3fffa3]"
				}`}
			></div>
			{loadingModal ? (
				<div className="animate-spin  size-6 ml-3 my-2 border-2 border-b-white border-[#3fffa3] rounded-full"></div>
			) : (
				<span className="py-2 ml-3">Mesa - {item.table}</span>
			)}
		</button>
	);
}
