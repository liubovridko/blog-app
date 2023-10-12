import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { validationResult } from "express-validator";

import bcrypt from "bcrypt";

import { registerValidation } from "./validations/auth.js";
import UserModel from "./models/User.js";

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

app.post("/auth/login", async (req, res) => {
	try {
		const user = await UserModel.findOne({ email: req.body.email });
		if (!user) {
			return req.status(404).json({
				message: "Not correct login",
			});
		}
		const isValidPass = await bcrypt.compare(
			req.body.password,
			user._doc.passwordHash,
		);
		if (!isValidPass) {
			return req.status(404).json({
				message: "incorrect login or password",
			});
		}
		const token = jwt.sign(
			{
				_id: user._id,
			},
			"secret123",
			{
				expiresIn: "30d",
			},
		);
		const { passwordHash, userData } = user._doc;
		res.json({ ...userData, token });
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: "Failed to login",
		});
	}
});
app.post("/auth/register", registerValidation, async (req, res) => {
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json(errors.array());
		}
		const password = req.body.password;
		const salt = await bcrypt.genSalt(10);
		const hash = await bcrypt.hash(password, salt);

		const doc = new UserModel({
			email: req.body.email,
			loginName: req.body.loginName,
			passwordHash: hash,
			avatarUrl: req.body.avatarUrl,
		});

		const user = await doc.save();
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: "Failed to register",
		});
	}
});

app.listen(4444, (err) => {
	if (err) {
		console.log(err);
	}

	console.log("Server ok");
});
