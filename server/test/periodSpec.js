var should = require('should');
var assert = require('assert')
var request = require('supertest');
var mongoose = require('mongoose');


describe('Period::API', function() {
	var url = 'http://localhost:8754/api/period'

	// describe('get', function() {

	var fakePeriod = {
		'name': 'Loyer',
		'dateBegin': '2015-01-15T00:00:00.000Z',
		'nbRepeat': -1,
		'step': 3,
		'intervalType': 'M',
		'amount': 300,
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

		request(url)
			.post('')
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
			request(url)
				.post('')
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

			request(url)
				.get('/' + idPeriod)
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
			request(url)
				.get('')
				.expect(200)
				.end(function(err, res) {
					if (err) {
						throw err;
					}
					res.body.length.should.be.above(0)
				})
		})

		it('should delete specific Period', function() {
			request(url)
				.delete('/'+idPeriod)
				.expect(204)
				.end(function(err, res) {
					if (err) {
						throw err;
					}

					request(url)
						.get('/'+idPeriod)
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
			request(url)
				.get('')
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