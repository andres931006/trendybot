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