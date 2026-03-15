import prisma from "../../prisma/prismaClient";

interface RequestProps {
	order_id: string;
	amount: string | number;
	product_id: string;
}

class AddItemService {
	async execute({ order_id, amount, product_id }: RequestProps) {
		if (!order_id) {
			throw new Error("Order ID is required");
		}
		const orderExists = await prisma.order.findUnique({
			where: {
				id: order_id,
			},
		});
		const itemQtd = Number(amount);
		if (isNaN(itemQtd) || itemQtd <= 0) {
			throw new Error("Invalid amount");
		}
		if (!orderExists) {
			throw new Error("Order not found");
		}
		const hasItem = await prisma.item.findFirst({
			where: {
				orderId: order_id,
				productId: product_id,
			},
		});
		if (hasItem) {
			const updatedItem = await prisma.item.update({
				where: {
					id: hasItem.id,
				},
				data: {
					amount: hasItem.amount + itemQtd,
				},
			});
			return updatedItem;
		}
		const newItem = await prisma.item.create({
			data: {
				amount: itemQtd,
				orderId: order_id,
				productId: product_id,
			},
		});
		return newItem;
	}
}

export { AddItemService };
