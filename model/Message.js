const mongoConfigs = require("../model/mongoConfigs");

function insertMessage(namedb, username, mensagem,dateTime, callback){


    var db = mongoConfigs.getDB();
    db.collection(namedb).insertOne({username:username,mensagem:mensagem,dateTime:dateTime}, function(result){

        callback(result);
    });
}

module.exports = {
    insertMessage
};
