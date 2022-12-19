/**
 Provide Api for Home

  GET /api/v1/home

    Controller for subscribers to support the /home API.


**/


'use strict'

const Observable = require('rxjs/Observable').Observable;

const loggingService = require('../shared/services/logging'),
        loggingModel = require('../shared/models/logging'),
        tracker = require('../shared/middleware/tracker'),
        user = require('../shared/models/user'),
        home = require('./model.js');
       // abService = require('../shared/services/abTest');

let homeController = {};

// AB test completed - B won
//  homeController.getA = (req, res, next) =>{
//    abService.set_schedule_test("ALL_SCHEDULES_TEST_A");
//    homeController.get(req, res, next);
// };

homeController.get = (req, res, next) =>{
   // abService.set_schedule_test("ALL_SCHEDULES_TEST_B");
    homeController.get(req, res, next);
 };

homeController.get = (req, res, next) =>{
    console.log('USER TRACKING CLIENT CALLS /api/v1/home');
    let account = {};
    const validate$ = user.validateToken$(req, res);

    const defaultAccount$ = validate$                                
                            .filter(value => !value)                                
                            .switchMap(()=>  home.defaultAccount$());
                    
    const homeAccount$ = validate$                 
                        .filter(value => value)                       
                        .switchMap(()=>  home.getAccount$(req, res));

    Observable.merge(defaultAccount$,homeAccount$)
                .subscribe(
                    (value) => {
                        try{
                            account = Object.assign(value, account);
                        }catch(error){                            
                            let logEntry = "Home Subscriber Value Error Message: ";
                            let msg = { message: logEntry + error };
                            loggingModel.logWithLabel(logEntry, msg, tracker.requestID, "ERROR");
                            res.status(500);
                            res.json(msg);
                        }                        
                    },
                    (error) => {                
                    console.log("ERR111", error);       
                        let logEntry = "Home Subscriber Error Message: ";
                        let status = 500;
                        if(error.statusCode && error.statusCode === 401){
                            status = 401;
                            logEntry = "Unauthorized access - 401 for Token Validation";
                        }                        
                        let msg = { message: logEntry + error };
                        loggingModel.logWithLabel(logEntry, msg, tracker.requestID, "ERROR");
                        res.status(status);
                        res.json(msg);
                    },
                    () => {                                       
                        res.status(200);
                        res.json(account);
                    }
                );
};

module.exports = homeController;