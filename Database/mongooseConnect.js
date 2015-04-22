/*  Provides a constant connection to our database hosted at www.mongolab.com
 */

//require mongoose node module
var mongoose = require('mongoose');

//connect to mongodb database at mongolab.com
var db = mongoose.connect('mongodb://username:password@ds053139.mongolab.com:53139/sc-2');

//connect to Mongo when the app initializes
//attach listener to connected event
mongoose.connection.once('connected', function(){
   console.log("Connected to database")
  });