class Users
{
    cons = []; // Lista de usuários
    userCounter = 1; // Contador de usuários para novos

    // Mostra a mensagem a todos do chat
    broadcast(args)
    {
        this.cons.forEach(function(con){
            if(con === args.sender)
                return;
            con.write(args.message);
        });
    }

    // Envia a mensagem privada
    private(args)
    {
        this.cons.forEach(con => {
            if(con.nome == args.recipient){
                con.write(args.sender+" wrote just for you: "+args.message);
                return;
            }
        });
    }

    // Resposta do servidor para um usuário
    systemAnswer(args)
    {
        this.cons.forEach(con => {
            if(con.nome == args.recipient){
                con.write(args.message);
            }
        });
    }

    // Verifica se o nome está em uso
    verNomeRep(nome)
    {
        var repete = false;
        this.cons.forEach(function(con){
            if(nome == con.nome){
                repete = true;
            }
        });
        return repete;
    }

    // Adiciona o user a lista
    attachUser(con)
    {
        con.nome = "unknown"+this.userCounter++;
        this.cons.push(con);
    }

    // Retira o user da lista
    detachUser(con)
    {
        this.cons.splice(this.cons.indexOf(con), 1);
    }

    // Prepara o comando separando em partes para o array
    prepararComando(comando)
    {
        // Verifica se é um comando
        if(comando[0] === '/'){

            // Separa o comando em partes de um array
            var cmd = comando.split(' ');

            // Retira a ação e define os argumentos do comando
            var args = cmd.splice(1);

            // Define a ação do comando sem a /
            var act = cmd[0].slice(1);

            // Define um obj com um array com a ação e os argumentos
            var answer = {
                type: 'function',
                args: {
                    act: act,
                    args: args
                }
            }
        }
        // Caso não for um comando
        else{
            // Define um obj com um array com a ação e os argumentos para caso não for um comando
            var answer = {
                type: 'message',
                args: {
                    message: comando
                }
            }
        }

        // Retorna a resposta da mensagem ou da funcionalidade
        return answer;
    }
}
module.exports= Users;