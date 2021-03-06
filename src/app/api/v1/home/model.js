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
        client = require('../shared/models/client'),
        configModule = require('config');

const   loggingService = require('../shared/services/logging'),
        loggingModel = require('../shared/models/logging'),
        tracker = require('../shared/middleware/tracker'),
        user = require('../shared/models/user'),
        workout = require('../shared/models/workout'),
        schedule = require('../schedule/model'),
        productIdentifier = require('../productIdentifiers/model');
        //meditation = require('../shared/models/meditation');
let home = {};
//const REDIS_USER_CACHE = "alop-adapter-user";
home.defaultAccount$ = () =>{
    const u$ = user.getDefault$();
    const s$ = u$               
                .map(params => params.user.created_at)                
                .switchMap((d) =>  schedule.getListByDate$(d));
    const pi$ = productIdentifier.getList$();
    const wl$ = workout.getLabel$();
    const b$ = Observable.of({
                 banner_image: "https://s3.amazonaws.com/s3-us-alop-images/laura_picture_spine_stretch.jpeg"
            });
    //const w$ = workout.getDefault$();
    const a$ = workout.getDefaultActivities$();
    //const f$ = Observable.of({ favorites: {} });
    //const m$ = meditation.getDefault$();
    return Observable.concat(a$, 
                                Observable.forkJoin(pi$, b$, wl$, s$, u$)
                                .concatMap(results => Observable.from(results))
                                );

};

home.getAccount$ = (req, res) => {
  	const u$ = user.get$(req, res);
    let workoutClassLimit = 4; // default
    if (req.query.wlimit){
        workoutClassLimit = req.query.wlimit;
    }   
    const s$ = u$               
                .map(params => params.user.created_at)                
                .switchMap((d) =>  schedule.getListByDate$(d))
    
    const pi$ = productIdentifier.getList$();

    const wl$ = workout.getLabel$();
    const b$ = Observable.of({
                 banner_image: "https://s3.amazonaws.com/s3-us-alop-images/laura_picture_spine_stretch.jpeg"
            });
    //const w$ = workout.get$(req, res);
    const a$ = workout.getActivities$(req, res);
    //const f$ = workout.getFavorites$(req, res);
    //const m$ = meditation.get$(req,res);

	return Observable.concat(a$, 
                                Observable.forkJoin(pi$, b$, wl$, s$,  u$)
                                .concatMap(results => Observable.from(results))
                                );

    // const key = home.getCacheKey(req.headers);
    // const liveCalls$ = Observable.forkJoin(a$,b$, wl$, s$, u$)
    //                     .do((data)=> {
    //                         if(data){      
    //                             console.log("set cache key",key);                                                        
    //                             client.setex(key, configModule.get('REDIS_CACHE_TIME'), JSON.stringify(data));
    //                         }                            
    //                     })
    //                     .concatMap(results => Observable.from(results));

    // const cacheIsRetrieved$ = client.getCachedDataFor$(key)
    //                             .filter((value) => value)
    //                             .do((d) => console.log("got data from cache"))
    //                             .catch((error) => {                                       
    //                                 loggingModel.logWithLabel("getAccount cached data for - There was data in cache.", error, tracker.requestID, "ERROR");
    //                                 return Observable.of({});
    //                             });

    // const cacheIsNotRetrieved$ =client.getCachedDataFor$(key)
    //                             .filter((value) => !value)             
    //                              .do((d) => console.log("did not get data from cache about to call live"))             
    //                             .switchMap(() => liveCalls$)
    //                             .catch((error) => {                                   
    //                                 loggingModel.logWithLabel("getAccount cached data for - There was not data in cache", error, tracker.requestID, "ERROR");
    //                                 return Observable.of({});
    //                             });
    // return Observable.merge(cacheIsRetrieved$,cacheIsNotRetrieved$);

};

// home.getCacheKey = (header) =>{
//     const { authorization } = header;
//     let key = REDIS_USER_CACHE +"-"+ "614";
//     return key;
// };
module.exports = home;
