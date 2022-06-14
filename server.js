var net = require('net');
var myCon = require('./console');
var config = require('./config.json');
var comandos = require('./comandos.json');
var Users = require('./functions').Users;

var listaComandos = comandos.comands;
var Clients = new Users();
var server = net.createServer(function(con){
    Clients.attachUser(con);//adicionar um user ex: con=Leo
    con.on('data', function(msg){// recebeu mensagem "/name Danilo"
        var comando = msg.toString().trim();// mensagem toString e tira espaços inuteis
        if(comando[0] === "/")//se tiver uma barra no inicio
        {
            var cmdArray = comando.split(" ");//trasforma num array separado por espaços ex: "/msgTo Danilo" = "[msgTo] [Danilo] [Ola]"
            var func = cmdArray[0].slice(1);//pega na primeira possição do array e retira a barra
            listaComandos.forEach(function(e){//lista os comandos do json
                var comand = e.comand.slice(1).split(' ');//pega no comando, tira a barra e tranforma num array ex:"/msg @user" = [msgTo] [@user]
                var nome = comand[0];//pega na primeira possição [msgTo]
                if(func == nome)//compara as duas [msgTo]=[msgTo]
                {
                    var msg = Clients[func](con, comando);//vai na classe Clients.msgTo(@me, comando)
                    if(msg)//se houve retorno
                        Clients.broadcast(msg);//
                }
            });
        }
        else
        {
            myCon.log(con.nome+" wrote "+comando);
            Clients.broadcast(con.nome+': '+msg,con);
        }
    });
    con.on('end', function(){
        Clients.broadcast(con.nome+' saiu ', con);
        Clients.detachUser(con);
    });
    con.on('error', e => myCon.log(e.toString()));
});
server.listen({
    port: config.port,
    readableAll: true,
    writableAll: true
});