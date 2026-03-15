import { LogOut } from "lucide-react";
import { useContext } from "react";
import { Link } from "react-router";
import { AuthContext } from "../../contexts/auth/AuthContext";

// Componente barra de menu
export default function Sidebar() {
	const { logOut } = useContext(AuthContext);
	return (
		<div className="w-full  max-w-7xl mx-auto flex justify-between gap-4 items-center p-4 ">
			<Link to={"/"} className="flex flex-1">
				<span className="gap-0.5 text-3xl flex italic font-bold text-white transition-all duration-500 hover:animate-pulse hover:cursor-pointer">
					Pizzaria<span className="text-red-600">Gomes</span>
				</span>
			</Link>
			<Link
				to={"/category"}
				className="text-white transition-all duration-500 hover:scale-105"
			>
				Nova Categoria
			</Link>
			<Link
				to={"/products"}
				className="text-white transition-all duration-500 hover:scale-105"
			>
				Cardapio
			</Link>
			<button
				type="button"
				onClick={() => logOut()}
				className="text-white transition-all duration-500 hover:scale-105 cursor-pointer"
			>
				<LogOut />
			</button>
		</div>
	);
}
