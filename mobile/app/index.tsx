import { useAuth } from "@/src/contexts/AuthProvider";
import { useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import "../global.css";

export default function Index() {
	const { loading, signed } = useAuth();
	const segments = useSegments();
	const router = useRouter();
	useEffect(() => {
		if (loading) return;
		const inAuthGroup = segments[0] === "(authenticated)";
		if (!signed && inAuthGroup) {
			router.replace("/login");
		} else if (signed && !inAuthGroup) {
			router.replace("/(authenticated)/dashboard");
		} else if (!signed) {
			router.replace("/login");
		}
	}, [loading, router, segments, signed]);
	if (loading) {
		return (
			<SafeAreaView className="bg-[#101026]  flex-1  justify-center  items-center">
				<ActivityIndicator color={"#f0f0f0"} size={"large"} />
			</SafeAreaView>
		);
	}
	return (
		<SafeAreaView className="bg-[#101026]  flex-1  justify-center  items-center">
			<ActivityIndicator color={"#f0f0f0"} size={"large"} />
		</SafeAreaView>
	);
}
