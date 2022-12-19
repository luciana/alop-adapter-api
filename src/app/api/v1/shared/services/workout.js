/**
 * Business API Service Call
 * Workout data
 *
 *
 */

'use strict'

var apiCall = require('./apiCall');
let workout = {};

workout.get = (headers) => {
	const options = {
		uri: apiCall.baseUrl +"api/v3/workouts/recommendations?limit=4&status=active&duration=1,2,3",	
		headers: apiCall.parseHeaders(headers),
        json: true,
		gzip: true,
        timeout: 10000
    };
	return apiCall.get(options);
};
workout.getAll = (headers) => {
	const options = {
		uri: apiCall.baseUrl +"api/v1/workouts?status=active&page=1&limit=101",	
		headers: apiCall.parseHeaders(headers),
        json: true,
		gzip: true,
        timeout: 100000
    };
	return apiCall.get(options);
};

workout.getSchedule = (headers) => {
	const options = {
		uri: apiCall.baseUrl +"api/v3/workouts/schedule",	
		headers: apiCall.parseHeaders(headers),
        json: true,
		gzip: true,
        timeout: 10000
    };
	return apiCall.get(options)
};
module.exports = workout;
