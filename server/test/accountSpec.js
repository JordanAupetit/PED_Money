var blanket = require("blanket")({
   /* options are passed as an argument object to the require statement */
   "pattern": "server"
   });

var should = require('should');
var assert = require('assert')
var request = require('supertest');
var mongoose = require('mongoose');
var app  = require('../server.js');


describe('Server::API', function() {

	var urlUser = '/api/user'
	var urlAccount = '/api/account'

	var fakeUser = {
		username: 'testUser',
		lastName: 'Bay',
		firstName: 'Michael',
		email: 'miky@bay.mb',
		password: 'explosion'
	}

	var fakeAccount = {
		name: 'testAccount',
		type: 1,
		currency: 'EUR'
	}

	beforeEach(function(end) { // Add the fake user and account
		request(app)
			.post(urlUser)
			.expect(200)
			.send(fakeUser)
			.end(function(err, res) {
				if (err) {
					throw err;
				}

				fakeUser._id = res.body.data._id
				fakeUser.token = res.body.data.token

				end()

				// request(app)
				// 	.post(urlAccount)
				// 	.set('X-User-Token', fakeUser.token)
				// 	.expect(200)
				// 	.send(fakeAccount)
				// 	.end(function(err, res) {
				// 		if (err) {
				// 			throw err;
				// 		}
				// 		fakeAccount._id = res.body._id

				// 		end()
				// 	})
			})
	})

	afterEach(function(end) { // Delete the fake user
		request(app)
			.delete(urlUser)
			.set('X-User-Token', fakeUser.token)
			.expect(204)
			.end(function(err, res) {
				if (err) {
					throw err;
				}
				fakeUser._id = undefined
				fakeUser.token = undefined
				fakeAccount._id = undefined
				end()
			})
	})

	describe('Account', function() {
		var url = '/api/account/'
		// var fakeAccountId
		var fakeToken


		var defaultAlerts = [
			{
				level: 0,
				message: 'Your balance is under 0 !',
				_id: undefined
			}
		]

		var fakeAccountRes = {
			__v: 0,
			_id: undefined,
			name: 'testAccount',
			type: 1,
			currency: 'EUR',
			operations : [],
			userId: undefined,
			alerts : defaultAlerts
		}


		function clone(obj) {
			var target = {};
			for (var i in obj) {
				if (obj.hasOwnProperty(i)) {
					target[i] = obj[i];
				}
			}
			return target;
		}

		beforeEach(function(end) {
			// fakeAccountId = fakeAccount._id
			fakeToken = fakeUser.token

			end()
		})


		it('should add', function() {


			request(app)
				.post(url)
				.set('X-User-Token', fakeToken)
				.expect(200)
				.send(fakeAccount)
				.end(function(err, res) {
					if (err) {
						throw err;
					}

					res.body.should.have.property('_id')
					var fp = clone(fakeAccount)
					fp.__v = 0
					fp._id = res.body._id
					fp.userId = fakeUser._id
					fp.alerts = defaultAlerts
					fp.alerts[0]._id = res.body.alerts[0]._id
					res.body.should.be.eql(fp)
				})
		})


		describe('with account in DBB', function() {

			var idAccount

			/**
			 * Add a account to work with
			 */
			beforeEach(function(end) {
				request(app)
					.post(url)
					.set('X-User-Token', fakeToken)
					.expect(200)
					.send(fakeAccount)
					.end(function(err, res) {
						if (err) {
							throw err;
						}
						idAccount = res.body._id

						end()
					})
			})

			it('should get specific', function(end) {

				request(app)
					.get(url+ idAccount)
					.set('X-User-Token', fakeToken)
					.expect(200)
					.end(function(err, res) {
						if (err) {
							throw err;
						}

						res.body.should.have.property('_id')
						var fp = clone(fakeAccountRes)
						fp._id = res.body._id
						fp.userId = fakeUser._id
						res.body.should.be.eql(fp)
						end()
					})

			})

			it('should get all (at least the one added)', function() {
				request(app)
					.get(url)
					.set('X-User-Token', fakeToken)
					.expect(200)
					.end(function(err, res) {
						if (err) {
							throw err;
						}
						res.body.length.should.be.above(0)
					})
			})

			it('should delete specific', function() {
				request(app)
					.delete(url + idAccount)
					.set('X-User-Token', fakeToken)
					.expect(204)
					.end(function(err, res) {
						if (err) {
							throw err;
						}

						request(app)
							.get(url + idAccount)
							.set('X-User-Token', fakeToken)
							.expect(204)
							.end(function(err, res) {
								if (err) {
									throw err;
								}
							})
					})
			})



		// })


		// it.skip('should not be empty', function() {
		// 		request(app)
		// 			.get(url)
		// 			.expect(200)
		// 			.end(function(err, res) {
		// 				if (err) {
		// 					throw err;
		// 				}
		// 				// console.log(res.body)
		// 				res.status.should.be.equal(200)

		// 				res.body.length.should.be.above(0)
		// 					// console.log(res.should.have.status)
		// 					// res.should.have.status(200);
		// 					// done();
		// 			})
			})
	})

})