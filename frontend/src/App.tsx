import { createBrowserRouter } from "react-router";
import Dashboard from "./pages/dashboard";
import Layout from "./components/layout";
import Login from "./pages/login";
import Private from "./routes/Private";
import Category from "./pages/category";
import { AppProvider } from "./contexts/app/AppProvider";
import NewProduct from "./pages/product/new";
import Products from "./pages/product";

const router = createBrowserRouter([
	{
		element: (
			<AppProvider>
				<Layout />
			</AppProvider>
		),
		children: [
			{
				path: "/",
				element: (
					<Private>
						<Dashboard />
					</Private>
				),
			},
			{
				path: "/category",
				element: (
					<Private>
						<Category />
					</Private>
				),
			},
			{
				path: "/products",
				element: (
					<Private>
						<Products />
					</Private>
				),
			},
			{
				path: "/new-product",
				element: (
					<Private>
						<NewProduct />
					</Private>
				),
			},
		],
	},
	{
		path: "/login",
		element: <Login />,
	},
]);

export { router };
