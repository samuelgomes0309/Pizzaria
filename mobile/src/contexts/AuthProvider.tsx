import AsyncStorage from "@react-native-async-storage/async-storage";
import { ReactNode, useContext, useEffect, useState } from "react";
import { LoginResponse, UserProps } from "../@types";
import { api } from "../services/api";
import { AuthContext } from "./AuthContext";

interface AuthProviderProps {
	children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
	const [user, setUser] = useState<UserProps | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	useEffect(() => {
		async function loadData() {
			await loadStorage();
		}
		loadData();
	}, []);
	async function loadStorage() {
		try {
			setLoading(true);
			const storageToken = await AsyncStorage.getItem("@token:pizzaria");
			const storageUser = await AsyncStorage.getItem("@user:pizzaria");
			if (storageToken && storageUser) {
				setUser(JSON.parse(storageUser));
			}
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	}
	async function login(email: string, password: string) {
		try {
			const response = await api.post<LoginResponse>("/login", {
				email,
				password,
			});
			const { token, ...userData } = response.data;
			await AsyncStorage.setItem("@token:pizzaria", token);
			await AsyncStorage.setItem("@user:pizzaria", JSON.stringify(userData));
			setUser(userData);
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	}
	async function logOut() {
		await AsyncStorage.removeItem("@token:pizzaria");
		await AsyncStorage.removeItem("@user:pizzaria");
		setUser(null);
	}
	return (
		<AuthContext.Provider
			value={{ signed: !!user, user, login, loading, setLoading, logOut }}
		>
			{children}
		</AuthContext.Provider>
	);
}

//Hook para chamar o contexto
export function useAuth() {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("Contexto não encontrado!");
	}
	return context;
}
