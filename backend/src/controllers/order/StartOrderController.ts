import { Request, Response } from "express";
import { StartOrderService } from "../../services/order/StartOrderService";

class StartOrderController {
	async handle(req: Request, res: Response) {
		const { order_id } = req.params;
		const startOrderService = new StartOrderService();
		const order = await startOrderService.execute({ order_id });
		return res.json(order);
	}
}

export { StartOrderController };
