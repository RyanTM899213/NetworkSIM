var MongoClient = require('mongodb').MongoClient;


//Connection URL

var url = 'mongodb://username:password@ds033601.mongolab.com:33601/sc2';


function getConnection(cb){
//Use connect method to connect to the Server (mongolab)

MongoClient.connect(url, function(err,db){

      console.log("Connected to the server finally");

     if (err) return cb(err);
    
    //whatever collection you want to access. If this collection does not exist it will be created
     var tokens = db.collection("tokens");
     
     //index very important for keeping order
     tokens.ensureIndex({name : true}, function(err) {
       if(err) return cb(err);
       cb(null, tokens);

     
    });
  });
}
