var MongoClient = require('mongodb').MongoClient;


//Connection URL

var url = 'mongodb://username:password@ds033601.mongolab.com:33601/sc2';


function getConnection(cb){
//Use connect method to connect to the Sever (mongolab hosing right now

MongoClient.connect(url, function(err,db){

      console.log("Connected to the server finally");

     if (err) return cb(err);
    
     var tokens = db.collection("tokens");
     
     //index
     tokens.ensureIndex({name : true}, function(err) {
       if(err) return cb(err);
       cb(null, tokens);

     
    });
  });
}

//upsert creates a new rocord OR updates and exisiting record

function upsertValue(collection, name, value, cb){
   collection.findAndModify({name: name}, {}, {$set: {tokenvalue: value}},
   {upsert: true, new: true}, cb);
}

function readAll(collection, cb) {
   collection.find({}, cb);
}

function readToken(collection, name, cb) {
   collection.findOne({name: name}, cb);
}

function printUser(user) {

if (!user){
   console.log("couldn't find user");
  }
console.log(user.name + "has been assigned token " user.token);
}

function printUsers(users, cb) {
   users.each(function(err, user) {
     if(err) return cb(err);
     printUser(user);
   });
}


function connect2(operation, name, token, cb){
   getConnection(function(err, collection){
  if (err) return cb(err);

  

  function processUser(err, user){
    if (err) return cb(err);
    printUser(user);
    collection.db.close();
    cb();
  }

   function processUsers(err, users) {
   if (err) return cb(err);

   users.each(function(err, user) {
   if (err) return cb(err)
   if (user) {
     printUser(user) ;
    } else {
      collection.db.close();
      cb();
    }
  });

 }

  if (operation === "list") {
    readAll(collection, processUsers);
  } else if (operation === "update") {
    upsertValue(collection, name, token, processUser);
  } else if (operation == "read") {
    readValue(collection, name, processUser);
  } else {
      return cb(new Error("unknown operation!"));
  }
 });
}


var operation = process.argv[2];
var name = process.argv[3];
var token = process.argv[4];

 
connect2(operation, name, token, function(err){
if (err) {
 conole.log("had an error :(", err);
 process.exit(1);
  }

});





