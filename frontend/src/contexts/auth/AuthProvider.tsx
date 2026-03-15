import { useEffect, useState, type ReactNode } from "react";
import { AuthContext, type UserProps } from "./AuthContext";
import type { SigninData, SignupData } from "../../pages/login/schema/schema";
import { api } from "../../services/api/axios";
import { toast } from "react-toastify";

interface ContextProvider {
	children: ReactNode;
}

interface UserRequestProps {
	id: string;
	name: string;
	email: string;
	token: string;
}

export function AuthContextProvider({ children }: ContextProvider) {
	const [loadingAuth, setLoadingAuth] = useState<boolean>(true);
	const [user, setUser] = useState<UserProps | null>(null);
	function setToken(token: string) {
		api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
	}
	async function getMe() {
		try {
			const response = await api.get("/me");
			setUser({
				email: response.data?.email,
				name: response.data?.name,
				uid: response.data?.id,
			});
		} catch (error) {
			console.log(error);
		}
	}
	useEffect(() => {
		const loadUser = async () => {
			const token = localStorage.getItem("@pizzaria");
			if (!token) {
				setUser(null);
				setLoadingAuth(false);
				return;
			}
			setToken(token);
			try {
				await getMe();
			} catch (error) {
				console.log(error);
				setUser(null);
			} finally {
				setLoadingAuth(false);
			}
		};
		loadUser();
	}, []);
	async function handleSignUp(data: SignupData) {
		try {
			await api.post("/signup", data);
			toast.success("Cadastrado com sucesso");
			return true;
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (error: any) {
			console.log(error);
			toast.error("Falha ao tentar cadastrar, tente novamente");
			return false;
		}
	}
	async function handleSignIn(data: SigninData) {
		try {
			const response = await api.post("/login", data);
			const { name, email, id, token } = response.data as UserRequestProps;
			handleLocalToken(token);
			setUser({
				email: email,
				name: name,
				uid: id,
			});
			setToken(token);
			toast.success("Login realizado com sucesso");
			return true;
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (error: any) {
			console.log(error);
			toast.error("Falha ao tentar realizar o login, tente novamente");
			return false;
		}
	}
	function handleLocalToken(token: string) {
		localStorage.setItem("@pizzaria", token);
	}
	function logOut() {
		setUser(null);
		localStorage.removeItem("@pizzaria");
	}
	return (
		<AuthContext.Provider
			value={{
				user,
				handleSignUp,
				handleSignIn,
				loadingAuth,
				signed: !!user,
				logOut,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}
