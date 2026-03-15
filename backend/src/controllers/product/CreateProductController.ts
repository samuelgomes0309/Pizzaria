import { Request, Response } from "express";
import { CreateProductService } from "../../services/product/CreateProductService";

class CreateProductController {
	async handle(req: Request, res: Response) {
		if (!req.file) {
			throw new Error("error upload file");
		} else {
			const { category_id, description, name, price } = req.body;
			const { filename: banner } = req.file;
			const createProductService = new CreateProductService();
			const product = await createProductService.execute({
				banner,
				category_id,
				description,
				name,
				price,
			});
			return res.json(product);
		}
	}
}

export { CreateProductController };
