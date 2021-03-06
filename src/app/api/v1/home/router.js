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
    tracker = require('../shared/middleware/tracker');

router.use((req, res, next) => {
    // access the req.params object
    // make auth checks
    // do logging
    next();
});

router.get('/home', tracker.trackSession, home.get);


module.exports = router;