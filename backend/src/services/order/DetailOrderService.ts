import prisma from "../../prisma/prismaClient";

interface RequestProps {
	order_id: string;
}

class DetailOrderService {
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
		const products = await prisma.product.findMany({});
		const { items, created_at, draft, id, name, status, table, updated_at } =
			order;
		const newItems = items.map((item) => {
			const detailProduct = products.find(
				(product) => item.productId === product.id
			);
			if (!detailProduct) {
				throw new Error("Product not found");
			}
			return {
				...item,
				product: detailProduct,
			};
		});
		const orderFormated = {
			created_at,
			draft,
			id,
			name,
			status,
			table,
			updated_at,
			items: newItems,
		};
		return orderFormated;
	}
}

export { DetailOrderService };
