var express = require('express');
var router = express.Router();
const user = require("./controller/user.controller")
const conv = require("./model/user.model")
const polls = require("./controller/polls.controller")

const bodyparser = require('body-parser')

const upload = require('express-fileupload')
const fs = require('fs')

var messageController = require('./controller/messageController');
var jsonParser = bodyparser.json();


router.use(bodyparser.json()) //
router.use(bodyparser.urlencoded({extended:true})) //



router.use(upload())
const ejs = require('ejs')
const url = require('url');


router.get('/registo', function (req, res) {
    res.render('registo',{erros: []});
});

router.get('/login', function (req, res) {
    res.render('login');
});

router.get('/teste', function (req, res) {
    res.render('login', );

    console.log(req.session.user)
});



// cria a coversa
router.post('/criarConversa',function(req,res){

    var file = req.files.img
    var name = file.name

    var today = new Date();
    var date = today.getFullYear()+""+(today.getMonth()+1)+""+today.getDate();
    var time = today.getHours()+""+today.getMinutes()+""+today.getSeconds();
    var fileName = date+''+time+""+name;    // será acrescentado ao nome da foto a data e hora atual para que não hajam fotos com nomes repetidos


    file.mv("./public/images/" + fileName, function (err){  // faz o upload da foto para a pasta do projeto
        if (err){
            console.log("Ocorreu um erro durante o uplado da foto")
            res.redirect('/app/porfile');
        }

        else { // se não ocorrer nenhum erro durante o upload, então insere o caminho na base de dados
            user.addConversition(req,fileName,function(err,result){
                //console.log(result)
                if(!err){
                    res.redirect('/app/menssage');
                    req.session.conv = result;
                    //res.render('menssage',{user : req.session.user, conv:req.session.conv})

                    console.log("conversa criada");
                }
                else
                    console.log("Erro!");
            });
            //res.render('porfile',{user : req.session.user})
        }

    })
});


// cria a coversa
router.post('/addUser',function(req,res){


    user.addUserConv(req,function(err,result){
        //console.log(result)
        if(!err){
            res.redirect('/app/menssage/'+req.body.conversa);

            console.log("Utilizador Adicionado");
        }
        else
            console.log("Erro!");
    });

});



//Rerideciona para a mensagem e se o utilizador não estiver conectado dá uma mensagem de falha
router.get('/menssage', function (req, res) {
    if (req.session.user){


    user.getAllConversaUser(req, function (err,result){
        req.session.conv = result;
        res.render('menssage',{user : req.session.user, conv:req.session.conv})
    })
    }else {
        //res.send('Unauthorize User')
        res.redirect('/app/login');
    }
});



router.get('/visit/:id', function (req, res) {
    if (req.session.user){
        user.getUserVisit(req, function (err,result){
            req.session.visit = result;
        })
        user.getAllConversaUserId(req, function (err,result){
            req.session.conv = result;
        })
        res.render('visit',{visit:req.session.visit, conv:req.session.conv})
    }else {
        //res.send('Unauthorize User')
        res.redirect('/app/login');
    }
});



router.get('/conversa/:id', function (req,res){

    if (req.session.user){

        user.getConversa(req, function (err,result){
            req.session.conversa = result;

            res.render('conversa',{user : req.session.user, id:req.params.id, info:req.session.conversa});
        });

    }else {
        //res.send('Unauthorize User')
        res.redirect('/app/login');
    }

})
// seleciona a conveersa para mostrar o conteudo da mesma



//constants for our view and messenger
const defaultMessage = "Type your message here";
const messengerRoute = '/messenger';
const textboxId = 'typeMessage';
const textboxSelector = '#'+textboxId;
const resultSelector = '#result';

// seleciona a conveersa para mostrar o conteudo da mesma
router.get('/menssage/:id', function (req, res) {
    polls.showPoll(req, function (err, result){
        if (result.length == 0) req.session.poll_data = null  // Necessário colocar a null, caso contrário estaria sempre a assumir conteudo na view
        else req.session.poll_data = result


        for (var i=0; i<result.length; ++i){ // percorre todas as votações
            var soma = 0
            for (var j=0; j<result[i].respostas.length; ++j){ // percorre as respostas da votação
                soma +=  result[i].respostas[j].votos.length // soma os votos de cada resposta
            }
            req.session.poll_data[i].totalVotos = soma
        }
        console.log(req.session.poll_data)
    })


    if (req.session.user){
        console.log(req.params.id);
        //enviado o id, para ser coletada a informação da tal conversa

        user.getUserSelect(function (err, result){
           req.session.selects = result;
        });

        user.getConteudoConv(req, function (err,result){
            req.session.conversa = result;
            res.render('menssage',
                //data to be passed to the view
            {votacao: req.session.poll_data, user : req.session.user, id:req.params.id,conv:req.session.conv, conteudo:req.session.conversa, selecao:req.session.selects, data: {
                messengerRoute: messengerRoute+'/'+req.params.id,
                resultSelector: resultSelector,
                textboxSelector: textboxSelector,
                textboxId: textboxId,
                defaultMessage: defaultMessage

                }
            });
        });

    }else {
        //res.send('Unauthorize User')
        res.redirect('/app/login');
    }
});

// função que envia a mensagem para a base de dados, e mediante o /:id  insere na respetiva mensagem
router.post(messengerRoute+'/:id', jsonParser, function (req, res) {
    //add to mongoDB
    messageController.addMessage(req,function(){

        //We have to send JSON back or the success ajax event does not work
        res.status(200).send({data:'OK'});

    });

});


router.post('/novaVotacao/:id', function (req, res) {
    polls.addPoll(req, function (){
        res.redirect(req.get('referer'));

    });
});


router.post('/menssage/votar/:id', function (req, res) {
    polls.vote(req, function (){
        res.redirect(req.get('referer')); // para manter a  pagina na mesma mensagem

    });
});














router.post('/login', function (req, res) {
    user.login(req,function (result){
        if (result.length == 0){  // Se o resultado está vazio, não encontrou nenhum user
            console.log("não existe nenhum utilizador com este username")
            res.render('login',{falha:"Não existe nenhum utilizador com este username"})
        }
        else{
            //var user = req.session;
            req.session.user = result[0]  // passando para a varíavel de sessão as informações do user
            console.log("user na sessão: ", req.session.user)
            if (req.session.user.password == req.body.password) {
                req.session.user = result;

                res.redirect('/app/menssage');

                console.log("Login com sucesso")
                //res.render('./porfile', {user:req.session.user}) // user neste caso é a variável passada para o ficheiro ejs
            }
            else{
                console.log("Password errada")
                res.render('login',{falha:"Username ou Password estão errados"})
            }
        }
    })
})


//route para o perfil
router.get('/porfile',(req, res) => {
    if (req.session.user){
        user.getConversasPublicas(function (err,result){
            console.log(result);
            req.session.publica=result;
            res.render('porfile',{user : req.session.user, erros: [], publica:req.session.publica})
        })
    }else {
        //res.send('Unauthorize User')
        res.redirect('/app/login');
    }
})

//route for lougout
router.get('/logout',(req,res) => {
    req.session.destroy(function (err){
        if (err){
            console.log(err);
            res.send('Error')
        }else{
            res.render('login',{title:'Login', logout:"O Logout foi bem sucedido"})
        }
    })
})


// -- New User --
router.post('/registar', function (req, res) {
    const photo = "/public/images/default-user.png"
    var username = req.body.username;
    var password = req.body.password;
    var passwordConfirmation = req.body.passwordConfirmation;

    var erros = []

    if(!username || typeof username == undefined || username == null){
        erros.push({texto: "Nome inválido"})
    }
    if(!password || typeof password == undefined || password == null){
        erros.push({texto: "Password inválida"})
    }
    if(passwordConfirmation != password){
        erros.push({texto: "As Passwords não correspondem"})
    }

    conv.getUser(function (result){
        if(result.length > 0){ // se o tamanho do array for 1, significa que encontrou um user com o mesmo username
            erros.push({texto: "Já existe um utilizador registado com este username"})
        }

        //console.log(result)
        if(erros.length > 0) {
            console.log("Erro no registo: ")
            console.log(erros)

            //res.end();
            res.render('./registo', {erros: erros})

        }
        else {
            conv.insertUser(username, password, photo)
            res.render('./login', {sucess: "Registo efetuado com sucesso. Efetue o login."});  // MUDAR PARA REDIRECT? PARA NÃO MANTER O /REGISTAR NO CAMINHO
        }

    }, req.body.username)  // segundo parametro da função getuser

})




router.post('/mudarpassword',function(req,res){
    var passwordantiga =req.body.antigapassword
    var passwordnova = req.body.novapassword
    var confirm_passwordnova =req.body.passwordConfirmation

    var erros = []

    if(!passwordnova || typeof passwordnova == undefined || passwordnova == null) {
        erros.push({texto: "Password inválida"})
    }
    if (passwordantiga != req.session.user[0].password) {
        erros.push({texto: "A Password que inseriste está incorreta"})
    }
    if (confirm_passwordnova != passwordnova) {
        erros.push({texto: "As Passwords não correspondem"})
    }

    if(erros.length > 0) {
        console.log("Erro na Alteração da Password: ")
        console.log(erros)

        //res.end();
        //res.render('mudar_password', {erros: erros})
        res.render('./porfile', {user : req.session.user, erros: erros, publica:req.session.publica})

    }else {
        user.newPassword(req, function (err, result) {
            if (!err) {
                console.log("Password atualizada!")
                //res.render('porfile',{user : req.session.user});
                res.redirect('/app/porfile');
            } else {
                console.log("Erro!");
                console.log(err);
            }
        })
    }

})



router.post('/alterarfoto', function (req, res) {
    var file = req.files.newFoto
    var name = file.name

    var today = new Date();
    var date = today.getFullYear()+""+(today.getMonth()+1)+""+today.getDate();
    var time = today.getHours()+""+today.getMinutes()+""+today.getSeconds();
    var fileName = date+''+time+""+name;    // será acrescentado ao nome da foto a data e hora atual para que não hajam fotos com nomes repetidos


    file.mv("./public/images/" + fileName, function (err){  // faz o upload da foto para a pasta do projeto
        if (err){
            console.log("Ocorreu um erro durante o uplado da foto")
            res.redirect('/app/porfile');
        }

        else { // se não ocorrer nenhum erro durante o upload, então insere o caminho na base de dados
            user.newPhoto(req, fileName)
            if ( req.session.user[0].profilePhoto != "/public/images/default-user.png"){
                fs.unlinkSync('./' + req.session.user[0].profilePhoto)  // apaga a foto antiga da pasta do projeto. caso seja a foto default, não será apagada
            }

            req.session.user[0].profilePhoto = "/public/images/" + fileName  // atualiza a informação da variável de sessão, para que a nova foto seja mostrada de seguida
            //res.render('porfile',{user : req.session.user})
            res.redirect('/app/porfile');
        }

    })

});


/*---- EM TESTE ----
router.post('/mudarFoto', function (req, res) {
    user.newPhoto(req,function (err,result){
        if(!err){
            //res.redirect('/perfil');
            console.log("Foto atualizada")}
        else
            console.log("Erro!");
        console.log(err)

    })

})*/



module.exports = router;