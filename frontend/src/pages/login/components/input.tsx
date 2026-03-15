import type { UseFormRegister, FieldValues, Path } from "react-hook-form";

interface InputLoginProps<T extends FieldValues> {
	placeholder: string;
	name: Path<T>;
	register: UseFormRegister<T>;
	error?: string;
	focus: (e: React.FocusEvent<HTMLInputElement>) => void;
	blur: (e: React.FocusEvent<HTMLInputElement>) => void;
	fieldFocused: string | null;
	type: string;
}

export default function InputLogin<T extends FieldValues>({
	placeholder,
	name,
	type,
	register,
	error,
	focus,
	blur,
	fieldFocused,
}: InputLoginProps<T>) {
	return (
		<div className="flex flex-col">
			<input
				key={name}
				{...register(name)}
				className={`bg-[#101026] w-full px-3 py-1 h-12 placeholder:text-gray-400 border-gray-400 border rounded-lg mt-2 outline-0  text-white
					${error && "outline-red-600 outline-2"}
					${fieldFocused === name && !error ? "outline-blue-600 outline-2" : ""}
				`}
				placeholder={placeholder}
				type={type}
				onFocus={focus}
				onBlur={blur}
			/>
			{error && <span className="text-red-600 my-1">{error}</span>}
		</div>
	);
}
