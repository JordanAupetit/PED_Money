var blanket = require("blanket")({
   /* options are passed as an argument object to the require statement */
   "pattern": "server"
   });

var should = require('should');
var assert = require('assert')
var request = require('supertest');
var mongoose = require('mongoose');
var server  = require('../server.js');
var app  = server.app;


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

				request(app)
					.post(urlAccount)
					.set('X-User-Token', fakeUser.token)
					.expect(200)
					.send(fakeAccount)
					.end(function(err, res) {
						if (err) {
							throw err;
						}
						fakeAccount._id = res.body._id

						end()
					})
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

	describe('Budget', function() {
		var url = '/api/budget/'
		var urlAcc = '/api/account/'
		var urlExpense = '/api/expense/'
		var urlOperation = '/api/operation/'
		var fakeAccountId
		var fakeToken

		var fakeOperation = {
			value: -300,
			thirdParty: 'M Bougnard',
			description: 'Loyer',
			// typeOpt: 'Virement',
			checked: false,
			dateOperation: '2015-01-20T00:00:00.000Z',
			datePrelevement: '2015-01-15T00:00:00.000Z',
			categoryId: 103
		}


		var fakeOperation2 = {
			_id: '2132sdq0sq',
			value: -50,
			thirdParty: 'Auchan',
			description: 'Règlement des courses',
			type: 'Chèque',
			checked: false,
			dateOperation: '2015-01-20T00:00:00.000Z',
			datePrelevement: '2015-01-15T00:00:00.000Z',
			categoryId: '54684654dqs',
			subOperations: []
		}


		// var defaultBudget = server.database.getDefaultBudget()


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
			fakeAccountId = fakeAccount._id
			fakeToken = fakeUser.token


			fakeOperation.accountId = fakeAccountId
			fakeOperation2.accountId = fakeAccountId

			// console.log(fakeAccountId)
			// console.log(fakeToken)

			end()
		})


		it('should get', function(end) {

			request(app)
				.get(url)
				.set('X-User-Token', fakeToken)
				.expect(200)
				.end(function(err, res) {
					if (err) {
						throw err;
					}
					// console.log(res.body)	

					var fbudget = server.database.getDefaultBudget()
					res.body.should.be.eql(fbudget)

					end()
				})
		})

		it('should set groupcat', function(end) {
			var budgetValue = 785
			var budgetId = 300

			request(app)
				.put(url+budgetId+'/'+budgetValue)
				.set('X-User-Token', fakeToken)
				.expect(200)
				.end(function(err, res) {
					if (err) {
						throw err;
					}
					// console.log(res.body)	

					request(app)
						.get(url)
						.set('X-User-Token', fakeToken)
						.expect(200)
						.end(function(err, res) {
							if (err) {
								throw err;
							}
							// console.log(res.body)	

							

							var fbudget = server.database.getDefaultBudget()
							fbudget[2].spread[12].value = budgetValue
							res.body.should.be.eql(fbudget)

							end()
						})
				})
		})

		it('should set subcat', function(end) {
			var budgetValue = 76
			var budgetId = 202

			request(app)
				.put(url+budgetId+'/'+budgetValue)
				.set('X-User-Token', fakeToken)
				.expect(200)
				.end(function(err, res) {
					if (err) {
						throw err;
					}
					// console.log(res.body)	

					request(app)
						.get(url)
						.set('X-User-Token', fakeToken)
						.expect(200)
						.end(function(err, res) {
							if (err) {
								throw err;
							}
							// console.log(res.body)	

							

							var fbudget = server.database.getDefaultBudget()
							fbudget[1].subCategories[1].spread[12].value = budgetValue
							res.body.should.be.eql(fbudget)

							end()
						})
				})
		})

		it('should get expenses of specific month', function(end) {
			var year = 2015
			var month = 1

			request(app)
				.get(urlExpense+year+'/'+month)
				.set('X-User-Token', fakeToken)
				.expect(200)
				.end(function(err, res) {
					if (err) {
						throw err;
					}

					res.body.should.be.empty

					end()
				})
		})

		it('should get total expense by month', function(end) {

			request(app)
				.get(url+'month')
				.set('X-User-Token', fakeToken)
				.expect(200)
				.end(function(err, res) {
					if (err) {
						throw err;
					}

					res.body.should.be.empty

					end()
				})
		})

		it('should get all expenses of user', function(end) {

			request(app)
				.get(urlExpense)
				.set('X-User-Token', fakeToken)
				.expect(200)
				.end(function(err, res) {
					if (err) {
						throw err;
					}

					res.body.should.be.empty

					end()
				})
		})


		describe('with operations', function() {

			var idOperation

			/**
			 * Add a operation
			 */
			beforeEach(function(end) {
				request(app)
					.post(urlOperation)
					.set('X-User-Token', fakeToken)
					.expect(200)
					.send(fakeOperation)
					.end(function(err, res) {
						if (err) {
							throw err;
						}
						idOperation = res.body._id

						end()
					})
			})

			it('should get expenses of specific month', function(end) {
				var year = 2015
				var month = 1

				request(app)
					.get(urlExpense+year+'/'+month)
					.set('X-User-Token', fakeToken)
					.expect(200)
					.end(function(err, res) {
						if (err) {
							throw err;
						}

						// console.log(res.body)
						var fopt = clone(fakeOperation)
						fopt.__v = 0
						fopt._id = res.body[0]._id
						fopt.subOperations = []
						res.body.should.be.eql([fopt])

						end()
					})
			})


			it('should get total expense by month', function(end) {

				request(app)
					.get(url+'month')
					.set('X-User-Token', fakeToken)
					.expect(200)
					.end(function(err, res) {
						if (err) {
							throw err;
						}

						// console.log(res.body)	
						var fakeTotal =  [ 
							{ 
								_id: { 
									month: 1, 
									year: 2015 
								}, 
								count: 1, 
								total: -300 
							} 
						]
						res.body.should.be.eql(fakeTotal)

						end()
					})
			})

		})

	})

})