const poll = require('../model/polls.model');

var today = new Date();
var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
var dateTime = date+' '+time;


function vote(req,callback){
    var id_poll =  req.body.poll_id
    var id_campo = req.body.selectedOption // usa o value do input hidden que contem o id do radio button selecionado
    var username = req.session.user[0].username

    poll.insertVote(id_poll, id_campo, username, callback)
}



function addPoll (req, callback){
    var id_conversa =  req.params.id
    var title = req.body.title
    var data_abertura = dateTime
    var data_fecho  = req.body.data_fecho.substring(0,10) +" " + req.body.data_fecho.substring(11,19) // concatenção das subtrings para que não Fique um 'T' entre a data e hora
    var respostas = []

    for (var i = 1; i <= req.body.optionsNumber; i++) {

        // concatenação do i ao nome do input field, para que seja possível aceder a todos os inputs (option1, option2, ...)
        respostas.push({opcao: req.body[`option${i}`] , votos: [], id_campo: `option${i}`})  // necessário guardar o id_campo para sabermos qual o radiobutton selecionado

    }
    poll.insertPoll(id_conversa, title, data_abertura, data_fecho, respostas, callback)
}


function showPoll(req, callback){

    poll.getPoll(req.params.id, callback)

}



module.exports = {
    addPoll,
    showPoll,
    vote
};