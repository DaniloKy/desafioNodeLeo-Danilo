var net = require('net');
var config = require('./config.json');
var obj = require("./comandos.json");
var listaComandos = obj.comands;
const options = {
    host: config.ip,
    port : config.port
}
var client = net.connect(options);
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
client.on('connect', () => {
    console.log("Sou um cliente");
});
client.on('data', msg => {
    console.log(msg.toString());
});
client.on('end', () => {
    console.log("sair");
    process.exit;
});
client.on('error', e => {
    console.log(e.toString());
});

rl.on('line', (input)=>{
    var input_ = input.toString().trim();
    if(input_ === "/help")
        help();
    else
        showArrEl(input_);
});
function showArrEl(key){
    console.log('ME: '+key)
    client.write(`${key}`);
}
function help(){
    console.log('List of comands: ');
    listaComandos.forEach(element=>{
        console.log(element.comand+": "+element.description);
    });
}
/*
rl.on('line',input => {
    showArrEl(input.toString().trim());
});
function showArrEl (key){
    client.write(`${key}`);
}
*/