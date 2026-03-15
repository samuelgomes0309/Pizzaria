import "dotenv/config";
import "express-async-errors";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import { router } from "./routes";
import path from "path";

const app = express();

app.use(express.json());

app.use("/files", express.static(path.resolve(__dirname, "..", "tmp")));

app.use(cors());

app.use(router);

const port = 3333;

//---------CORES CONSOLE---------//
const blue = "\x1b[34m";
const yellow = "\x1b[33m";
const red = "\x1b[31m";
const reset = "\x1b[0m";

const message =
	`${blue}Servidor iniciado na porta${reset} ` +
	`${yellow}${port}${reset}` +
	`. -- [` +
	`${red}${new Date().toLocaleString()}${reset}` +
	`]`;
//-------------------------------//

//middleware global
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
	if (err instanceof Error) {
		return res.status(400).json({
			error: err.message,
		});
	}
	return res.status(500).json({
		status: "error",
		message: "Internal server error.",
	});
});

app.listen(port, () => {
	console.log(message);
});
