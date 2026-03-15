import prisma from "../../prisma/prismaClient";

interface RequestProps {
	name: string;
	price: string | number;
	banner: string;
	description: string;
	category_id: string;
}

class CreateProductService {
	async execute({
		banner,
		category_id,
		description,
		name,
		price,
	}: RequestProps) {
		if (!category_id || !name || !description || !banner || !price) {
			throw new Error("All fields are required");
		}
		const categoryExists = await prisma.category.findUnique({
			where: {
				id: category_id,
			},
		});
		if (!categoryExists) {
			throw new Error("Category not found");
		}
		const priceValue = Number(price);
		if (isNaN(priceValue) || priceValue <= 0) {
			throw new Error("Invalid price");
		}
		const product = await prisma.product.create({
			data: {
				banner,
				description,
				name,
				price: priceValue,
				categoryId: category_id,
			},
		});
		return product;
	}
}

export { CreateProductService };
