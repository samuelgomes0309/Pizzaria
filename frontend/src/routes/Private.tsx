import { useContext, type ReactNode } from "react";
import { AuthContext } from "../contexts/auth/AuthContext";
import { Navigate } from "react-router";

interface PrivateProps {
	children: ReactNode;
}

export default function Private({ children }: PrivateProps) {
	const { loadingAuth, signed } = useContext(AuthContext);
	if (loadingAuth) {
		return (
			<div className="bg-[#101026] h-dvh flex w-full top-0 absolute z-20 justify-center items-center">
				<div className=" animate-spin w-full h-full max-w-40 max-h-40 rounded-full  border-gray-400 border-b-white border-2"></div>
			</div>
		);
	}
	if (!signed) {
		return <Navigate to={"/login"} />;
	}
	return children;
}
