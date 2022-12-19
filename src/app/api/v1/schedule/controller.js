/**
 Provide Api for schedule

  GET /api/v1/schedule

    Controller for subscribers to support the /schedule API.


**/


'use strict'

const Observable = require('rxjs/Observable').Observable;
const loggingService = require('../shared/services/logging'),
        loggingModel = require('../shared/models/logging'),
        tracker = require('../shared/middleware/tracker'),
        schedule = require('./model.js'),
        workout = require('../shared/models/workout');

let scheduleController = {};

scheduleController.get = (req, res, next) =>{
    console.log('USER TRACKING CLIENT CALLS /api/v1/schedules');
    let account = {};                    
    schedule.getList$()
                .subscribe(
                    (value) => {                    
                        account = Object.assign(value, account);                            
                    },
                    (error) => {                       
                        let logEntry = "schedule Subscriber Error Message: ";                    
                        let msg = { message: logEntry + error };
                        loggingModel.logWithLabel(logEntry, msg, tracker.requestID, "ERROR");
                        res.status(500);
                        res.json(msg);
                    },
                    () => {                       
                        res.status(200);                        
                        res.json(account);
                    }
                );
};

scheduleController.getById = (req, res, next) =>{
    let account = {};
    console.log('USER TRACKING CLIENT CALLS /api/v1/schedule ');
    let id = schedule.getWeekId(req.query.d);  
    schedule.getListById$(id)
                .subscribe(
                    (value) => {              
                        account = Object.assign(value, account);
                    },
                    (error) => {                       
                        let logEntry = "schedule by id Subscriber Error Message: ";
                        let msg = { message: logEntry + error };
                        loggingModel.logWithLabel(logEntry, msg, tracker.requestID, "ERROR");
                        res.status(500);
                        res.json(msg);
                    },
                    () => {                       
                        res.status(200);                        
                        res.json(account);
                    }
                );
};

scheduleController.getByUserPreference = (req, res, next) =>{
    console.log('USER TRACKING CLIENT BY USER PREFERENCE CALLS /api/v1/schedule');
    let account = {};                    
    workout.getSchedule$(req,res)
                .subscribe(
                    (value) => {                                          
                        account = Object.assign(value, account);                            
                    },
                    (error) => {                       
                        let logEntry = "schedule Subscriber Error Message: ";                    
                        let msg = { message: logEntry + error };
                        loggingModel.logWithLabel(logEntry, msg, tracker.requestID, "ERROR");
                        res.status(500);
                        res.json(msg);
                    },
                    () => {                       
                        res.status(200);                        
                        res.json(account);
                    }
                );
};

module.exports = scheduleController;
