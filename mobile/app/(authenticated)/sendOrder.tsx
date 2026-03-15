import Button from "@/src/components/Button";
import { useOrder } from "@/src/hooks/useOrder";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SendOrder() {
	const { table, order_id } = useLocalSearchParams<{
		table: string;
		order_id: string;
	}>();
	const { handleSendOrder, loading } = useOrder({ table, order_id });
	const router = useRouter();
	return (
		<SafeAreaView className="bg-[#1d1d2e] flex-1 ">
			<View className="flex-1 p-4">
				<View className="flex-row gap-4 items-center">
					<TouchableOpacity onPress={() => router.back()}>
						<Ionicons size={25} name="arrow-back" color={"#fff"} />
					</TouchableOpacity>
					<Text className="text-white font-bold text-xl">Enviando pedido</Text>
				</View>
				<View className="flex-1 justify-center gap-3.5  items-center ">
					<Text className="text-white font-bold text-2xl text-center">
						Você deseja enviar o pedido ?
					</Text>
					<Text className="text-white font-bold text-2xl text-center">
						Mesa - {table}
					</Text>
					<Button
						title="Enviar"
						onPress={handleSendOrder}
						disabled={loading}
						loading={loading}
					/>
				</View>
			</View>
		</SafeAreaView>
	);
}
