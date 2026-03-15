import { useContext, useEffect, useState } from "react";
import SignUp from "./signup";
import SignIn from "./signin";
import { AuthContext } from "../../contexts/auth/AuthContext";

export interface LoginProps {
	setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Login() {
	const [isLogin, setIsLogin] = useState<boolean>(true);
	const { logOut } = useContext(AuthContext);
	useEffect(() => {
		logOut();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	return isLogin ? (
		<SignIn setIsLogin={setIsLogin} />
	) : (
		<SignUp setIsLogin={setIsLogin} />
	);
}
