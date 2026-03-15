import { useState } from "react";
import type { ProductProps } from "../../../@types/types";

interface CardProductProps {
	item: ProductProps;
}

export default function CardProduct({ item }: CardProductProps) {
	const [uploadedImg, setUploadedImg] = useState("");
	const previewURL = `http://localhost:3333/files/${item.banner}`;
	return (
		<div className=" text-white  flex-col gap-2 rounded-lg shadow-2xl pb-3  shadow-[#101026] border border-zinc-700   ">
			<img
				className={`w-full rounded-t-lg object-cover  h-52  flex-1 flex ${
					uploadedImg === item.id ? "block" : "hidden"
				}`}
				src={previewURL}
				alt="imagem do produto"
				onLoad={() => setUploadedImg(item.id)}
			/>
			<div
				className={`h-52 rounded-t-lg w-full  flex justify-center items-center ${
					uploadedImg === item.id ? "hidden" : "block"
				}`}
			>
				<div className="animate-spin size-12 border-2 border-b-white border-[#3fffa3] rounded-full"></div>
			</div>
			<div className="flex font-medium justify-between px-4 mt-2 items-center ">
				<span className="truncate">{item.name}</span>
				<span className="text-nowrap ml-4">R$ {item.price.toFixed(2)}</span>
			</div>
		</div>
	);
}
