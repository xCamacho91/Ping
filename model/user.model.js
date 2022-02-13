const mongoConfigs = require('./mongoConfigs');


function insertUser(username,password,photo, callback){
    var db = mongoConfigs.getDB();
    db.collection('users').insertOne({username:username,password:password, profilePhoto: photo},function(err,result){

        callback(err,result);
    });
}


function getUser(callback, username){
    var db = mongoConfigs.getDB();
    db.collection('users').find({username:username}).toArray(function(err,result){

        callback(result);  // quando a função for chamada noutra função, o que colocar dentro do argumento, terá o valor de result (??)

    });
}

function getUsers(callback){
    var db = mongoConfigs.getDB();
    db.collection('users').find().toArray(function(err,result){

        callback(err,result);

    });
}
//cria conversa
function criarConversa(n,id,u,s,d,i,callback){ // cria a conversa, guardando o user como um arry pois a conversa pode ter mais que um utilizador
    var db = mongoConfigs.getDB();
    db.collection('conversas').insertOne({nome:n,users:[{ userId:id, username:u, type: "Admin" }],status:s,data:d, imagem:i},function(err,result){
        callback(err,result);
    });
}


function insertPhoto(callback, id, caminho) {

    var db = mongoConfigs.getDB();
    var ObjectID = require('mongodb').ObjectID

    db.collection('users').updateOne({ "_id": ObjectID(id)}, {$set: {"profilePhoto": caminho}}, function (err, result) {

        //callback(result,err);
    });
}


function getConversaUser(valor,callback){ // carrega o nome das conversas que o utilizador está presennte
    var db = mongoConfigs.getDB();
    db.collection('conversas').find({users: {$elemMatch: {username:valor}}}).toArray(function(err,result){
        callback(err,result);

    });
}

function getConversa(valor,callback){ // carrega o nome das conversas que o utilizador está presennte
    var db = mongoConfigs.getDB();
    var ObjectID = require('mongodb').ObjectID
    db.collection('conversas').find({"_id": ObjectID(valor)}).toArray(function(err,result){
        callback(err,result);

    });
}

function getConteudo(namedb,callback){ // carrega o conteudo das conversas, tendo em conta o valor recebido pelo namedb para pesquisar nas diversas coleções
    var db = mongoConfigs.getDB();
    db.collection(namedb).find().toArray(function(err,result){
        callback(err,result);

    });
}

function insertPassword(callback, id, passwordnova){

    var db = mongoConfigs.getDB();
    var ObjectID = require('mongodb').ObjectID

    db.collection('users').updateOne({ "_id": ObjectID(id)}, {$set: {"password": passwordnova}}, function ( result,err) {

        callback(result,err);
    });

}

function addUserConv(callback, conversa, selecao){

    var db = mongoConfigs.getDB();
    var ObjectID = require('mongodb').ObjectID
    db.collection('conversas').updateOne({ "_id": ObjectID(conversa)}, {$push: {"users": {"username": selecao, "type": 'Normal'}}}, function(err,result){

        callback(err,result);

    });


    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date+' '+time;

    db.collection(conversa).insertOne({mensagem:'O utilizador ' + selecao + ' entrou na conversa ',dateTime:dateTime, indice:'1'}, function(err,result){

        callback(err,result);
    });
}


function getConversasPublicas(callback){

    var db = mongoConfigs.getDB();

    db.collection('conversas').find({status:'Publica'}).toArray(function(err,result){
        callback(err,result);

    });
}


function getUserVisit(id,callback){ // carrega o conteudo das conversas, tendo em conta o valor recebido pelo namedb para pesquisar nas diversas coleções
    var db = mongoConfigs.getDB();
    var ObjectID = require('mongodb').ObjectID
    db.collection("users").find({"_id": ObjectID(id)}).toArray(function(err,result){
        callback(err,result);

    });
    db.collection("conversas").find({users: {$elemMatch: {username:id}}}).toArray(function(err,result){
        callback(err,result);
    });
}



module.exports = {
    insertUser,
    addUserConv,
    getUser,
    getUsers,
    insertPhoto,
    getConversaUser,
    getConversa,
    criarConversa,
    getConteudo,
    insertPassword,
    getConversasPublicas,
    getUserVisit
}