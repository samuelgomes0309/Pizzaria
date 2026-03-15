import prisma from "../../prisma/prismaClient";

interface RequestProps {
	order_id: string;
	product_id: string;
}

class RemoveItemService {
	async execute({ order_id, product_id }: RequestProps) {
		if (!order_id) {
			throw new Error("Order ID is required");
		}
		const item = await prisma.item.findFirst({
			where: {
				orderId: order_id,
				productId: product_id,
			},
			include: {
				order: true,
			},
		});
		if (!item) {
			throw new Error("Item not found");
		}
		if (item.order.draft === false) {
			throw new Error("Order has already been sent");
		}
		const deletedItem = await prisma.item.delete({
			where: {
				id: item.id,
			},
		});
		return deletedItem;
	}
}

export { RemoveItemService };
