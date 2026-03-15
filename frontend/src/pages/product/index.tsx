import { Link } from "react-router";
import Container from "../../components/container";
import { Plus } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../contexts/app/AppContext";
import CardProduct from "./components/cardProduct";

export default function Products() {
	const { listProducts, handleListProducts } = useContext(AppContext);
	const [loadingProducts, setLoadingProducts] = useState(true);
	useEffect(() => {
		const loadProducts = async () => {
			await handleListProducts();
			setLoadingProducts(false);
		};
		loadProducts();
	}, [handleListProducts]);
	if (loadingProducts)
		return (
			<Container>
				<div className="w-full max-w-3xl mx-auto flex flex-col justify-center  mt-5 p-4">
					<span className="text-white text-2xl text-center mt-4 animate-pulse">
						Carregando...
					</span>
				</div>
			</Container>
		);
	return (
		<Container>
			<div className="w-full   mx-auto flex flex-col justify-center  mt-5 p-4">
				{listProducts.length === 0 ? (
					<>
						<div className=" flex w-full items-center justify-center flex-col gap-2">
							<span className="text-2xl text-white italic font-medium text-center mb-2">
								Não possui nenhum produto cadastrado
							</span>
							<Link
								to={"/new-product"}
								className="text-[#3fffa3] border-[#3fffa3] gap-2 font-bold transition-all duration-500  flex justify-center items-center  text-lg hover:scale-102 cursor-pointer mt-3 p-2 rounded-lg border  "
							>
								<Plus /> Novo produto
							</Link>
						</div>
					</>
				) : (
					<>
						<div className=" flex w-full items-center justify-between">
							<span className="text-2xl text-white italic font-medium text-center mb-2">
								Lista de produtos
							</span>
							<Link
								to={"/new-product"}
								className="text-[#3fffa3] border-[#3fffa3] gap-2 font-bold transition-all duration-500  flex justify-center items-center  text-lg hover:scale-102 cursor-pointer mt-3 p-2 rounded-lg border  "
							>
								<Plus /> Novo produto
							</Link>
						</div>
						<div className="grid md:grid-cols-3 gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4  mt-5">
							{listProducts.map((item) => (
								<CardProduct item={item} key={item.id} />
							))}
						</div>
					</>
				)}
			</div>
		</Container>
	);
}
