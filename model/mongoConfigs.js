const mongo = require('mongodb');
var MongoClient = mongo.MongoClient;
var db;

module.exports = {
    connect: function (callback) {
        MongoClient.connect('mongodb+srv://G15:uUKLmrjopIJ46eQZ@clusterdbw.1dbjr.mongodb.net/G15?authSource=admin&replicaSet=atlas-bek8xj-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true', { useUnifiedTopology: true },function (err, database) {
            console.log('Connected the database on port 27017');
            db = database.db('G15');
            callback(err);
    })},
    getDB:function(){
        return db;
    }
}