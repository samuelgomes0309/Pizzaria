// Type customizado para o Express reconhecer o user_id
declare namespace Express {
	export interface Request {
		user_id: string;
	}
}
