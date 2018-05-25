'use strict';
var request = require('request');
var TelegramBot = require('telegram-bot-api');

var url = 'https://api.chess.com/pub/player/ivaneduardoneira/games';

var api = new TelegramBot({
    token: '605637086:AAGyrQN2rkiG0guSD-ze2g7xuEU8jFO5D0E'
});


var games;
var ivan = 14910151;
var imbrium = 490801566;
var turnoAnterior = "blancas";
var refreshTime = 5000;

function update() {

    try {
        request(url, function (error, response, body) {

            if (error) {
                console.log(error);
            } else {

                console.log("body")
                console.log(body)


                games = body;
                process()
            }
        });
    }catch(e){
        console.log(e);
    }

}

function process(){


    var turno;

    //console.log(games.turn);
    //console.log(games.last_activity);


        if(games.turn === "white"){

            turno = "blancas";
        }else{

            turno = "negras";
        }

        if(turnoAnterior !== turno){

            turnoAnterior = turno;
            sendMessage(turno);
        }




}


function sendMessage(turno){

    var message = "";
    var options = { day: "numeric", hour: "numeric", minute: "numeric"};
    var fecha = new Date( games.last_activity*1000 ).toLocaleDateString('ar-ES',options);

    if(turno === "blancas"){

        message = "Negras movieron el día " + fecha + ", es el turno de las blancas";
    }else{

        message = "Blancas movieron el día " + fecha + ", es el turno de las negras";
    }
    //console.log(message)
    enviar(ivan, message)

}

setInterval(update, refreshTime);

/*recepcion de mensajes*/
api.on('message', function(message){

    if(message.from.id === ivan){

        enviar(imbrium, message.text)
    }

    if(message.from.id === imbrium){

        enviar(ivan, message.text)
    }
});

function enviar(user, message){

    api.sendMessage({

        chat_id: user,
        text: message
    });
}
