/**
 Provide Api for Home

  GET /api/v1/home
  @header
         Authorization: Bearer {token}
  @optionalQueryParameters
         param1 {String} - description

 Possible HttpStatusCode
    500 - server error
    200 - successfull request


**/


'use strict'

var Observable = require('rxjs/Observable').Observable,
    client = require('../models/client');

require('rxjs/add/observable/of');
require('rxjs/add/operator/map');
require('rxjs/add/observable/forkJoin');
require('rxjs/add/operator/mergeMap');
require('rxjs/add/operator/concatMap');
require('rxjs/add/observable/from');
require('rxjs/add/observable/concat');
require('rxjs/add/operator/catch');
require('rxjs/operator/do');
require('rxjs/Rx');
const userService = require('../services/user');
const userMapping = require('../mappings/user');
const workoutService = require('../services/workout');
const workoutMapping = require('../mappings/workout');
const trackingService = require('../services/tracking');
const activityMapping = require('../mappings/activity');
const meditationService = require('../services/meditation');
const meditationMapping = require('../mappings/meditation');
const favoriteService = require('../services/favorite');
const favoriteMapping = require('../mappings/favorite');
const loggingService = require('../services/logging');
const loggingModel = require('../models/logging');

const REDIS_CACHE_TIME = 100;

const REDIS_HOME_CACHE = "alop-adapter-home";
const REDIS_FAV_CACHE = "alop-adapter-favorites";
const REDIS_USER_CACHE = "alop-adapter-user";
const REDIS_WORKOUT_CACHE = "alop-adapter-workout";
const REDIS_ACTIVITY_CACHE = "alop-adapter-activity";
const REDIS_MEDITATION_CACHE = "alop-adapter-meditation";

let home = {};

home.validate = (req, res, next) => {
    //Destructing variables from the header
    //because user-agent has a hyphen it needs to be converted to a new name to get destructured
    const { "user-agent": userAgent, authorization } = req.headers;

    try{       
        let request_id = authorization.slice(-10);
        next(); //call the next middleware - in this case getHomeData
    }catch(error){
        let logEntry = "Invalid /home api request. Verify that you have a valid authentication token.";
        let msg = { message: logEntry };
        loggingModel.logWithLabel(logEntry, error, "unknown", "ERROR");
        res.status(401);
        res.json(msg);
    }
};


home.getHomeData = (req, res, next) => {
        let account = {};
        home.getAccount$(req, res)
        .subscribe(
            (value) => {
                try{    
                    account = Object.assign(value, account);
                }catch(error){
                    let logEntry = "Home Subscriber Value Error Message: ";
                    let msg = { message: logEntry + error };
                    loggingModel.logWithLabel(logEntry, msg, "123", "ERROR");
                    res.status(500);
                    res.json(msg);
                }
            },
            (error) => {
                let logEntry = "Home Subscriber Error Message: ";
                let msg = { message: logEntry + error };
                loggingModel.logWithLabel(logEntry, msg, "123", "ERROR");
                res.status(500);
                res.json(msg);
            },
            () => {
                client.setex(REDIS_HOME_CACHE, REDIS_CACHE_TIME, JSON.stringify(account));
                res.status(200);
                res.json(account);
            }
        );
    };

home.getAccount$ = (req, res) => {
 
    	const u$ = userService.get(req.headers)  
                .catch((error) => {
                    if (error.statusCode === 401){
                        loggingModel.logWithLabel("User Service API 401 Return user default", error, "123" , "ERROR");
                        return Observable.of(userMapping.getDefault());
                    }else{
                         loggingModel.logWithLabel("User Service API Return from cache ", error, "123" , "ERROR");
                        return client.getCachedDataFor$(REDIS_USER_CACHE);
                    }
                })
                .do((data) => {           
                    client.setex(REDIS_USER_CACHE, REDIS_CACHE_TIME, JSON.stringify(data));
                })                   
                .map((data) => userMapping.transform(data))
                .catch((error) => {                   
                    loggingModel.logWithLabel("User Data Transform - Return user default", error, "123", "ERROR");
                    return Observable.of(userMapping.getDefault());
                });

        const wl$ = Observable.of({
                     workout_label: "Classes selected for you today: "                     
                });
        const b$ = Observable.of({
                     banner_image: "https://s3.amazonaws.com/s3-us-alop-images/men-abs.jpg"                    
                });

        const w$ = workoutService.get(req.headers)
                  .catch((error) => {                                                      
                        loggingModel.logWithLabel("Workout Service API", error, "123" , "ERROR");                                         
                        return client.getCachedDataFor$(REDIS_WORKOUT_CACHE);                       
                })                
                .do((data) => {                           
                    client.setex(REDIS_WORKOUT_CACHE, REDIS_CACHE_TIME, JSON.stringify(data));                   
                })         
                .map((data) => workoutMapping.transform(data))
                .catch((error) => {                   
                    loggingModel.logWithLabel("Workout Data Transform - Return workout default", error, "123", "ERROR");
                    return Observable.of(workoutMapping.getDefault());
                });

        const a$ = trackingService.get(req.headers)
                .catch((error) => {                   
                    loggingModel.logWithLabel("Activity Service API", error, "123" , "ERROR");
                    return client.getCachedDataFor$(REDIS_ACTIVITY_CACHE);                    
                })                
                .do((data) => {                           
                    client.setex(REDIS_ACTIVITY_CACHE, REDIS_CACHE_TIME, JSON.stringify(data));                  
                })         
                .map((data) => activityMapping.transform(data))
                .catch((error) => {                   
                    loggingModel.logWithLabel("Activity Data Transform", error, "123", "ERROR");
                    return Observable.of({
                        activities: {}
                    })
                });


          const f$ = favoriteService.get(req.headers)
                .catch((error) => {                   
                    loggingModel.logWithLabel("Favorite Service API", error, "123" , "ERROR");
                    return client.getCachedDataFor$(REDIS_FAV_CACHE);                    
                })                
                .do((data) => {                           
                    client.setex(REDIS_FAV_CACHE, REDIS_CACHE_TIME, JSON.stringify(data));                  
                })         
                .map((data) => favoriteMapping.transform(data))
                .catch((error) => {                   
                    loggingModel.logWithLabel("Favorite Data Transform", error, "123", "ERROR");
                    return Observable.of({
                        favorites: {}
                    })
                });

            
        const m$ = meditationService.get(req.headers)
                .catch((error) => {                   
                    loggingModel.logWithLabel("Meditation Service API", error, "123" , "ERROR");
                    return client.getCachedDataFor$(REDIS_MEDITATION_CACHE);
                })                
                .do((data) => {                           
                    client.setex(REDIS_MEDITATION_CACHE, REDIS_CACHE_TIME, JSON.stringify(data));
                })               
                .map((data) => meditationMapping.transform(data))
                .catch((error) => {                            
                    loggingModel.logWithLabel("Meditation Data Transform", error, "123", "ERROR");
                    return Observable.of({
                        meditations: {}
                    })
                });

		return Observable.concat(m$, 
                                Observable.forkJoin(f$, a$, b$, wl$, w$, u$)
                                .concatMap(results => Observable.from(results))
                                );
    }

module.exports = home;
