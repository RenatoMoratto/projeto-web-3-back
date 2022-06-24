const quoteRouter = require("express").Router();
const Quote = require("../models/Quote");

quoteRouter.post("/quote", async (req, res) => {
	const { author, en } = req.body;

	const quote = { author, en };

	try {
		await Quote.create(quote);
		res.status(201).json({ message: "Quote register with success!" });
	} catch (error) {
		res.status(500).json({ erro: error });
	}
});

quoteRouter.get("/quotes", async (req, res) => {
	try {
		const quotes = await Quote.find();
		res.status(201).json(quotes);
	} catch (error) {
		res.status(500).json({ erro: error });
	}
});

quoteRouter.get("/quote/:id", async (req, res) => {
	const id = req.params.id;

	try {
		const quote = await Quote.findOne({ _id: id });

		if (!quote) {
			res.state(422).json({ message: "Quote not found!" });
			return;
		}

		res.status(200).json(quote);
	} catch (error) {
		res.status(500).json({ erro: error });
	}
});

quoteRouter.get("/quotes/random", async (req, res) => {
	try {
		const quotes = await Quote.find();

		const randomIndex = Math.floor(Math.random() * quotes.length);
		const randomQuote = quotes[randomIndex];

		if (!quotes) {
			res.state(422).json({ message: "Quotes not found!" });
			return;
		}

		res.status(200).json(randomQuote);
	} catch (error) {
		res.status(500).json({ erro: error });
	}
});

module.exports = quoteRouter;