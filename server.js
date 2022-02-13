// Módulos
const express = require('express');
const path = require('path');
const session = require("express-session");

const {v4:uuidv4} =require('uuid');

const router = require('./router');

const mongoConfigs = require("./model/mongoConfigs");


var app = express();




// Configuração das sessões
app.use(session({
    secret: uuidv4(),
    resave: false,
    saveUninitialized: true
}))

app.set('view engine', 'ejs')
app.use("/public", express.static(path.join(__dirname,'public')));// Para poder usar o css
app.use('/images', express.static(path.join(__dirname,'public/images')));
app.use('/js', express.static(path.join(__dirname,'public/js')));

app.use('/app', router);


app.get('/app/menssage/:id', function (req, res) {
    if (req.session.user){
        res.render('menssage',
            //data to be passed to the view
            {user : req.session.user, id:req.params.id,conv:req.session.conv});
    }else {
        //res.send('Unauthorize User')
        res.redirect('/app/login');
    }
});



//home route
app.get('/',(req,res)=>{
    res.render('login',{title:"Login System"})
})

// Conexão
mongoConfigs.connect(function(err){
    if(!err){
        app.listen(3000,function(){
            console.log("Express web server listening on port 3000");
        });
    }
})