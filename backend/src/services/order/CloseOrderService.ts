import prisma from "../../prisma/prismaClient";

interface RequestProps {
	order_id: string;
}

class CloseOrderService {
	async execute({ order_id }: RequestProps) {
		if (!order_id) {
			throw new Error("Order ID is required");
		}
		const orderExists = await prisma.order.findUnique({
			where: {
				id: order_id,
			},
			include: {
				items: true,
			},
		});
		if (orderExists.items.length === 0) {
			throw new Error("Order must have at least one item");
		}
		const updatedOrder = await prisma.order.update({
			where: {
				id: order_id,
			},
			data: {
				status: true,
			},
		});
		return updatedOrder;
	}
}

export { CloseOrderService };
