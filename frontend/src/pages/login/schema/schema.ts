import z from "zod";

export const signupSchema = z.object({
	name: z.string().nonempty("O nome é obrigatório"),
	email: z
		.email("Necessario informar um email valido")
		.nonempty("Necessario informar um email valido"),
	password: z.string().nonempty("A senha é obrigatória"),
});

export type SignupData = z.infer<typeof signupSchema>;

export const signinSchema = z.object({
	email: z.email().nonempty("Necessario informar um email valido"),
	password: z.string().nonempty("A senha é obrigatória"),
});

export type SigninData = z.infer<typeof signinSchema>;
