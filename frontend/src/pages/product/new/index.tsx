import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../../contexts/app/AppContext";
import { useForm } from "react-hook-form";
import { productSchema, type ProductFormData } from "../schema/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import Container from "../../../components/container";
import { Link } from "react-router";
import { ArrowBigDown, ArrowRight, Plus } from "lucide-react";
import ErrorMsg from "../components/error";
import InputProduct from "../components/input";
import type { CreateProductProps } from "../../../@types/types";

interface ImageFileProps {
	id: string;
	previewUrl: string;
	file: File;
}

export default function NewProduct() {
	const [fieldFocused, setFieldFocused] = useState<string | null>(null);
	const [image, setImage] = useState<ImageFileProps | null>(null);
	const [imageError, setImageError] = useState<boolean>(false);
	const [loadingCategories, setLoadingCategories] = useState<boolean>(true);
	const { listCategory, handleListCategories, createProduct } =
		useContext(AppContext);
	useEffect(() => {
		const loadCategory = async () => {
			await handleListCategories();
			setLoadingCategories(false);
		};
		loadCategory();
	}, [handleListCategories]);
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<ProductFormData>({
		resolver: zodResolver(productSchema),
	});
	async function onsubmit(data: ProductFormData) {
		if (!image?.file) {
			toast.error("Necessario anexar pelo menos uma imagem.");
			setImageError(true);
			return;
		}
		const newData: CreateProductProps = {
			file: image.file,
			...data,
		};
		const response = await createProduct(newData);
		if (response) {
			reset();
			setImage(null);
			return;
		}
	}
	function handleFocus(e: React.FocusEvent<HTMLInputElement>) {
		setFieldFocused(e.target.name);
	}
	function handleBlur() {
		setFieldFocused(null);
	}
	function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
		const files = e.target.files;
		if (!files || !files.length) {
			setImageError(true);
			return;
		}
		const img = files[0];
		if (image?.previewUrl) {
			URL.revokeObjectURL(image.previewUrl);
		}
		if (!img.type.startsWith("image/")) {
			toast.error("Formato inválido. Apenas imagens são permitidas.");
			return;
		}
		if (img.size > 5 * 1024 * 1024) {
			toast.error(`Imagem muito grande. Máximo permitido: ${5} MB.`);
			return;
		}
		const imgObj: ImageFileProps = {
			id: crypto.randomUUID(),
			previewUrl: URL.createObjectURL(img),
			file: img,
		};
		setImage(imgObj);
		setImageError(false);
	}
	if (loadingCategories)
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
			<div className="w-full max-w-3xl mx-auto flex flex-col justify-center  mt-5 p-4">
				{listCategory.length === 0 ? (
					<>
						<span className="text-2xl text-white italic font-medium text-center mb-2">
							Necessario cadastrar uma categoria
						</span>
						<Link
							to={"/category"}
							className="text-[#3fffa3] gap-2 font-bold transition-all duration-500  flex justify-center items-center  text-lg hover:scale-105 cursor-pointer mt-3 py-1 h-12 rounded-lg border-0 "
						>
							Cadastrar categoria <ArrowRight />
						</Link>
					</>
				) : (
					<>
						<span className="text-2xl text-white italic font-medium text-start mb-2">
							Novo Produto
						</span>
						<div
							className={`bg-[#101026] w-full border   rounded-lg h-40 transition duration-500 hover:scale-101 ${
								imageError && "border-red-500"
							} ${
								!imageError && image?.previewUrl.trim()
									? "border-2 border-green-700"
									: "border-gray-400 "
							} `}
						>
							<div className=" w-full h-full flex justify-center items-center  relative">
								<Plus size={35} color="#99a1af" />
								<input
									type="file"
									accept="image/*"
									onChange={(e) => handleFile(e)}
									className="absolute w-full h-full opacity-0  z-20 cursor-pointer"
								/>
								<img
									alt="Imagem do produto"
									src={image?.previewUrl}
									className={`absolute w-full h-full rounded-lg cursor-pointer  object-cover ${
										image?.previewUrl ? "block" : "hidden"
									}`}
								/>
							</div>
						</div>
						<form
							onSubmit={handleSubmit(onsubmit)}
							className="flex flex-col w-full gap-2 mt-2"
						>
							<div className="relative mt-2 flex">
								<select
									{...register("category")}
									className={`bg-[#101026] w-full border  border-gray-400  appearance-none rounded-lg h-12 transition duration-500 text-white px-4 ${
										errors.category?.message && "outline-red-600 outline-2"
									}
					${
						fieldFocused === "category" && !errors.category?.message
							? "outline-blue-600 outline-2"
							: ""
					}`}
									onFocus={() => setFieldFocused("category")}
									onBlur={() => setFieldFocused(null)}
								>
									{listCategory.map((category) => (
										<option key={category.id} value={category.id}>
											{category.name}
										</option>
									))}
								</select>
								<div className="absolute right-4 top-1/2 -translate-y-1/2 text-white">
									<ArrowBigDown />
								</div>
							</div>
							<ErrorMsg message={errors.category?.message} />
							<InputProduct<ProductFormData>
								placeholder="Digite o nome do produto"
								name="name"
								type={"text"}
								register={register}
								error={errors.name?.message}
								focus={handleFocus}
								blur={handleBlur}
								fieldFocused={fieldFocused}
							/>
							<InputProduct<ProductFormData>
								placeholder="Digite o preço do produto"
								name="price"
								type={"text"}
								register={register}
								error={errors.price?.message}
								focus={handleFocus}
								blur={handleBlur}
								fieldFocused={fieldFocused}
							/>
							<textarea
								key={"description"}
								{...register("description")}
								placeholder="Digite a descrição do produto"
								className={`resize-none bg-[#101026] w-full border mt-2 border-gray-400 rounded-lg h-26  text-white placeholder:text-gray-400 px-4 py-2 ${
									errors.description?.message && "outline-red-600 outline-2"
								}
					${
						fieldFocused === "description" && !errors.description?.message
							? "outline-blue-600 outline-2"
							: ""
					}
				`}
								onFocus={() => setFieldFocused("description")}
								onBlur={() => setFieldFocused(null)}
							></textarea>
							<ErrorMsg message={errors.description?.message} />
							<button
								type="submit"
								className="bg-[#3fffa3] text-[#101026] font-bold transition-all duration-500   text-lg hover:bg-[#3fffa3]/80 cursor-pointer mt-3 py-1 h-12 rounded-lg border-0 "
							>
								Cadastrar
							</button>
						</form>
					</>
				)}
			</div>
		</Container>
	);
}
