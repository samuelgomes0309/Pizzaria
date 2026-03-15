import { createContext } from "react";
import type { SigninData, SignupData } from "../../pages/login/schema/schema";

interface ContextData {
	user: UserProps | null;
	handleSignUp: (data: SignupData) => Promise<boolean>;
	handleSignIn: (data: SigninData) => Promise<boolean>;
	loadingAuth: boolean;
	signed: boolean;
	logOut: () => void;
}

export interface UserProps {
	uid: string;
	name: string;
	email: string;
}

// Contexto de autenticação
export const AuthContext = createContext({} as ContextData);
