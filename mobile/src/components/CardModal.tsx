import Ionicons from "@expo/vector-icons/Ionicons";
import {
	ActivityIndicator,
	FlatList,
	Text,
	TouchableOpacity,
	TouchableWithoutFeedback,
	View,
} from "react-native";
import { CategoryProps, ProductProps } from "../@types";

interface CardModalProps {
	data: CategoryProps[] | ProductProps[];
	type: "category" | "product";
	onClose: () => void;
	onSelect: (
		item: ProductProps | CategoryProps,
		type: "category" | "product"
	) => Promise<void>;
	selected?: CategoryProps | ProductProps;
	loading: boolean;
}

export default function CardModal({
	data,
	onClose,
	onSelect,
	selected,
	type,
	loading,
}: CardModalProps) {
	if (!data || data.length === 0) {
		return (
			<View className="flex-1 items-center justify-center">
				<Text className="text-white">Nenhum item encontrado</Text>
			</View>
		);
	}
	return (
		<TouchableWithoutFeedback onPress={onClose}>
			<View className=" bg-[#1d1d2e]/30 flex-1 items-center ">
				<View className="w-full px-4 mt-5 ">
					<FlatList
						data={data}
						keyExtractor={(item) => item.id}
						renderItem={({ item }) => (
							<TouchableOpacity
								activeOpacity={0.9}
								disabled={loading}
								onPress={() => onSelect(item, type)}
								className="bg-white  h-14 p-4  flex items-center justify-between flex-row border-b border-gray-400"
							>
								<Text
									className={`${
										item?.id === selected?.id
											? "text-sky-600 font-bold"
											: "text-black"
									} text-xl`}
								>
									{item?.name}
								</Text>
								{loading ? (
									<ActivityIndicator size={22} color={"#0284c7"} />
								) : (
									<Ionicons
										name="add-circle"
										size={22}
										color={item?.id === selected?.id ? "#0284c7" : "#000"}
									/>
								)}
							</TouchableOpacity>
						)}
					/>
				</View>
			</View>
		</TouchableWithoutFeedback>
	);
}
