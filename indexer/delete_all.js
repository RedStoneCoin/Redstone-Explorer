//deletes all saved data
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("avrioexplorer");
    dbo.collection("blocks").remove({});
});
