
var express= require("express");
var bodyParser = require('body-parser');
var request = require('request');

const APP_TOKEN = 'EAAMyS6LivaUBAE3GxlK2Sdt2eNWz1tYZCpZAzmfnDAZB5cPf4qWVbuO1cPE5YH8JOGfep6OIS6yapCa237TZATntMa79PhO75iYAgGZBseuKK1ogh2oJEsPZBDeYKhXCKvdWZCk5FsSmkPPtaPqn1Ydu50itsgH3gTmrpcM9CobZCAZDZD';

var app = express();
app.use(bodyParser.json());

app.listen(3000, function(){
    console.log("el servidor se encuentra en el puerto 3000");
});

app.get('/', function(req, res){
    res.send('Bienvenidos a Trendy Store');
});

app.get('/webhook', function(req, res){
    if(req.query['hub.verify_token'] == 'tes_token-say-hello'){
        res.send(req.query['hub.challenge']);
    }else{
        res.send('tu no tienes que entrar aqui');
    }
});

app.post('/webhook', function(req, res){

    var data = req.body;
    if(data.object == 'page'){

        data.entry.forEach(function(pageEntry) {
            pageEntry.messaging.forEach(function(messagingEvent){

                if(messagingEvent.message){
                    receiveMessage(messagingEvent)
                }
            });   
        });
        res.sendStatus(200);
    }
});

function receiveMessage(event){

    var senderId = event.sender.id;
    var messageText = event.message.text;

    evaluateMessage(senderId, messageText);
}

function evaluateMessage(recipientId, message){
    var  finaMessage = "";

    if(isContain(message,'ayuda')){
        finaMessage = "Por el momento no te puedo ayudar";
    }else if(isContain(message, 'ten')){

        sendMessageImage(recipientId);
    }else if(isContain(message, 'info')){

        sendMessageTemplate(recipientId);
    
    }else{
        finaMessage = "Solo se repetir las cosas : " + message;
    }

    sendMessageText(recipientId, finaMessage);
}

function sendMessageText(recipientId, message){

    var messageData = {
        recipient : {
            id : recipientId
        },
        message: {
            text: message
        }
    };
    callSendAPI(messageData);
}

function sendMessageImage(recipientId){
//API imgru , buscamos categorias gato ramdom
    var messageData = {
        recipient : {
            id : recipientId
        },
        message: {
            attachment: {
                type: "image",
                payload: {
                    url: "https://s7d2.scene7.com/is/image/dkscdn/16NIKWCRTLTWHTSLXTNN_Grey_Pink_is/"
                }
            }
        }
    };
    callSendAPI(messageData);
}

function sendMessageTemplate(recipientId){
    var messageData = {
        recipient : {
            id : recipientId
        },
        message: {
            attachment:{
                type: "template",
                payload: {
                    template_type: "generic",
                    elements : [ elementTemplate() ]
                }
                
            }
        }
    };
    callSendAPI(messageData);
}

function elementTemplate(){
    return {
        title: "Trendy Store",
        subtitle: "Andres Agudelo",
        item_url: "https://www.facebook.com/trendystoremanizales/",
        image_url: "https://scontent.feoh1-1.fna.fbcdn.net/v/t1.0-9/18581690_1935682676714406_2228855173488565911_n.jpg?oh=696fce48bbf1cff4bf0ece20c9d0e9f2&oe=59D96CBE",
        buttons:  [ buttonsTemplate() ],
    }
}

function buttonsTemplate(){
    return{
        type: "web_url",
        url: "https://www.google.com.co/",
        title: "Click"
    }
}

function callSendAPI (messageData){

    request({
        uri: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token : APP_TOKEN},
        method: 'POST',
        json: messageData
    }, function(error, response, data){

        if(error){
            console.log("no es posible enviar mensaje");
        }else{
            console.log("el mensaje fue enviado");
        }
    
    });
}

function isContain(sentence, word){
    return sentence.indexOf(word) >-1;
}