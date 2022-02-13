const mongo = require('mongodb');
var MongoClient = mongo.MongoClient;
var db;

module.exports = {
    connect: function (callback) {
        MongoClient.connect('URl for mongoDB connection', { useUnifiedTopology: true },function (err, database) {
            console.log('Connected the database on port 27017');
            db = database.db('G15');
            callback(err);
    })},
    getDB:function(){
        return db;
    }
}
