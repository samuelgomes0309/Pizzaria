import Button from "@/src/components/Button";
import Input from "@/src/components/Input";
import { useAuth } from "@/src/contexts/AuthProvider";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
	Alert,
	KeyboardAvoidingView,
	ScrollView,
	Text,
	View,
} from "react-native";

export default function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassWord] = useState("");
	const { login, loading, setLoading } = useAuth();
	const router = useRouter();
	async function handleLogin() {
		if (!email.trim() || !password.trim()) {
			Alert.alert("Atenção!", "Preencha todos os campos");
			return;
		}
		try {
			setLoading(true);
			login(email, password);
			router.replace("/(authenticated)/dashboard");
		} catch (error) {
			console.log(error);
			Alert.alert("Atenção!", "Erro ao fazer login");
		}
	}
	return (
		<KeyboardAvoidingView
			className="bg-[#1d1d2e]  flex-1  "
			behavior={"padding"}
		>
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
				<View className="justify-center px-2 gap-4 items-center flex   w-full">
					<Text className="text-4xl flex italic font-bold  text-center w-4/5  text-white  ">
						Pizzaria <Text className="text-red-600">Gomes</Text>
					</Text>
					<Input
						placeholder="Digite seu email"
						value={email}
						onChangeText={setEmail}
					/>
					<Input
						secureTextEntry
						placeholder="Digite sua senha"
						value={password}
						onChangeText={setPassWord}
					/>
					<Button
						title="Acessar"
						onPress={handleLogin}
						disabled={loading}
						loading={loading}
					/>
				</View>
			</ScrollView>
		</KeyboardAvoidingView>
	);
}
