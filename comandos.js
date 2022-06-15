// Funcionalidade para altrar o nome
var Users = require('./functions');
var Clients = new Users();
module.exports.comandos = {
    name: {
        nome:'name',
        description:'Changes you name.',
        funcao(con, args)
        {
            var nome = args[0];

            // Verifica se o nome já está em uso
            var rep = Clients.verNomeRep(nome);

            // Caso não esteja em uso
            if(rep === false) {

                // prepara a mensagem para o chat e troca o nome
                var msg = con.nome+" changed his name to "+nome;
                con.nome = nome;
                var send = {
                    sender: con,
                    message: msg
                }
                Clients.broadcast(send);

                // e envia a mensagem para o servidor
                return msg;
            }
            // Caso esteja em uso
            else{
                // Prepara e envia a mensagem direta para o usuário que tentou mudar de nome
                var SysArray = {
                    message: 'This name is in use',
                    recipient: con.nome
                }
                Clients.systemAnswer(SysArray);
            }

            // Não retorna comentario para o servidor se o nome não for trocado
            return;
        }
    },
    desc: {
        nome: '/desc',
        description:'Changes your description.',
        // Funcionalidade para altrar a descrição
        funcao(con, args)
        {
            // Junta o array em uma string novamente
            var desc = args.join(' ');

            // Troca a descrição e mostra ao chat que trocou
            var msg = con.nome+" changed his description";
            con.desc = desc;
            var send = {
                sender: con,
                message: msg
            }
            Clients.broadcast(send);

            // Retorna a mensagem para o servidor
            return msg;
        }
    },
    seeDesc: {
        nome: '/seeDesc',
        description: 'See the descrition of other users.',
        // Funcionalidade para ver a descrição de um user
        funcao(con, args)
        {
            // Define o destinatario
            var user = args[0];
            var reci = con.nome;

            // Procura entre os usuários pela descrição
            Clients.cons.forEach(function(con){
                if(con.nome == user){

                    // Mostra a descrição do user
                    var desc = user+"`s description is "+con.desc;
                    var sysArray = {
                        message: desc,
                        recipient: reci
                    }
                    Clients.systemAnswer(sysArray);

                    // Retorna se achar
                    return;
                }
            });

            // Prepara e envia a mensagem para o servidor
            var msg = reci+" saw "+user+" descriptions";
            return msg;
        }
    },
    msgTo: {
        nome: '/msgTo @user',
        description: 'Private message to someone.',
        // Funcionalidade para enviar uma mensagem privada
        funcao(con, args)
        {
            // Separa a mensagem do user destinatário
            var message = args.splice(1).join(' ');

            // Define o user destinatário
            var userReci = args[0];

            // Prepara o objeto para o envio
            var privateArray = {
                message: message,
                sender: con.nome,
                recipient: userReci
            }

            // Envia o objeto com a mensagem o destino e o remetente
            Clients.private(privateArray);

            // Retorna com a mensagem para o servidor
            var msg = con.nome+" sent a private message to "+userReci+" saying: "+message;
            return msg;
        }
    },
    help: {
        nome: '/help',
        description: 'Shows all the commands the user can use.',
        funcao(con, args){
            for (chave in this) {
                console.log(chave);
            }
        }
    }
}