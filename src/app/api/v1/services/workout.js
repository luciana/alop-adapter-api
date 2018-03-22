/**
 * Business API Service Call
 * Workout data
 *
 *
 */

'use strict'

var request = require('request');
var Observable = require('rxjs/Observable').Observable;
let workout = {};

workout.get = function(){
	const options = {
		uri: 'https://www.alotofpilates.com/api/v3/workouts/randomList?limit=4&status=active',	
		headers: {
			'accept': 'application/json',
			'content-type': 'application/json',
			'x-3scale-proxy-secret-token': 'MPP-Allow-API-Call',
			'Authorization': 'Bearer ddd87fb9a543aa0c4d1dd58d55942606dbd5681bfec5311f4077d4b0610380a9'    
		},
		json: true
	};


	return Observable.create(observer => {
		request.get(options, (err, resp, body) => {
            if (err) {
                let errorMsg;
                if (body){
                	errorMsg = "error processing response for " + JSON.stringify(body) + " for error " + err;
                }else{
                	errorMsg = "error processing response for error " + err;
                }
                observer.error({
                	resp: errorMsg
                })
            } else {
                observer.next(body);
                observer.complete();
            }
        });
	})
};

module.exports = workout;
