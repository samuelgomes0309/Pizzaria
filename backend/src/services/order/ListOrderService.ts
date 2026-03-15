import prisma from "../../prisma/prismaClient";

class ListOrderService {
	async execute() {
		const orders = await prisma.order.findMany({
			where: {
				draft: false,
				status: false,
			},
			orderBy: {
				updated_at: "desc",
			},
		});
		return orders;
	}
}

export { ListOrderService };
