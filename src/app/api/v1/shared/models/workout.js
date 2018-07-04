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
require('rxjs/Rx');
const Observable = require('rxjs/Observable').Observable,
        client = require('../models/client');

const workoutService = require('../services/workout'),
    workoutMapping = require('../mappings/workout'),
    trackingService = require('../services/tracking'),
    activityMapping = require('../mappings/activity'),
    loggingService = require('../services/logging'),
    loggingModel = require('../models/logging'),
    favoriteService = require('../services/favorite'),
    favoriteMapping = require('../mappings/favorite'),
    tracker = require('../middleware/tracker');

const REDIS_CACHE_TIME = 100;
const REDIS_WORKOUT_CACHE = "alop-adapter-workout";
const REDIS_FAV_CACHE = "alop-adapter-favorites";
const REDIS_ACTIVITY_CACHE = "alop-adapter-activity";

let workout = {};

workout.get$ = (req, res) => {
    return workoutService.get(req.headers)
                  .catch((error) => {                                                      
                        loggingModel.logWithLabel("Workout Service API Return from cache", error, tracker.requestID , "ERROR");                                         
                        return client.getCachedDataFor$(REDIS_WORKOUT_CACHE);                       
                })                
                .do((data) => {                           
                    client.setex(REDIS_WORKOUT_CACHE, REDIS_CACHE_TIME, JSON.stringify(data));                   
                })         
                .map((data) => workoutMapping.transform(data))
                .catch((error) => {                   
                    loggingModel.logWithLabel("Workout Data Transform - Return workout default", error, tracker.requestID, "ERROR");
                    return Observable.of(workoutMapping.getDefault());
                });
};

workout.getLabel$ = () => {
    return Observable.of({
                 workout_label: "Classes selected for you today: "                     
            });
};

workout.getFavorites$ = (req, res) =>{
    return favoriteService.get(req.headers)
                .catch((error) => {  
                    if (error.statusCode === 401){        
                        loggingModel.logWithLabel("Favorite Service API 401 Return empty default", error, tracker.requestID , "ERROR");     
                        return Observable.of({
                            favorites: {}
                        })             
                    }else{                 
                        loggingModel.logWithLabel("Favorite Service API Return from cache", error, tracker.requestID , "ERROR");
                        return client.getCachedDataFor$(REDIS_FAV_CACHE);   
                    }                 
                })                
                .do((data) => {                           
                    client.setex(REDIS_FAV_CACHE, REDIS_CACHE_TIME, JSON.stringify(data));                  
                })         
                .map((data) => favoriteMapping.transform(data))
                .catch((error) => {                   
                    loggingModel.logWithLabel("Favorite Data Transform Return empty default", error, tracker.requestID, "ERROR");
                    return Observable.of({
                        favorites: {}
                    })
                });
};

workout.getActivities$ = (req, res) =>{
    return trackingService.get(req.headers)
                .catch((error) => {   
                    if (error.statusCode === 401){   
                        loggingModel.logWithLabel("Activity Service API 401 Return empty default", error, tracker.requestID , "ERROR");     
                        return Observable.of(activityMapping.getDefault());            
                    }else{
                        loggingModel.logWithLabel("Activity Service API Return from cache", error, tracker.requestID , "ERROR");
                        return client.getCachedDataFor$(REDIS_ACTIVITY_CACHE);          
                    }
                              
                })                
                .do((data) => {                           
                    client.setex(REDIS_ACTIVITY_CACHE, REDIS_CACHE_TIME, JSON.stringify(data));                  
                })         
                .map((data) => activityMapping.transform(data))
                .catch((error) => {                   
                    loggingModel.logWithLabel("Activity Data Transform Return empty default", error, tracker.requestID, "ERROR");
                     return Observable.of(activityMapping.getDefault()); 
                });
};


module.exports = workout;