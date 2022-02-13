const Message = require('../model/Message');

//we take care of the request here not in the route, i.e. req.body.message is here, this is the job of the controller, take care of requests
function addMessage(req,callback){

    var mensagem = req.body.message;
    var username = req.session.user[0].username;
    var namedb = req.params.id;


    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date+' '+time;

    console.log(namedb + '   ' + username);

    Message.insertMessage(namedb, username, mensagem, dateTime, callback);
}

module.exports = {
    addMessage
};
