'use strict';
var rp = require('request-promise');
var fs = require('fs');
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

var lastMove = "";
var move;
var ivan = 14910151;
var imbrium = 490801566;
var refreshTime = 10000;

function update(){

    fs.readFile('lastmove', 'utf8', function read(err, data) {
        if (err) {
            console.log(err);
        }else {

            lastMove = parseInt( data );

            decide();
        }

    });

}

function decide(){

    toMove('imbrium3');
    toMove('ivaneduardoneira');
}

function toMove(user){


        rp.get({
            uri: 'https://api.chess.com/pub/player/' + user + '/games/to-move',
            transform: function(body, res){
                res.data = JSON.parse(body);
                return res;
            }
        }).then(function(res){

           move = res.data.games[0];

           process(user);
        })
            .catch(function(err){
                console.log(err);
            });
}

//procesamiento de datos
function process(user){



    if(move){

        var date = new Date(move.move_by*1000)
        var hours = date.getHours();
        var minutes = date.getMinutes();

        if(move.move_by !== lastMove){
            fs.writeFile('lastmove', move.move_by, function(err){

                if (err){
                    console.log(err)
                }

            });

            if(user === 'ivaneduardoneira'){
                console.log("nuevo " + user)
                enviar(ivan, "Nuevo movimiento a las " + hours + ':' + minutes );
            }

            if(user === 'imbrium3'){
                console.log("nuevo " + user)
                enviar(imbrium, "Nuevo movimiento a las " + hours + ':' + minutes);
            }

        }else{
            console.log("no " + user)
        }

    }else{
        console.log("nada " + user)
    }
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
