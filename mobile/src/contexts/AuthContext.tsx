import { createContext } from "react";
import { UserProps } from "../@types";

interface ContextProps {
	signed: boolean;
	user: UserProps | null;
	login: (email: string, password: string) => void;
	loading: boolean;
	setLoading: React.Dispatch<React.SetStateAction<boolean>>;
	logOut: () => Promise<void>;
}

export const AuthContext = createContext({} as ContextProps);
