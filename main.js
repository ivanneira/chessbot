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
var refreshTime = 9000;

//llamado a la API de chess.com
function update() {

    try {
        request(url, function (error, response, body) {

            if (error) {
                console.log(error);
            } else {

                games = JSON.parse(body);
                games = games.games[0];
                process()
            }
        });
    }catch(e){
        console.log(e);
    }
}

//compara turno anterior con nuevo turno
function process(){

    var turno = "sinturno";

        if(games.turn === "white"){

            turno = "blancas";
        }

        if(games.turn === "black")
        {

            turno = "negras";
        }

        if(turnoAnterior !== turno && turno !== "sinturno" ){

            turnoAnterior = turno;
            sendMessage(turno);
        }
}


function sendMessage(turno){

    var message = "";
    var options = { day: "numeric", hour: "numeric", minute: "numeric"};
    var fecha = new Date( games.last_activity*1000 ).toLocaleDateString('ar-ES',options);

    if(turno === "blancas"){

        message = "Negras movieron el [día " + fecha + "], es el turno de las blancas";
    }else{

        message = "Blancas movieron el [día " + fecha + "], es el turno de las negras";
    }

    enviar(ivan, message)
    //enviar(imbrium, message)
}

//proceso principal
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

//envío simple
function enviar(user, message){

    api.sendMessage({

        chat_id: user,
        text: message
    });
}
