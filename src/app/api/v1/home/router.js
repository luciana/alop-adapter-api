/**
 Provide Api for Home

  GET /api/v1/home
  
  @header
         Authorization: Bearer {token}
  @optionalQueryParameters
         param1 {String} - description

 Possible HttpStatusCode
    500 - server error
    401 - invalid token
    200 - successfull request


**/

'use strict'

const router = require('express').Router(),
    home = require('./controller'),
    tracker = require('../shared/middleware/tracker')
   // ab = require('../shared/middleware/ab'); //this is a framework for AB test


router.use((req, res, next) => {
    // access the req.params object
    // make auth checks
    // do logging
    next();
});

//const homeAB = ab();

//router.get('/home', homeAB('ALL_SCHEDULES_TEST_A'), tracker.trackSession, home.getA);
router.get('/home', tracker.trackSession, home.get);

module.exports = router;