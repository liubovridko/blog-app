import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import cors from "cors";

import {
	registerValidation,
	loginValidation,
	postCreateValidation,
} from "./validations/validations.js";
import { checkAuth, handleValidationErrors } from "./utils/index.js";

import { UserController, PostController } from "./controllers/index.js";

const username = encodeURIComponent("username");
const password = encodeURIComponent("password");

mongoose
	.connect(
		`mongodb+srv://${username}:${password}@cluster0.wvfqjep.mongodb.net/blog?retryWrites=true&w=majority`,
	)
	.then(() => {
		console.log("Connect DB OK");
	})
	.catch((error) => {
		console.log("Connect DB error", error);
	});

const app = express();

const storage = multer.diskStorage({
	destination: (_, __, cb) => {
		cb(null, "uploads");
	},
	filename: (_, file, cb) => {
		cb(null, file.originalname);
	},
});

const upload = multer({ storage });

app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));

/*app.get("/", (req, res) => {
	res.send("Hello World");
});*/

app.post(
	"/auth/login",
	loginValidation,
	handleValidationErrors,
	UserController.login,
);
app.post(
	"/auth/register",
	registerValidation,
	handleValidationErrors,
	UserController.register,
);
app.get("/auth/me", checkAuth, UserController.getMe);

app.post("/upload", checkAuth, upload.single("image"), (req, res) => {
	res.json({
		url: `/uploads/${req.file.originalname}`,
	});
});

app.get("/posts", PostController.getAll);
app.get("/tags", PostController.getLastTags);
app.get("/posts/tags", PostController.getLastTags);
app.get("/posts/:id", PostController.getOne);
app.post(
	"/posts",
	checkAuth,
	postCreateValidation,
	handleValidationErrors,
	PostController.create,
);
app.delete("/posts/:id", checkAuth, PostController.remove);
app.patch(
	"/posts/:id",
	checkAuth,
	postCreateValidation,
	handleValidationErrors,
	PostController.update,
);

app.listen(4444, (err) => {
	if (err) {
		console.log(err);
	}

	console.log("Server ok");
});
