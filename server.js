// Require de todas as bibliotecas utilizadas
var net = require('net');
var myCon = require('./anexo/console');
const CONFIG = require('./anexo/config');
var Users = require('./Users');

// Cria o objeto com as funcionalidades do usuário
var Clients = new Users();
console.log('\x1b[36m%s\x1b[0m', 'I am cyan');

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
            if(typeof Clients[func] === 'function')
                // Executa a funcionalidade
                var msgServer = Clients[func](con, args);
            else
                // Caso a funcionalidade não exista
                Clients.systemAnswer("Command does not exists ", con.nome);

            // Verifica se a funcionalidade responde com alguma mensagem para o servidor
            if(typeof msgServer === 'string')
                myCon.log(msgServer);

        }
        // Se não for uma funcionalidade é uma mensagem comum
        else if(comando.type === 'message')
        {
            var date = new Date;
            var hours = date.getHours();
            var min = date.getMinutes();
            myCon.log(con.nome+" wrote "+comando.args.message+" at "+hours+":"+min);
            var send = {
                sender: con,
                message: con.nome+" "+hours+":"+min+': '+comando.args.message
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