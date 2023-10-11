import { body } from "express-validator";

export const registerValidation = [
	body("email", "Incorrect format email").isEmail(),
	body("password", "Password must contain min 5 symbols").isLength({
		min: 5,
	}),
	body("loginName", "Need name").isLength({ min: 3 }),
	body("avatarUrl", "Wrong avatar reference").optional().isURL(),
];
