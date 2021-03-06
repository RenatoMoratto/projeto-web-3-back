import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { jwt_secret } from "../environment_vars.js";
import { isEmpty } from "../utils/documentoUtils.js";

export const postUser = async (req, res) => {
	const { name, email, password } = req.body;

	if (isEmpty(name)) {
		return res.status(422).send({ message: "Name is required!" });
	}
	if (isEmpty(email)) {
		return res.status(422).send({ message: "Email is required!" });
	}
	if (isEmpty(password)) {
		return res.status(422).send({ message: "Password is required!" });
	}

	try {
		const userExists = await User.findOne({ email: email });

		if (userExists) {
			return res.status(400).send({ message: "Email already in use!" });
		}

		const hashPassword = await bcrypt.hash(password, 10);
		const user = { name, email, password: hashPassword };

		await User.create(user);
		res.status(201).json({ message: "User register with success!" });
	} catch (error) {
		const errorMessage = isEmpty(error) ? "Internal server error." : error;
		res.status(500).json({ message: errorMessage });
	}
};

export const authenticateUser = async (req, res) => {
	const { email, password } = req.body;

	if (isEmpty(email)) {
		return res.status(422).send({ message: "Name is required!" });
	}
	if (isEmpty(password)) {
		return res.status(422).send({ message: "Email is required!" });
	}

	try {
		const user = await User.findOne({ email: email });

		if (!user) {
			return res.status(404).send({ message: "User not found!" });
		}

		const validatePassword = await bcrypt.compare(password, user.password);

		if (!validatePassword) {
			return res.status(401).send({ message: "Incorrect password!" });
		}

		const token = await jwt.sign({ id: user._id }, jwt_secret);

		res.status(200).send({ access_token: token });
	} catch (error) {
		const errorMessage = isEmpty(error) ? "Internal server error." : error;
		res.status(500).json({ message: errorMessage });
	}
};

export const findUserByEmail = async (req, res) => {
	try {
		const user = await User.findOne({ email: req.query.email });

		if (!user) {
			return res.status(404).send({ message: "User not found!" });
		}

		res.status(200).json({ name: user.name, id: user.id, email: user.email });
	} catch (error) {
		const errorMessage = isEmpty(error) ? "Internal server error." : error;
		res.status(500).json({ message: errorMessage });
	}
};

export const findUserById = async (req, res) => {
	const id = req.params.id;

	try {
		const user = await User.findById(id);

		if (!user) {
			res.state(422).json({ message: "User not found!" });
			return;
		}

		res.status(200).json(user);
	} catch (error) {
		const errorMessage = isEmpty(error) ? "Internal server error." : error;
		res.status(500).json({ erro: errorMessage });
	}
};
