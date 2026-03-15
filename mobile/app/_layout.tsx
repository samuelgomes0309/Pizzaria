import { AuthProvider } from "@/src/contexts/AuthProvider";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import Toast from "react-native-toast-message";

export default function RootLayout() {
	return (
		<AuthProvider>
			<StatusBar style="light" />
			<Stack screenOptions={{ headerShown: false }}>
				<Stack.Screen name="index" />
				<Stack.Screen name="login" />
				<Stack.Screen name="(authenticated)" />
			</Stack>
			<Toast position="top" topOffset={60} autoHide visibilityTime={3000} />
		</AuthProvider>
	);
}
