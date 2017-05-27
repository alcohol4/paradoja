var express = require('express'),
    http = require('http');
var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);
const PORT = process.env.PORT || 3000
server.listen(PORT, function() {
    console.log('server successfully started on port ' + PORT);
});
server.listen(4000);

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/tablero.html")
});
var jugador = {blancas: '',
                 negras: ''};
var lista_espera = [];
var indice = 0;
var turno = {blancas : true,
              negras: false}
var blockPiece = { status: false,
  id:''
};
io.sockets.on('connection', function(socket) {
  socket.on('crear jugador', function(data) {
      socket.nickJugador=data;
      if(jugador.blancas == ''){
        jugador.blancas = socket.nickJugador;
      }else if(jugador.negras == ''){
        jugador.negras=socket.nickJugador;
      }else{
        lista_espera[indice] = socket.nickJugador;
        indice++;
      }
  });
  socket.on('validar seleccion peon', function(data) {
if(data.nickJugador == jugador.blancas && data.colorPiece == 'rgb(255, 255, 255)' && turno.blancas == true && blockPiece.status == false){
  io.sockets.emit('comunicar seleccion', true);
}
  })
  socket.on('validar movimiento peon', function(data) {
    filaDif = data.targetFila - data.fichaFila;
    if(filaDif == -1 || filaDif == 1){

      if(blockPiece.status == true && data.fichaId==blockPiece.id){
        console.log(blockPiece.status)
blockPiece.id=data.targetId;
        io.sockets.emit('comunicar movimiento', true);
      }else if(blockPiece.status == false){

        io.sockets.emit('comunicar movimiento', true);
        blockPiece.id=data.targetId;
        blockPiece.status = true;


      }else{
        console.log(blockPiece.status)
        console.log(blockPiece.id)
        console.log(data.fichaId)
      }
    }
  })
})

app.use(express.static(__dirname + "/"));
io.on("connection", function(socket) {


})
app.get("/", function(req, res) {
    res.sendFile(__dirname + "/tablero.html")
});
