const mongoConfigs = require('./mongoConfigs');

function insertPoll(id_conversa, title, data_abertura, data_fecho, respostas, callback){
    var db = mongoConfigs.getDB();
    db.collection('polls').insertOne({id_conversa:id_conversa,title:title, data_abertura: data_abertura, data_fecho: data_fecho, respostas: respostas },function(err,result){

        callback(err,result);
    });
}


function getPoll(id_conversa, callback){
    var db = mongoConfigs.getDB();
    db.collection('polls').find({id_conversa:id_conversa}).sort({data_abertura: -1}).toArray(function(err,result){
        callback(err,result);
        // console.log(result)

    });
}


function insertVote(id_poll, id_campo, username, callback){
    var db = mongoConfigs.getDB();
    var ObjectID = require('mongodb').ObjectID

    //https://docs.mongodb.com/drivers/node/fundamentals/crud/write-operations/embedded-arrays/
    const query = {"_id": ObjectID(id_poll)} ;
    const updateDocument = { $push: { "respostas.$[item].votos": username }}
    const options = { arrayFilters: [ {"item.id_campo":id_campo } ] }
    db.collection('polls').updateOne(query,updateDocument, options, function ( result,err) {
        //  console.log(id_poll + " " + id_campo + " " + username)
        callback(result,err);
    });
}


module.exports = {
    insertPoll,
    getPoll,
    insertVote

};