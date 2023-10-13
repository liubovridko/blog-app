import { body } from "express-validator";

export const loginValidation = [
	body("email", "Incorrect format email").isEmail(),
	body("password", "Password must contain min 5 symbols").isLength({
		min: 5,
	}),
];

export const registerValidation = [
	body("email", "Incorrect format email").isEmail(),
	body("password", "Password must contain min 5 symbols").isLength({
		min: 5,
	}),
	body("loginName", "Need name").isLength({ min: 3 }),
	body("avatarUrl", "Wrong avatar reference").optional().isURL(),
];

export const postCreateValidation = [
	body("title", "Enter article title")
		.isLength({
			min: 3,
		})
		.isString(),
	body("text", "Enter the text of the articles")
		.isLength({
			min: 10,
		})
		.isString(),
	body("tags", "Invalid tag format (specify an array)").optional().isString(),
	body("imageUrl", "Invalid image linke").optional().isString(),
];
