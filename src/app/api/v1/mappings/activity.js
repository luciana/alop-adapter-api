/**
 * Mapping File
 *
 *
 *
 */

'use strict'


class mappings {

    count_classes_taken_on(startDate, endDate, tracking){
        return tracking.filter(function (item) {
                    var date = new Date(item.created_at); 
                    return date >= startDate && date <= endDate;        
        }).length.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})
    };

    recent_items(limit, data){
    	return data.slice(0,limit);
    }

     get_classes_taken_this_week(data){
        var date = new Date();
        var fd = new Date(date.getTime() - 60*60*24* date.getDay()*1000);
        var ld = new Date(date.getTime() + 60 * 60 *24 * 6 * 1000);
        return this.count_classes_taken_on(fd,ld,data)
    }

    get_classes_taken_this_month(data){
     var date = new Date();
     var fd = new Date(date.getFullYear(), date.getMonth(), 1);
     var ld = new Date(date.getFullYear(), date.getMonth() + 1, 0);
     return this.count_classes_taken_on(fd,ld,data);
    }

    get_classes_taken_this_year(data){
     var date = new Date();
     var fd = new Date(date.getFullYear(), 1, 0);
     var ld = new Date(date.getFullYear(), 12, 0);
     return this.count_classes_taken_on(fd,ld,data);
    }
}

class activity {
    transform(data){
        var result = {};
        var m = new mappings();
        result.classes_taken_this_week = m.get_classes_taken_this_week(data);
        result.minutes_taken_this_week = "000";
        result.classes_taken_this_month = m.get_classes_taken_this_month(data);
        result.minutes_taken_this_month = "000";
        result.classes_taken_this_year = m.get_classes_taken_this_year(data);;
        result.minutes_taken_this_year = "000";
        result.recent_classes = m.recent_items(4,data);        
        return result;
    }
}
  

module.exports = new activity();
