import { Outlet } from "react-router";
import Sidebar from "../sidebar";

// Componente de layout
export default function Layout() {
	return (
		<>
			<Sidebar />
			<Outlet />
		</>
	);
}
