'use strict';
var request = require('request');
var tryjson = require('tryjson');
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
var turnoAnterior = "blancas";

function update(){

    request.get({
        url: url,
        json: true,
        headers: {'User-Agent': 'request'}
        }, function(err, res, data){
            if (err) {
                console.log('Error:', err);
            } else if (res.statusCode !== 200) {
            console.log('Status:', res.statusCode);
        } else {
            // data is already parsed as JSON:
            console.log(data.html_url);
        }
    });

}

function process(){

    var turno;

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

    api.sendMessage({

        chat_id: ivan,
        text: message
    });
/*
    api.sendMessage({

        chat_id: imbrium,
        text: message
    });
    */
}

setInterval(update, 3000);

/*recepcion de mensajes*/
api.on('message', function(message){

    if(message.from.id === ivan){

        api.sendMessage({
            chat_id: imbrium,
            text: message.text
        });
    }

    if(message.from.id === imbrium){

        api.sendMessage({
            chat_id: ivan,
            text: message.text
        });
    }
});