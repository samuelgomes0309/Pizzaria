import Ionicons from "@expo/vector-icons/Ionicons";
import { Text, TouchableOpacity, View } from "react-native";
import { OrderItemProps } from "../@types";

interface CardItemProps {
	item: OrderItemProps;
	deleteItem: (product_id: string) => void;
}

export default function CardItem({ item, deleteItem }: CardItemProps) {
	return (
		<View
			key={item.id}
			className="bg-[#101026]  border border-gray-600 rounded-lg flex flex-row justify-between items-center px-4 h-14 my-2"
		>
			<Text className="text-white	truncate w-3/4">
				{item.amount} UN - {item.product.name}
			</Text>
			<TouchableOpacity onPress={() => deleteItem(item.productId)}>
				<Ionicons name="trash" size={25} color={"#F00000"} />
			</TouchableOpacity>
		</View>
	);
}
