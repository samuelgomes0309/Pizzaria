import prisma from "../../prisma/prismaClient";
import bcrypt from "bcryptjs";

interface RequestProps {
	name: string;
	password: string;
	email: string;
}

class CreateUserService {
	async execute({ email, name, password }: RequestProps) {
		if (!email || !password) {
			throw new Error("Email and password are required");
		}
		const hasUser = await prisma.user.findFirst({
			where: {
				email: email,
			},
		});
		if (hasUser) {
			throw new Error("User already exists");
		}
		const passwordHash = await bcrypt.hash(password, 10);
		const user = await prisma.user.create({
			data: {
				email: email,
				name: name,
				password: passwordHash,
			},
			select: {
				email: true,
				id: true,
				name: true,
			},
		});
		return user;
	}
}

export { CreateUserService };
