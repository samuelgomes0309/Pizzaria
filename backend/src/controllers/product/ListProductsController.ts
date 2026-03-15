import { Request, Response } from "express";
import { ListProductsService } from "../../services/product/ListProductsService";

class ListProductsController {
	async handle(_req: Request, res: Response) {
		const listProductsService = new ListProductsService();
		const products = await listProductsService.execute();
		return res.json(products);
	}
}

export { ListProductsController };
