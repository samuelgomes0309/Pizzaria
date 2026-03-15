import z from "zod";

export const productSchema = z.object({
	category: z.string().min(1, "Selecione uma categoria"),
	name: z.string().nonempty("Nome do produto é obrigatorio."),
	description: z.string().nonempty("Descrição do produto é obrigatorio."),
	price: z.string().nonempty("O preço é obrigatorio"),
});

export type ProductFormData = z.infer<typeof productSchema>;
