import { TextInput, TextInputProps } from "react-native";

interface InputProps extends TextInputProps {
	placeholder: string;
}

export default function Input({ placeholder, ...rest }: InputProps) {
	return (
		<TextInput
			className="bg-[#101026] w-full px-5  border-zinc-700/70 border text-white  rounded-lg h-14"
			placeholderTextColor={"#f0f0f0aa"}
			placeholder={placeholder}
			{...rest}
		/>
	);
}
