var express = require("express");
var router = express.Router();

const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");

// Connection URL
const url = "mongodb://localhost:27017";

// Database Name
const dbName = "web-dev-parcial1";



const findDocuments = function(db, callback) {
  // Get the documents collection
  const collection = db.collection("viz");
  // Find some documents
  collection.find({}).toArray(function(err, docs) {
    assert.equal(err, null);
    console.log("Found the following records");
    console.log(docs);
    callback(docs);
  });
};

const insertDocument = function(db, file,callback) {
  // Get the documents collection
  const collection = db.collection("viz");
  // Insert some documents
  collection.insertMany([
    file
  ], function(err, result) {
    assert.equal(err, null);
    assert.equal(1, result.result.n);
    assert.equal(1, result.ops.length);
    console.log("Inserted 1 document into the collection");
    callback(result);
  });
};

/* GET home page. */
router.get("/", function(req, res) {
  // Use connect method to connect to the server
  MongoClient.connect(url, function(err, client) {
    assert.equal(null, err);
    console.log("Connected correctly to server");
  
    const db = client.db(dbName);
  
  
    findDocuments(db, function(docs) {
      res.setHeader("Content-Type","application/json");
      res.send(docs);
      client.close();
    });
  
  });
});

router.post("/", function(req,res){
  
  // Use connect method to connect to the server
  MongoClient.connect(url, function(err, client) {
    assert.equal(null, err);
    console.log("Connected successfully to server");
    
    const db = client.db(dbName);
    
    insertDocument(db,req.body, function() {
      res.send("document inserted.");
      client.close();
    });
  });
});
module.exports = router;