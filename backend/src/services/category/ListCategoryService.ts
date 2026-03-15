import prisma from "../../prisma/prismaClient";

class ListCategoryService {
	async execute() {
		const categories = await prisma.category.findMany({
			select: {
				id: true,
				name: true,
			},
			orderBy: {
				name: "asc",
			},
		});
		return categories;
	}
}

export { ListCategoryService };
