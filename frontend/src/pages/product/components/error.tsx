interface ErrorMsgProps {
	message?: string;
}

export default function ErrorMsg({ message }: ErrorMsgProps) {
	if (!message?.trim()) return null;
	return <span className="text-red-600 my-1">{message}</span>;
}
