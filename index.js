var express= require("express");
var bodyParser = require('body-parser');
var request = require('request');

var app = express();
app.use(bodyParser.json());

app.listen(3000, function(){
    console.log("el servidor se encuentra en el puerto 3000");
});

app.get('/', function(req, res){
    res.send('Bienvenidos a Trendy Store');
});