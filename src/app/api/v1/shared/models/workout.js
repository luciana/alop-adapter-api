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
        client = require('../models/client'),
        configModule = require('config');

const workoutService = require('../services/workout'),
    workoutMapping = require('../mappings/workout'),
    trackingService = require('../services/tracking'),
    activityMapping = require('../mappings/activity'),
    loggingService = require('../services/logging'),
    loggingModel = require('../models/logging'),
    schedule = require('../../schedule/model'),
    favoriteService = require('../services/favorite'),
    favoriteMapping = require('../mappings/favorite'),
    tracker = require('../middleware/tracker');
    

const REDIS_CACHE_TIME = configModule.get('REDIS_CACHE_TIME');
const REDIS_WORKOUT_CACHE = "alop-adapter-workout";
const REDIS_FAV_CACHE = "alop-adapter-favorites";
const REDIS_ACTIVITY_CACHE = "alop-adapter-activity";

let workout = {};


workout.get$ = (req, res) => {
    //let key = workout.getKeyFor(REDIS_WORKOUT_CACHE, req.headers);

    const callWorkoutService$ = workoutService.get(req.headers)
                            .catch((error)=>{
                                return workout.getDefault$;
                            })                          
                            .map((data) => workoutMapping.transform(data))
                            .do((data) => {
                               // client.setex(key, configModule.get('REDIS_CACHE_TIME'), JSON.stringify(data));
                            })
                            .catch((error) => {                                  
                                    loggingModel.logWithLabel("Workout Data Transform - Return Workout default. Calling Workout Service", error, tracker.requestID, "ERROR");
                                    return workout.getDefault$;
                            });
    return Observable.merge(callWorkoutService$);
    // let cacheIsRetrieved$ = client.getCachedDataFor$(key)
    //                             .filter((value) => value)
    //                             .catch((error) => {
    //                                 loggingModel.logWithLabel("Workout Data Transform - Return Workout default. There was data in cache.", error, tracker.requestID, "ERROR");
    //                                 return workout.getDefault$;
    //                             });

    // let cacheIsNotRetrieved$ =client.getCachedDataFor$(key)
    //                             .filter((value) => !value)                               
    //                             .switchMap(() => callWorkoutService$)
    //                             .catch((error) => {                                   
    //                                 loggingModel.logWithLabel("Workout Data Transform - Return user default. There was not data in cache", error, tracker.requestID, "ERROR");
    //                                 return workout.getDefault$;
    //                             });
                               
    // return Observable.merge(cacheIsRetrieved$,cacheIsNotRetrieved$);
};



workout.getDefault$ = () =>{
    
    return Observable.of(workoutMapping.getDefault());
};

workout.getLabel$ = () => {
    let label = "Enjoy a variety of classes!  ";
    return Observable.of({
                 workout_label: label
            });
};

workout.getSchedule$ = (req, res) => {
   
    const callWorkoutService$ = workoutService.getSchedule(req.headers)                                                                                                                               
                            .map((data) => workoutMapping.transformSchedule(data))                            
                            .catch((error) => {                                                                  
                                    loggingModel.logWithLabel("Workout Data Transform - Return Workout Schedule. Calling Workout Service", error, tracker.requestID, "ERROR");                                   
                                    return Observable.of(schedule.getDefault());   
                            });
    return Observable.merge(callWorkoutService$);
};

workout.getFavorites$ = (req, res) =>{
    //let key = workout.getKeyFor(REDIS_FAV_CACHE, req.headers);
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
                    //client.setex(key, REDIS_CACHE_TIME, JSON.stringify(data));
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
    //let key = workout.getKeyFor(REDIS_ACTIVITY_CACHE, req.headers);
    const callTrackingService$ = trackingService.get(req.headers)
                            .catch((error)=>{
                                return workout.getDefaultActivities$;
                            })                          
                            .map((data) => activityMapping.transform(data))
                            // .do((data) => {                               
                            //     client.setex(key, configModule.get('REDIS_CACHE_TIME'), JSON.stringify(data));
                            // })
                            .catch((error) => {                                  
                                    loggingModel.logWithLabel("Tracking Data Transform - Return Tracking default. Calling Tracking Service", error, tracker.requestID, "ERROR");
                                    return workout.getDefaultActivities$;
                            });
    return Observable.merge(callTrackingService$);
    // let cacheIsRetrieved$ = client.getCachedDataFor$(key)
    //                             .filter((value) => value)
    //                             .catch((error) => {                                       
    //                                 loggingModel.logWithLabel("Tracking Data Transform - Return Tracking default. There was data in cache.", error, tracker.requestID, "ERROR");
    //                                 return workout.getDefaultActivities$;
    //                             });

    // let cacheIsNotRetrieved$ =client.getCachedDataFor$(key)
    //                             .filter((value) => !value)                               
    //                             .switchMap(() => callTrackingService$)
    //                             .catch((error) => {                                   
    //                                 loggingModel.logWithLabel("Tracking Data Transform - Return user default. There was not data in cache", error, tracker.requestID, "ERROR");
    //                                 return workout.getDefaultActivities$;
    //                             });
                               
    // return Observable.merge(cacheIsRetrieved$,cacheIsNotRetrieved$);

};

workout.getDefaultActivities$ = () =>{
    return Observable.of(activityMapping.getDefault()); 
};

// workout.getKeyFor = (key, headers) =>{
//     const { authorization } = headers;
//     return key + authorization;
// };

module.exports = workout;
