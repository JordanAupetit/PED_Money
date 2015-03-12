module.exports = function (app, tool, periodModel) {
	app.get('/api/periods/', getAllPeriodss) // DEBUG ONLY
	app.get('/api/account/:accountId/period/', getAllPeriods)
	app.post('/api/period/', addPeriod)
	app.get('/api/period/:id', getPeriod)
	// app.put('/api/period/', getExpenseByTag)
	app.delete('/api/period/:id', deletePeriod)
	// app.post('/api/period/:id', editPeriod)

	// TODO Add more security on add and delete function

	function getAllPeriodss(req, resp , next) {
		'use strict';
		tool.getUserId(req, next, function(userId){
			periodModel.find(function (err, coll) {
				if (!err) {
					return resp.send(coll)
				} else {
					next(err)
				}
			})
		})
	}


	function getAllPeriods(req, resp , next) {
		'use strict';
		tool.getUserId(req, next, function(userId){
			var accountId = req.params.accountId;
			periodModel.find({'operation.accountId': accountId}, function (err, coll) {
				if (!err) {
					return resp.send(coll)
				} else {
					next(err)
				}
			})
		})
	}


	function getPeriod(req, resp , next) {
		'use strict';
		var periodId = req.params.id;

		periodModel.findOne({'_id': periodId}, function (err, coll) {
			if (!err) {
				// console.log(coll);

				if(coll !== null)
					return resp.send(coll)
				else
					resp.sendStatus(204)
			} else {
				next(err)
			}
		});

	}

	function addPeriod(req, resp, next) {
		'use strict';
		tool.getUserId(req, next, function(userId){
			var period = req.body
			delete period._id // Security
			// console.log(period)

			var newPeriod = new periodModel(period);
			newPeriod.save(function(e, results){
				if (e) return next(e)
				// console.log(results)
				resp.send(results)
			})
		})
	}

	function deletePeriod(req, resp, next) {
		'use strict';
		var periodId = req.params.id;

		periodModel.remove({_id: periodId},function (err, results) {
			if (err) return next(err)
			resp.sendStatus(204)
		})
	}


	function checkPeriodForUser(){
		
	}
}