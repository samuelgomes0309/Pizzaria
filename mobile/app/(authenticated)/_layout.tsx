import { useAuth } from "@/src/contexts/AuthProvider";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";

export default function AuthenticatedLayout() {
	const { loading, signed } = useAuth();
	const router = useRouter();
	useEffect(() => {
		if (!loading && !signed) {
			router.replace("/login");
		}
	}, [loading, signed, router]);
	if (loading || !signed) return null;
	return (
		<>
			<StatusBar style="light" />
			<Stack screenOptions={{ headerShown: false }}>
				<Stack.Screen name="dashboard" />
				<Stack.Screen name="order" />
			</Stack>
		</>
	);
}
