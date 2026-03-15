import { createRoot } from "react-dom/client";
import { router } from "./App.tsx";
import { RouterProvider } from "react-router";
import "./index.css";
import { AuthContextProvider } from "./contexts/auth/AuthProvider.tsx";
import { ToastContainer } from "react-toastify";

createRoot(document.getElementById("root")!).render(
	<AuthContextProvider>
		<RouterProvider router={router} />
		<ToastContainer />
	</AuthContextProvider>
);
