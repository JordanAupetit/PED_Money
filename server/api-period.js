module.exports = function (app, periodModel) {
	app.get('/api/period/', getAllPeriods)
	app.post('/api/period/', addPeriod)
	app.get('/api/period/:id', getPeriod)
	// app.put('/api/period/', getExpenseByTag)
	app.delete('/api/period/:id', deletePeriod)
	// app.post('/api/period/:id', editPeriod)


	function getAllPeriods(req, resp , next) {
		'use strict';
		// var userId = req.get('X-User-Id');

		periodModel.find(/*{user: userId},*/ function (err, coll) {
			if (!err) {
				return resp.send(coll)
			} else {
				console.log(err)
				next(err)
			}
		});
	}


	function getPeriod(req, resp , next) {
		'use strict';
		// var userId = req.get('X-User-Id');
		var periodId = req.params.id;

		periodModel.findOne({'_id': periodId}, function (err, coll) {
			if (!err) {
				// console.log(coll);

				if(coll !== null)
					return resp.send(coll)
				else
					resp.sendStatus(204)
			} else {
				console.log(err)
				next(err)
			}
		});

	}

	function addPeriod(req, resp, next) {
		'use strict';
		// var userId = req.get('X-User-Id');
		var period = req.body
		delete period._id // Security
		// console.log(period)
		var newPeriod = new periodModel(period);
		newPeriod.save(function(e, results){
			if (e) return next(e)
			// console.log(results)
			resp.send(results)
		})
	}

	function deletePeriod(req, resp, next) {
		'use strict';
		// var userId = req.get('X-User-Id');
		var periodId = req.params.id;

		periodModel.remove({_id: periodId},function (err, results) {
			if (err) return next(err)
			resp.sendStatus(204)
		})
	}


	function checkPeriodForUser(){
		
	}
}