// Require de todas as bibliotecas utilizadas
var net = require('net');
var myCon = require('./anexo/console');
const CONFIG = require('./anexo/config');
var Users = require('./functions');
var comandosR = require('./comandos');
listaComandos = comandosR.comandos

// Cria o objeto com as funcionalidades do usuário
var Clients = new Users();

// Cria a ligação com o servidor
var server = net.createServer(function(con){

    // adiciona o usuário ao objeto
    Clients.attachUser(con);

    con.on('data', function(msg){

        // Prepara a mensagem
        var message = msg.toString().trim();

        // Formata a mensagem
        var comando = Clients.prepararComando(message);

        // Verifica se a mensagem é uma funcionalidade
        if(comando.type === 'function')
        {
            // Separa a funcionalidade e os argumentos
            var func = comando.args['act'];
            var args = comando.args['args'];

            // Verifica se a funcionalidade existe
            //if(typeof listaComandos[func].funcao === 'function')
                // Executa a funcionalidade
                var msgServer = listaComandos[func].funcao(con, args);
                //console.log(listaComandos.func.funcao);
            //else
                // Caso a funcionalidade não exista
                //Clients.systemAnswer("Command does not exists ", con.nome);

            // Verifica se a funcionalidade responde com alguma mensagem para o servidor
            if(typeof msgServer === 'string')
                myCon.log(msgServer);

        }
        // Se não for uma funcionalidade é uma mensagem comum
        else if(comando.type === 'message')
        {
            myCon.log(con.nome+" wrote "+comando.args.message);
            var send = {
                sender: con,
                message: con.nome+': '+comando.message
            }
            Clients.broadcast(send);
        }
    });

    // Mensagem para quando o user terminar a sessão
    con.on('end', function(){
        var send = {
            sender: con,
            message: con.nome+" just left"
        }
        Clients.broadcast(send);
        myCon.log(con.nome+" just left");

        // Retirar user do objeto
        Clients.detachUser(con);
    });

    // Mensagens de erros
    con.on('error', e => myCon.log(e.toString()));

});

// Configs do servidor
server.listen({
    port: CONFIG.PORT,
    readableAll: true,
    writableAll: true
});