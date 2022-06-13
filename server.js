var net = require('net');
var config = require('./config.json');
var cons = []; // array de clientes conectados
var broadcast = function(msg, origem){
    cons.forEach(function(con){
        if(con === origem)
            return;
        con.write(msg);
    });
}
var server = net.createServer(function(con){
    cons.push(con);
    con.write("Servidor ativo.");
    con.on('data', function(msg){
        comands = {
            cName(comando)
            {
                var nome = comando.slice(6).trim();
                if(nome === null || nome === "")
                    return;
                var valida = cons.forEach(element => {
                    if(nome === element.nome){
                        console.log("Name already taken!");
                        return false;
                    }
                });
                if(valida != false){
                    broadcast(con.nome+" changed his name to "+nome);
                    con.nome = nome;
                    return;
                }
            },
            cDesc(comando)
            {
                var desc = comando.slice(6).trim();
                broadcast(con.nome+" changed his description to "+desc);
                con.desc = desc;
                return;
            },
            seeDesc(comando)
            {
                var user = comando.slice(9).trim();
                cons.forEach(function(con){
                    if(con.nome == user){
                        broadcast(user+"'s description is "+con.desc);
                    }
                });
                return;
            }
        }
        var comando = msg.toString().trim();
        console.log(con.nome+" wrote "+comando);
        if(comando[0] == "/")
        {
            var cmd = comando.slice(1).trim();
            var corte = cmd.length - cmd.indexOf(" ");
            var func = cmd.slice(0, -corte);
            comands[func](comando);
        }
        else
            broadcast(con.nome+':'+msg,con);
    });
    con.on('end', function(){
        broadcast(con.nome+' saiu ', con);
        cons.splice(cons.indexOf(con), 1);
    });
    con.on('error', e => console.log(e.toString()));
});
server.listen({
    port: config.port,
    readableAll: true,
    writableAll: true
});