import { useContext, useEffect, useState } from "react";
import type { LoginProps } from "..";
import InputLogin from "../components/input";
import { AuthContext } from "../../../contexts/auth/AuthContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signinSchema, type SigninData } from "../schema/schema";
import { useNavigate } from "react-router";

export default function SignIn({ setIsLogin }: LoginProps) {
	const { handleSignIn } = useContext(AuthContext);
	const nav = useNavigate();
	const [fieldFocused, setFieldFocused] = useState<string | null>(null);
	const {
		register,
		reset,
		handleSubmit,
		formState: { errors },
	} = useForm<SigninData>({
		resolver: zodResolver(signinSchema),
	});
	useEffect(() => {
		reset();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	async function onSubmit(data: SigninData) {
		const response = await handleSignIn(data);
		if (response) {
			nav("/", {
				replace: true,
			});
			return;
		}
	}
	function handleFocus(e: React.FocusEvent<HTMLInputElement>) {
		setFieldFocused(e.target.name);
	}
	function handleBlur() {
		setFieldFocused(null);
	}
	return (
		<div className="min-w-dvw min-h-dvh  justify-center flex items-center">
			<div className="w-full  max-w-2xl flex flex-col   gap-3 items-center py-5 min-h-80 px-2">
				<span className="gap-0.5 text-4xl flex italic font-bold text-white transition-all duration-500 hover:animate-pulse cursor-default text-non">
					Pizzaria<span className="text-red-600">Gomes</span>
				</span>
				<form
					className="flex flex-col w-full max-w-96"
					onSubmit={handleSubmit(onSubmit)}
				>
					<InputLogin<SigninData>
						placeholder="Digite seu email"
						name="email"
						type={"email"}
						register={register}
						error={errors.email?.message}
						focus={handleFocus}
						blur={handleBlur}
						fieldFocused={fieldFocused}
					/>
					<InputLogin<SigninData>
						placeholder="Digite sua senha"
						name="password"
						type={"password"}
						register={register}
						error={errors.password?.message}
						focus={handleFocus}
						blur={handleBlur}
						fieldFocused={fieldFocused}
					/>
					<button
						type="submit"
						className="bg-red-600 text-white font-bold transition-all duration-500 hover:bg-red-600/70 cursor-pointer mt-2 py-1 h-12 rounded-lg border-0 "
					>
						Acessar
					</button>
				</form>
				<button
					type="button"
					onClick={() => setIsLogin(false)}
					className=" font-bold transition-all duration-500 text-gray-400 cursor-pointer"
				>
					Não possui uma conta? Cadastre-se
				</button>
			</div>
		</div>
	);
}
