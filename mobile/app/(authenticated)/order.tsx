import Button from "@/src/components/Button";
import CardItem from "@/src/components/CardItem";
import CardModal from "@/src/components/CardModal";
import Input from "@/src/components/Input";
import Select from "@/src/components/Select";
import { useOrder } from "@/src/hooks/useOrder";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useLocalSearchParams } from "expo-router";
import {
	ActivityIndicator,
	FlatList,
	Modal,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

export default function Order() {
	const { table, order_id } = useLocalSearchParams<{
		table: string;
		order_id: string;
	}>();
	const {
		amount,
		detailOrder,
		productSelected,
		categorySelected,
		modalVisible,
		loadingModal,
		modalData,
		loadingOrder,
		typeModal,
		setAmount,
		navigateToSendOrder,
		handleDeleteItem,
		handleAddItens,
		handleDeleteOrder,
		handleSelectItem,
		handleCloseModal,
		handleOpenModal,
	} = useOrder({ order_id, table });
	if (loadingOrder) {
		return (
			<View className="bg-[#1d1d2e] flex-1 p-4 justify-center items-center">
				<ActivityIndicator size={"large"} color={"#fff"} />
			</View>
		);
	}
	return (
		<SafeAreaView className="bg-[#1d1d2e] flex-1 p-4">
			<View className="flex flex-row gap-6 items-center mt-10">
				<Text className="text-white text-2xl font-bold">Mesa - {table}</Text>
				<TouchableOpacity onPress={handleDeleteOrder}>
					<Ionicons name="trash" size={25} color={"#F00000"} />
				</TouchableOpacity>
			</View>
			<Select
				type="category"
				title={categorySelected?.name ?? "Selecione a categoria"}
				onOpen={() => {
					if (!categorySelected?.name) {
						Toast.show({
							type: "error",
							text1: "Não possui nenhuma categoria cadastrada",
						});
						return;
					}
					handleOpenModal("product");
				}}
			/>
			<Select
				type="product"
				title={productSelected?.name ?? "Selecione o produto"}
				onOpen={() => {
					if (!productSelected?.name) {
						Toast.show({
							type: "error",
							text1: "Não possui nenhum produto cadastrado",
						});
						return;
					}
					handleOpenModal("product");
				}}
			/>
			<View className="mt-4 flex flex-row justify-center  w-full items-center h-14">
				<Text className="flex-1 text-xl font-bold text-white ">Quantidade</Text>
				<View className="flex-1 items-end">
					<Input
						value={amount}
						onChangeText={setAmount}
						placeholder="Ex: 1"
						keyboardType="numeric"
					/>
				</View>
			</View>
			<View className="mt-4 flex flex-row justify-between gap-2 w-full items-center h-14">
				<TouchableOpacity
					onPress={handleAddItens}
					disabled={!amount}
					className="flex w-20 rounded-lg h-14 justify-center items-center bg-sky-600 disabled:opacity-40 "
				>
					<Ionicons name="add" size={30} color={"#Ffff"} />
				</TouchableOpacity>
				<View className="flex-1">
					<Button
						onPress={navigateToSendOrder}
						title="Avançar"
						disabled={!detailOrder || detailOrder.items.length === 0}
					/>
				</View>
			</View>
			{detailOrder?.items && detailOrder.items.length > 0 && (
				<FlatList
					className="flex-1 mt-4"
					keyExtractor={(item) => item.id}
					data={detailOrder?.items}
					showsVerticalScrollIndicator={false}
					renderItem={({ item }) => (
						<CardItem item={item} deleteItem={handleDeleteItem} key={item.id} />
					)}
					contentContainerStyle={{ paddingBottom: 16 }}
				/>
			)}
			<Modal animationType="fade" visible={modalVisible} transparent={true}>
				{modalVisible && (
					<CardModal
						data={modalData}
						loading={loadingModal}
						selected={
							typeModal === "category" ? categorySelected : productSelected
						}
						type={typeModal}
						onSelect={handleSelectItem}
						onClose={handleCloseModal}
					/>
				)}
			</Modal>
		</SafeAreaView>
	);
}
