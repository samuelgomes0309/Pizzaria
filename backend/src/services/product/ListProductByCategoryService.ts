import prisma from "../../prisma/prismaClient";

interface RequestProps {
	category_id: string;
}

class ListProductByCategoryService {
	async execute({ category_id }: RequestProps) {
		if (!category_id) {
			throw new Error("Category ID is required");
		}
		const categoryExists = await prisma.category.findUnique({
			where: {
				id: category_id,
			},
		});
		if (!categoryExists) {
			throw new Error("Category not found");
		}
		const findProductByCategory = await prisma.product.findMany({
			where: {
				categoryId: category_id,
			},
			select: {
				banner: true,
				id: true,
				name: true,
				price: true,
				description: true,
			},
		});
		return findProductByCategory;
	}
}

export { ListProductByCategoryService };
