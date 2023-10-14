import express from "express";
import mongoose from "mongoose";

import {
	registerValidation,
	loginValidation,
	postCreateValidation,
} from "./validations/validations.js";
import checkAuth from "./utils/checkAuth.js";

import * as UserController from "./controllers/UserController.js";
import * as PostController from "./controllers/PostController.js";

mongoose
	.connect(
		"mongodb+srv://lu4ichka:wwwwww@cluster0.wvfqjep.mongodb.net/blog?retryWrites=true&w=majority",
	)
	.then(() => {
		console.log("Connect DB OK");
	})
	.catch((error) => {
		console.log("Connect DB error", error);
	});

const app = express();

app.use(express.json());
app.get("/", (req, res) => {
	res.send("Hello World");
});

app.post("/auth/login", loginValidation, UserController.login);
app.post("/auth/register", registerValidation, UserController.register);
app.get("/auth/me", checkAuth, UserController.getMe);

app.get("/posts", PostController.getAll);
app.get("/posts/:id", PostController.getOne);
app.post("/posts", checkAuth, postCreateValidation, PostController.create);
app.delete("/posts/:id", PostController.remove);
//app.patch("/posts", PostController.update);

app.listen(4444, (err) => {
	if (err) {
		console.log(err);
	}

	console.log("Server ok");
});
