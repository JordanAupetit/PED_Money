var should = require('should');
var assert = require('assert')
var request = require('supertest');
var mongoose = require('mongoose');
var app  = require('../server.js');


describe('Period::API', function() {
	// var url = 'http://localhost:8754/api/period'
	var url = '/api/period'

	// describe('get', function() {

	var fakeOperation = {
		value: 300,
		thirdParty: 'M Bougnard',
		description: 'Loyer',
		typeOpt: 'Virement',
		checked: false,
		dateOperation: '2015-01-20',
		datePrelevement: '2015-01-25',
		categoryId: '54684654dqs',
		accountId: 'sddqs1123sqd'
	}

	var fakePeriod = {
		name: 'Loyer 2015',
		dateBegin: '2015-01-15T00:00:00.000Z',
		nbRepeat: -1,
		step: 3,
		intervalType: 'M',
		isOver: false,
		opCreat: [],
		operation : fakeOperation
	}

	

	var fakeOperation2 = {
		_id: '2132sdq0sq',
		value: -50,
		thirdParty: 'Auchan',
		description: 'Règlement des courses',
		type: 'Chèque',
		checked: false,
		dateOperation: '2015-01-20',
		datePrelevement: '2015-01-25',
		categoryId: '54684654dqs',
		subOperations: [],
		accountId: 'sddqs1123sqd'
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


	it('should add Period', function() {

		// console.log(fakePeriod)

		request(app)
			.post(url)
			.expect(200)
			.send(fakePeriod)
			.end(function(err, res) {
				if (err) {
					throw err;
				}
				// console.log(res.body)

				res.body.should.have.property('_id')
				var fp = clone(fakePeriod)
				fp.__v = 0
				fp._id = res.body._id
					// res.body.should.have.property('name').and.equal(fakePeriod.name)
				res.body.should.be.eql(fp)

				// res.body.length.should.be.above(0)
				// console.log(res.should.have.status)
				// res.should.have.status(200);
				// done();
			})
	})


	describe('with period in DBB', function() {

		var idPeriod

		/**
		 * Add a period to work with
		 */
		beforeEach(function(end) {
			request(app)
				.post(url)
				.expect(200)
				.send(fakePeriod)
				.end(function(err, res) {
					if (err) {
						throw err;
					}
					idPeriod = res.body._id

					end()
				})
		})

		it('should get specific Period', function() {

			request(app)
				.get(url+'/' + idPeriod)
				.expect(200)
				.end(function(err, res) {
					if (err) {
						throw err;
					}

					res.body.should.have.property('_id')
					var fp = clone(fakePeriod)
					fp.__v = 0
					fp._id = res.body._id
					res.body.should.be.eql(fp)
				})

		})

		it('should get all Period (at least the one added)', function() {
			request(app)
				.get(url)
				.expect(200)
				.end(function(err, res) {
					if (err) {
						throw err;
					}
					res.body.length.should.be.above(0)
				})
		})

		it('should delete specific Period', function() {
			request(app)
				.delete(url +'/' + idPeriod)
				.expect(204)
				.end(function(err, res) {
					if (err) {
						throw err;
					}

					request(url)
						.get('/' + idPeriod)
						.expect(204)
						.end(function(err, res) {
							if (err) {
								throw err;
							}
						})
				})
		})



	})


	it.skip('should not be empty', function() {
			request(app)
				.get(url)
				.expect(200)
				.end(function(err, res) {
					if (err) {
						throw err;
					}
					// console.log(res.body)
					res.status.should.be.equal(200)

					res.body.length.should.be.above(0)
						// console.log(res.should.have.status)
						// res.should.have.status(200);
						// done();
				})
		})
		// })
})