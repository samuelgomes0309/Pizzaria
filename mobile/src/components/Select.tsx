import Ionicons from "@expo/vector-icons/Ionicons";
import { Text, TouchableOpacity, View } from "react-native";
import { ModalType } from "../@types";

interface SelectProps {
	title: string;
	type: ModalType;
	onOpen: (type: ModalType) => void;
}

export default function Select({ title, type, onOpen }: SelectProps) {
	return (
		<View className="mt-4">
			<TouchableOpacity
				onPress={() => onOpen(type)}
				className="bg-[#101026]  rounded-lg h-14 justify-between  items-center   flex flex-row px-4"
			>
				<Text className="text-[#f0f0f0]">{title}</Text>
				<Ionicons name="arrow-down" size={25} color={"#f0f0f0"} />
			</TouchableOpacity>
		</View>
	);
}
