/**
 A/B Test 

 * returns A/B test IDs

**/

let abTest = {};
abTest.ALL_SCHEDULES_TEST = '';
/**
 * This function sets the internal ab schedule test id to the appropriate value.
 * It is called from the home controller by the appropriate test method - see home/controller
 * @param {id} id is the ab test key. Valid values are: ALL_SCHEDULES_TEST_A, ALL_SCHEDULES_TEST_B
 **/

abTest.set_schedule_test = (id) =>{
    abTest.ALL_SCHEDULES_TEST = id; 
    console.log(`USER TRACKING SET SCHEDULES TEST ID:`, abTest.ALL_SCHEDULES_TEST);
};

/**
 * This function gets the spcificied ab schedule test id 
 * If abTest.ALL_SCHEDULES_TEST is empty return default test
 **/

abTest.get_schedule_test = () =>{
    //let defaultValue = "ALL_SCHEDULES_TEST_A";
    // if (!abTest.ALL_SCHEDULES_TEST){
    //     t = defaultValue;
    // }else{
        t = abTest.ALL_SCHEDULES_TEST;
    //}
    console.log(`USER TRACKING GET SCHEDULES TEST ID:`, t);
    return  t;
};

module.exports = abTest;