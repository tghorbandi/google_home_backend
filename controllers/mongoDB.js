//var app = express();
var express = require('express');
var router = express.Router();

var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });

var MongoClient = require('mongodb').MongoClient;
//var url = 'mongodb://localhost:27017/mydb';
var url = 'mongodb://Tawab:Tawab@ds149535.mlab.com:49535/mydb';

var db2;

//MongoDB Connection
MongoClient.connect(url, function(err, db) {
	console.log("MongoDB: Connected successfully to server");
	db2 = db;
});


/*
**
	Find file
**
*/
var findDocuments = function(callback) {
  // Get the documents collection
  var collection = db2.collection('products');
  // Find some documents
  collection.find({'_id': {$in: [154,155]}}).toArray(function(err, docs) {
    // assert.equal(err, null);
    console.log("Found the following records");
    // console.log(docs)
    callback(docs);
  });
}

/*
**
	Insert file 
**
*/
var insertDocuments = function(callback) {
  // Get the documents collection
  var collection = db2.collection('customers');
  // Insert some documents
  collection.insertMany([
    {tawab1 : 1}, {tawab2 : 2}, {tawab3 : 3}
  ], function(err, result) {
    console.log("Inserted documents into the collection");
    callback(result);
  });
}


/*
**
	Retrieve image
**
*/
var showImage = function(callback) {
  var collection = db2.collection('products');

  collection.find({"image1":"images/schap1.jpg"}).toArray(function(err, docs) {
  	//db.getCollection('products').find( { $text: { $search: "image" } } )

    // console.log(docs[0]["image1"]);
    docs = docs[0]["image1"];

    callback(docs);
  });
}


/*
**
 	Insert image url path
**
*/
var insertImage = function(callback) {
 	// Get the documents collection
 	var collection = db2.collection('products');
 	// Insert some documents
 	// dit moet ook dynamisch worden en niet statische name en images
 	collection.insert({ imageName: "hamer5", imagePath: "images/location5" } , function(err, result) {
 	  console.log("Inserted image into the collection");
 	  callback(result);
 	});
} 

/*
**
  Insert query from google home
**
*/
var insertQuery = function(callback, query) {
  var collection = db2.collection('all_queries');
  collection.insert({ query: query} , function(err, result) {
    //console.log("Inserted product into the collection");
    callback(result);
  });
}

/*
**
  Insert productname From GoogleHome POST
**
*/
var insertProductName = function(callback, productName) {
  var collection = db2.collection('products');
  collection.insert({ product: productName} , function(err, result) {
    //console.log("Inserted product into the collection");
    callback(result);
  });
}


/*
**
  Find product type in Database
**
*/
var findProduct = function(callback, productType) {
  var collection = db2.collection('type_hammers');
  collection.find({type: new RegExp(productType)}).toArray(function(err, docs) {
    //console.log('found records inside mongoDB');
    callback(docs);
  });
}


/*
**
  Find every type in Database
**
*/
var findAllTypes = function(callback) {
  var collection = db2.collection('type_hammers');
  collection.find({"type": 1}).toArray(function(err, docs) {
    callback(docs);
  });
}


module.exports = {}
module.exports.findDocuments = findDocuments;
module.exports.insertDocuments = insertDocuments;
module.exports.showImage = showImage;
module.exports.insertImage = insertImage;
module.exports.insertQuery = insertQuery ;
module.exports.insertProductName = insertProductName;
module.exports.findProduct = findProduct;
module.exports.findAllTypes = findAllTypes;
