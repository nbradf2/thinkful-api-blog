const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../server');

const should = chai.should();

chai.use(chaiHttp);

describe('Blog Posts', function() {
	before(function() {
		return runServer();
	});

	after(function() {
		return closeServer();
	});

	// test strategy:
	// Make GET request to /blog-posts, inspect response and prove has right code and keys
	it('should list items on GET', function() {
		return chai.request(app)
		.get('/blog-posts')
		.then(function(res) {
			res.should.have.status(200);
			res.should.be.json;
			res.body.should.be.a('array');
			res.body.length.should.be.at.least(1);

			const expectedKeys = ['id', 'title', 'content', 'author', 'publishDate'];
			res.body.forEach(function(item) {
				item.should.be.a('object');
				item.should.include.keys(expectedKeys);
			});
		});
	});

	// test strategy:
	// make POST request with data for new item, inspect response and prove has right status code and returned object has 'id'
	it('should add an item on POST', function() {
		const newItem = {title: 'Name of Blog Post', content: 'content goes here', author: 'My N. Ame'};
		const expectedKeys = ['id', 'publishDate'].concat(Object.keys(newItem));
		return chai.request(app)
			.post('/blog-posts')
			.send(newItem)
			.then(function(res) {
				res.should.have.status(201);
				res.should.be.json;
				res.body.should.be.a('object');
				res.body.should.include.keys(expectedKeys);
				res.body.id.should.not.be.null;
				res.body.title.should.equal(newItem.title);
				res.body.content.should.equal(newItem.content);
				res.body.author.should.equal(newItem.author)
			});
	});

	// test strategy:
	// make GET request to get item to update
	// add 'id' to 'updateData'
	// make PUT request with 'updateData', inspect response to ensure has right status code and get back updated item
	it('should update items on PUT', function() {
		
		return chai.request(app)
			.get('/blog-posts')
			.then(function(res) {
				const updatedPost = Object.assign(res.body[0], {
					title: 'New Blog Post Title',
					content: 'New content'
				});
				return chai.request(app)
					.put(`/blog-posts/${res.body[0].id}`)
					.send(updatedPost)
					.then(function(res) {
						res.should.have.status(204);					
					});
			});
	});
	
	// test strategy:
	// make GET request to get item to delete
	// DELETE item and make sure get 204 status back
	it('should delete item on DELETE', function() {
		return chai.request(app)
			.get('/blog-posts')
			.then(function(res) {
				return chai.request(app)
					.delete(`/blog-posts/${res.body[0].id}`);
			})
			.then(function(res) {
				res.should.have.status(204);
			});
	});
});