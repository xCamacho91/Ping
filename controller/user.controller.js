const user = require('../model/user.model');

function newUser (req, res, callback){
    const photo = "/public/images/default-user.png"
    var username = req.body.username;
    var password = req.body.password;

    var erros = []

    if(!username || typeof username == undefined || username == null){
        erros.push({texto: "Nome inválido"})
    }
    if(!password || typeof password == undefined || password == null){
        erros.push({texto: "Password inválida"})
    }

   user.getUser(function (result){
       if(result.length > 0){ // se o tamanho do array for 1, significa que encontrou um user com o mesmo username
           erros.push({texto: "Já existe um utilizador registado com este username"})
       }


            //console.log(result)
           if(erros.length > 0) {
               console.log("Erro no registo: ")
               console.log(erros)

               //res.end();
               res.redirect('/registo')

           }
           else {
               user.insertUser(username, password, photo, callback)
               res.redirect('/login');
           }


       }, req.body.username)  // segundo parametro da função getuser


}


function login (req, callback){
    user.getUser(callback, req.body.username);
}


function newPhoto (req, fileName, callback){ // atualiza a base de dados com a foto introduzida pelo user
    caminho  = "/public/images/" + fileName
    var id = req.session.user[0]._id

    user.insertPhoto(callback, id, caminho)
}


function getAllConversaUser(req, callback){ // ligação entre o router e a função no model
    user.getConversaUser(req.session.user[0]._id, callback);
}

function getAllConversaUserId(req, callback){ // ligação entre o router e a função no model
    user.getConversaUser(req.params.id, callback);
}

function getConversa(req, callback){ // ligação entre o router e a função no model
    user.getConversa(req.params.id, callback);
}

function getConteudoConv(req, callback){ // ligação entre o router e a função no model
    user.getConteudo(req.params.id, callback);
}

function addConversition(req,filename, callback){ // ligação entre o router e a função no model
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date+' '+time;

    imagem  = "/public/images/" + filename

    user.criarConversa(req.body.nome,req.session.user[0]._id, req.session.user[0].username,req.body.status,dateTime,imagem,callback);
}

function getUserVisit(req, callback){

    user.getUserVisit(req.params.id, callback);
}

function getUserSelect(callback){

    user.getUsers(callback);
}


function newPassword(req,callback){
    passwordnova = req.body.novapassword
    var id = req.session.user[0]._id

    user.insertPassword(callback, id , req.body.novapassword)

}

function getConversasPublicas(callback){
    user.getConversasPublicas(callback)
}

function addUserConv(req,callback){
    console.log(req.body.selecao, req.body.conversa);
    user.addUserConv(callback, req.body.conversa, req.body.selecao)
}


module.exports = {
    newUser,
    login,
    newPhoto,
    getAllConversaUser,
    getAllConversaUserId,
    addConversition,
    getConteudoConv,
    newPassword,
    getConversasPublicas,
    getConversa,
    getUserVisit,
    getUserSelect,
    addUserConv
}