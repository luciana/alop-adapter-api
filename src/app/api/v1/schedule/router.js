/**
 * Feature API Router
 *
 *
 *
 */

'use strict'

var router = require('express').Router();
const Observable = require('rxjs/Observable').Observable;
const schedule = require('./controller'),
	 tracker = require('../shared/middleware/tracker');


router.use((req, res, next) => {
    // access the req.params object
    // make auth checks
    // do logging
    next();
});

router.get('/schedules', tracker.trackSession, schedule.get);
router.get('/scheduleA', tracker.trackSession, schedule.getById);
router.get('/schedule', tracker.trackSession, schedule.getByUserPreference);

module.exports = router;