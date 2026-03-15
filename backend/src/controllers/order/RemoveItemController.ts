import { Request, Response } from "express";
import { RemoveItemService } from "../../services/order/RemoveItemService";

class RemoveItemController {
	async handle(req: Request, res: Response) {
		const { order_id, product_id } = req.body;
		const removeItemService = new RemoveItemService();
		const item = await removeItemService.execute({
			order_id,
			product_id,
		});
		return res.json(item);
	}
}

export { RemoveItemController };
