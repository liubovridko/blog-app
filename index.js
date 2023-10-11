import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { validationResult } from "express-validator";

import bcrypt from "bcrypt";

import { registerValidation } from "./validations/auth.js";
import UserModel from "./models/User.js";

mongoose
	.connect(
		"mongodb+srv://lu4ichka:wwwwww@cluster0.wvfqjep.mongodb.net/?retryWrites=true&w=majority",
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

app.post("/auth/register", registerValidation, async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json(errors.array());
	}
	const password = req.body.password;
	const salt = await bcrypt.genSalt(10);
	const passwordHash = await bcrypt.hash(password, salt);

	const doc = new UserModel({
		email: req.body.email,
		loginName: req.body.loginName,
		passwordHash,
		avatarUrl: req.body.avatarUrl,
	});

	const user = await doc.save();
	res.json(user);
});

app.listen(4444, (err) => {
	if (err) {
		console.log(err);
	}

	console.log("Server ok");
});
