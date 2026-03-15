import prisma from "../../prisma/prismaClient";

interface RequestProps {
	order_id: string;
}

class DeleteOrderService {
	async execute({ order_id }: RequestProps) {
		if (!order_id) {
			throw new Error("Order ID is required");
		}
		const order = await prisma.order.findUnique({
			where: {
				id: order_id,
			},
			include: {
				items: true,
			},
		});
		if (!order) {
			throw new Error("Order not found");
		}
		if (order.items.length > 0) {
			throw new Error("Cannot delete order with existing items");
		}
		const deleteOrder = await prisma.order.delete({
			where: {
				id: order_id,
			},
		});
		return deleteOrder;
	}
}

export { DeleteOrderService };
