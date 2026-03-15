import z from "zod";

export const categorySchema = z.object({
	name: z.string().nonempty("Nome da categoria é obrigatorio."),
});

export type CategoryFormData = z.infer<typeof categorySchema>;
