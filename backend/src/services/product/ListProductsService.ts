import prisma from "../../prisma/prismaClient";

class ListProductsService {
	async execute() {
		const findProducts = await prisma.product.findMany({
			select: {
				banner: true,
				id: true,
				name: true,
				price: true,
				description: true,
			},
		});
		return findProducts;
	}
}

export { ListProductsService };
