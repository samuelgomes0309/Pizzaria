import { useForm } from "react-hook-form";
import Container from "../../components/container";
import { categorySchema, type CategoryFormData } from "./schema/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../contexts/app/AppContext";

export default function Category() {
	const { createCategory } = useContext(AppContext);
	const [fieldFocused, setFieldFocused] = useState<string | null>(null);
	const {
		reset,
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<CategoryFormData>({
		resolver: zodResolver(categorySchema),
	});
	useEffect(() => {
		reset();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	async function onsubmit(data: CategoryFormData) {
		const response = await createCategory(data);
		if (response) {
			reset();
		}
	}
	return (
		<Container>
			<div className="w-full max-w-3xl mx-auto flex flex-col justify-center mt-20">
				<span className="text-2xl text-white italic font-medium text-start mb-2">
					Nova Categoria
				</span>
				<form
					onSubmit={handleSubmit(onsubmit)}
					className="flex flex-col w-full"
				>
					<input
						key={"name"}
						{...register("name")}
						className={`bg-[#101026] w-full px-3 py-1 h-12 placeholder:text-gray-400 border-gray-400 border rounded-lg mt-2 outline-0  text-white
					${errors.name?.message && "outline-red-600 outline-2"}
					${
						fieldFocused === "name" && !errors.name?.message
							? "outline-blue-600 outline-2"
							: ""
					}
				`}
						placeholder={"Digite o nome da categoria"}
						type={"text"}
						onFocus={() => setFieldFocused("name")}
						onBlur={() => setFieldFocused(null)}
					/>
					{errors.name?.message && (
						<span className="text-red-600 my-1">{errors.name?.message} </span>
					)}
					<button
						type="submit"
						className="bg-[#3fffa3] text-[#101026] font-bold transition-all duration-500   text-lg hover:bg-[#3fffa3]/80 cursor-pointer mt-3 py-1 h-12 rounded-lg border-0 "
					>
						Cadastrar
					</button>
				</form>
			</div>
		</Container>
	);
}
