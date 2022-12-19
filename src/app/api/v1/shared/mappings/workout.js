/**
 * Mapping File
 *
 *
 *
 */

'use strict'

let schedule = require('../../schedule/model');
let workout = {};

workout.transform = (data) => {
    	let results = [];
		let result = data.map((item) => {
				var result = {};
				result.id = item.id;
				result.title = item.title;
				result.description = item.content;
				result.instructor_name= item.instructor.name;
				result.instructor_path = item.instructor.url;
				result.duration = item.duration.description;
				result.category = item.category.name;
				return result;
		});
		results.workouts = result;
		return results;
};

workout.transformLimited = (data) =>{     
		return data.map((item) => {
				var result = {};
				var i = item.id;
				result.id = '"' + i + '"' ;
				result.name = item.title;		
				return result;
		});

};

workout.transformSchedule = (data) =>{  	 
	let results = [];
	let result = data.map((item, index) => {		
			var result = {};
			var i = item.id;
			result.id = i;
			result.title = item.title;	
			result.duration_id = item.duration_id;	
			result.audio_time = item.audio_time;	
			result.schedule_id = 0;
			//result.duration = item.duration;
			result.duration = schedule.getActualTime(item.audio_time);
			result.concentrations_id = item.concentrations_id;			
			result.concentration = item.concentration;	
			if (index % 2 == 0){
				result.instructor_video_id = 1;
				result.instructor_video_name = "Jodi Brinkman";
			}else{								
				result.instructor_video_id = 4;
				result.instructor_video_name = "Laura Locker";
			}
			return result;
	});

	results.workouts = result;
	return results;

};

workout.getDefault = () => {
	return JSON.parse('{"workouts": [{"category": "Pilates","description": "","duration": "10-20 minutes","id": 530,"instructor_name": "Jodi Brinkman","instructor_path": "https://www.alotofpilates.com/instructors/1","title": "Basic Beginner Pilates Class"},{"category": "Stretching","description": "","duration": "10-20 minutes","id": 524,"instructor_name": "Colleen McGill","instructor_path": "https://www.alotofpilates.com/instructors/2","title": "Stretch and Breathe"},{"category": "Pilates","description": "","duration": "10-20 minutes","id": 654,"instructor_name": "Colleen McGill","instructor_path": "https://www.alotofpilates.com/instructors/2","title": "Simple and Effective"},{"category": "Power Pilates","description": "","duration": "10-20 minutes","id": 519,"instructor_name": "Colleen McGill","instructor_path": "https://www.alotofpilates.com/instructors/2","title": "Power Core"}]}');
};

module.exports = workout;
