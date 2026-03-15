import prisma from "../../prisma/prismaClient";

interface RequestProps {
	name: string;
}

class CreateCategoryService {
	async execute({ name }: RequestProps) {
		if (!name || name.trim() === "") {
			throw new Error("Name is required");
		}
		const nameUpperCase = name.trim().toUpperCase();
		const hasCategory = await prisma.category.findFirst({
			where: {
				name: nameUpperCase,
			},
		});
		if (hasCategory) {
			throw new Error("Category already exists");
		}
		const category = await prisma.category.create({
			data: { name: nameUpperCase },
			select: {
				id: true,
				name: true,
			},
		});
		return category;
	}
}

export { CreateCategoryService };
