const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {BlogPosts} = require('./models');

// Starter blog posts

BlogPosts.create(
	'Awesome Post #1', 'This is content.  Isn\'t it just the coolest thing ever?', 'N.E. Bradford');
BlogPosts.create(
	'Awesome Post #2', 'This is more content.  I think it is way cooler than the first.', 'Ramona T. Cat');

// GET request
router.get('/', (req, res) => {
	res.json(BlogPosts.get());
});

// POST request
router.post('/', jsonParser, (req, res) => {
	const requiredFields = ['title', 'content', 'author'];
	for (let i=0; i<requiredFields.length; i++) {
		const field = requiredFields[i];
		if(!(field in req.body)) {
			const message = `Missing ${field} in request body`;
			console.error(message);
			return res.status(400).send(message);
		}
	}
	const item = BlogPosts.create(req.body.title, req.body.content, req.body.author);
	res.status(201).json(item);
});

// PUT request
router.put('/:id', jsonParser, (req, res) => {
	const requiredFields = ['title', 'content', 'author'];
	for (let i=0; i<requiredFields.length; i++) {
		const field = requiredFields[i];
		if (!(field in req.body)) {
			const message = `Missing ${field} in request body`;
			console.error(message);
			return res.status(400).send(message);
		}
	}
	if (req.params.id !== req.body.id) {
		const message = (
			`Request path id ${req.params.id} and request body id ${req.body.id} must match`);
		console.error(message);
		return res.status(400).send(message);
	}
	console.log(`Updating blog post item ${req.params.id}`);
		BlogPosts.update({
			id: req.params.id,
			title: req.body.title,
			content: req.body.content,
			author: req.body.author,
	});
	res.status(204).end();
});

// DELETE request
router.delete('/:id', (req, res) => {
	BlogPosts.delete(req.params.id);
	console.log(`Deleted shopping list item ${req.params.id}`);
	res.status(204).end();
});

module.exports = router;