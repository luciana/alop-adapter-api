// ab.js
//https://www.noumansaleem.com/nodejs/2017/08/15/express-js-ab-testing.html
//A/B Test Middleware
//Our package will expose a factory function ab(), which returns a function to generate a variant for each of our routes. 
//Inside our test instance, we keep a dictionary of our test variants; storing the number of times we’ve executed that specific route handler. 
//Lastly, the middleware returned for each test variant determines if it should execute its handler, or continue down the routing chain. 
//Here, we’ll opt for a dead simple weighting system – an even spread across all variants. 
//In an actual distributed production environment, you should consider more robust logic.

function ab() {
    // store a counter for each variant
   
    const counter = {};
    // return function to register variant
    return function test(variant) {      
      counter[variant] = 0;
      // return express middleware
      return function (req, res, next) {
        // check if variant has fewest requests
        // if not, next('route') to go to next variant
        // otherwise, increment variant counter and next()
        const current = counter[variant];
        const smallest = !Object.values(counter).some(count => count < current);
  
        if (!smallest) return next('route');
  
        counter[variant] = current + 1;
        next();
      };
    };
  }
  
  module.exports = ab;