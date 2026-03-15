import Button from "@/src/components/Button";
import Input from "@/src/components/Input";
import { useAuth } from "@/src/contexts/AuthProvider";
import { useOrder } from "@/src/hooks/useOrder";
import { useLocalSearchParams } from "expo-router";
import {
	KeyboardAvoidingView,
	ScrollView,
	Text,
	TouchableOpacity,
	View,
} from "react-native";

export default function Dashboard() {
	const { order_id } = useLocalSearchParams<{
		order_id: string;
	}>();
	const { handleOpenOrder, loading, setTableInput, tableInput } = useOrder({
		order_id,
	});
	const { logOut } = useAuth();
	return (
		<KeyboardAvoidingView className="bg-[#1d1d2e]  flex-1  " behavior="padding">
			<ScrollView
				keyboardShouldPersistTaps="handled"
				contentContainerStyle={{
					flexGrow: 1,
					justifyContent: "center",
					alignItems: "center",
					paddingHorizontal: 8,
					gap: 16,
				}}
			>
				<View className="bg-[#1d1d2e] flex-1 justify-center px-2 gap-4 items-center flex  w-full">
					<View className="absolute z-20 top-20 right-4">
						<TouchableOpacity
							className="bg-red-600 w-16 h-10 flex justify-center items-center rounded-lg"
							onPress={logOut}
						>
							<Text className="text-white">Sair</Text>
						</TouchableOpacity>
					</View>
					<Text className="text-4xl flex italic font-bold  text-center w-4/5  text-white mb-10 ">
						Pizzaria <Text className="text-red-600">Gomes</Text>
					</Text>
					<Text className="text-2xl flex italic font-bold  text-center w-4/5  text-white  ">
						Novo pedido
					</Text>
					<Input
						placeholder="Numero da mesa"
						keyboardType="numeric"
						value={tableInput}
						onChangeText={setTableInput}
					/>
					<Button
						title="Abrir mesa"
						onPress={handleOpenOrder}
						disabled={loading}
						loading={loading}
					/>
				</View>
			</ScrollView>
		</KeyboardAvoidingView>
	);
}
