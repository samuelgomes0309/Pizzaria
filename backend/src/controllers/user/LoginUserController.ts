import { Request, Response } from "express";
import { LoginUserService } from "../../services/user/LoginUserService";

class LoginUserController {
	async handle(req: Request, res: Response) {
		const { email, password } = req.body;
		const loginUserService = new LoginUserService();
		const user = await loginUserService.handle({ email, password });
		return res.json(user);
	}
}

export { LoginUserController };
