'use strict';
var request = require('request');
const axios = require('axios');
var superagent = require('superagent');
var https = require('https');
var tryjson = require('tryjson');
const got = require('got');


var TelegramBot = require('telegram-bot-api');

var url = 'https://api.chess.com/pub/player/ivaneduardoneira/games';

var api = new TelegramBot({
    token: '605637086:AAGyrQN2rkiG0guSD-ze2g7xuEU8jFO5D0E',
    http_proxy: {
        host: '10.2.0.1',
        port: 6588
    },
    updates: {
        enabled: true,
        get_interval: 1000
    }
});


var games;
var ivan = 14910151;
var imbrium = 490801566;
var turnoAnterior = "negras";


function update() {

    got(url, { json: true }).then(function(response) {
        console.log(response);
        games = response.games[0];
        process();

    }).catch(function(error){
            console.log(error.response.body);
    });

}

function process(){

    var turno;

    console.log(games)

    for(var index in games){

        if(games[index].turn === "white"){

            turno = "blancas";
        }else{

            turno = "negras";
        }

        if(turnoAnterior !== turno){

            turnoAnterior = turno;
            sendMessage(turno);
        }
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

    enviar(ivan, message.text)

}

setInterval(update, 10000);

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
