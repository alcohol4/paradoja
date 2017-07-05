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
var turnoJugador='';
var lista_espera = [];
var indice = 0;
var turno = {blancas : true,
              negras: false}
var blockPiece = { status: false,
  id:''
};
i=0;
var listaJugadores = {};
io.sockets.on('connection', function(socket) {
listaJugadores[i]={id:socket.id}
i++;
  socket.on('pintar', function(data) {
Object.keys(listaJugadores).forEach(function(key) {
  if (listaJugadores[key].id == data.id) {
    listaJugadores[key]= {
      id:data.id,
      x:data.coordenadas.x,
    y:data.coordenadas.y};
    io.sockets.emit('pintando', listaJugadores);
  }
});
  });
  socket.on('mandarMensaje', function(data) {
    io.sockets.emit('comunicar', data);
  });
  socket.on('disconnect', function(data) {

    Object.keys(listaJugadores).forEach(function(key) {
      if (listaJugadores[key].id == socket.id) {
        console.log(listaJugadores[key])
        delete listaJugadores[key];
        console.log(listaJugadores[key])
        io.sockets.emit('pintando', listaJugadores);
      }
    });

 });
  socket.on('crear jugador', function(data) {
      socket.nickJugador=data;
      if(jugador.blancas == ''){
        jugador.blancas = socket.nickJugador;
        turnoJugador = jugador.blancas;
      }else if(jugador.negras == ''){
        jugador.negras=socket.nickJugador;
      }else{
        lista_espera[indice] = socket.nickJugador;
        indice++;
      }
  });
  socket.on('pasar turno', function(data) {
    blockPiece.status = false;
    io.sockets.emit('desbloquear pieza', data);
    if(turnoJugador == jugador.blancas){
      turnoJugador = jugador.negras;
    }else{
      turnoJugador = jugador.blancas;
    }
  })
  socket.on('validar seleccion peon', function(data) {
data.validate = false;
if(socket.nickJugador != 'undefined' && socket.nickJugador == turnoJugador && socket.nickJugador == jugador.blancas && data.colorPiece == 'rgb(255, 255, 255)' && blockPiece.status == false){
  data.turnoJugador = turnoJugador;
  data.validate = true;
  io.sockets.emit('comunicar seleccion', data);
}else if(socket.nickJugador != 'undefined' && socket.nickJugador == turnoJugador && socket.nickJugador == jugador.negras && data.colorPiece == 'rgb(0, 0, 0)' && blockPiece.status == false){
data.turnoJugador = turnoJugador;
data.validate = true;
io.sockets.emit('comunicar seleccion', data);
  }
})
  socket.on('validar movimiento peon', function(data) {
    filaDif = data.targetFila - data.fichaFila;
    columDif = data.targetColumn - data.fichaColumn;
    data.turnoJugador = turnoJugador;
    if(filaDif == -1 && (columDif == 1 || columDif == -1) || filaDif == 1 && (columDif == 1 || columDif == -1)){
      if(blockPiece.status == true && data.fichaId==blockPiece.id){
        data.validate = true;
        blockPiece.id=data.targetId;
        io.sockets.emit('comunicar movimiento', data);
      }else if(blockPiece.status == false){
        data.validate = true;
        io.sockets.emit('comunicar movimiento', data);
        blockPiece.id=data.targetId;
        blockPiece.status = true;
      }
    }else if(filaDif == -2 || filaDif == 2){
          if(blockPiece.status == true && data.fichaId==blockPiece.id){
            if(data.direccion == 'izqArriba' && data.saltoDoble.izqArriba != ''){
              blockPiece.id=data.targetId;
              data.validate = true;
              io.sockets.emit('comunicar movimiento', data);
            }
            if(data.direccion == 'izqAbajo' && data.saltoDoble.izqAbajo != ''){
              blockPiece.id=data.targetId;
              data.validate = true;
              io.sockets.emit('comunicar movimiento', data);
            }
            if(data.direccion == 'derArriba' && data.saltoDoble.derArriba != ''){
              blockPiece.id=data.targetId;
              data.validate = true;
              io.sockets.emit('comunicar movimiento', data);
            }
            if(data.direccion == 'derAbajo' && data.saltoDoble.derAbajo != ''){
              blockPiece.id=data.targetId;
              data.validate = true;
              io.sockets.emit('comunicar movimiento', data);
            }
            data.validate = false;
            io.sockets.emit('comunicar movimiento', data);

          }else if(blockPiece.status == false){
            if(data.direccion == 'izqArriba' && data.saltoDoble.izqArriba != ''){
              blockPiece.id=data.targetId;
              blockPiece.status = true;
              data.validate = true;
              io.sockets.emit('comunicar movimiento', data);
            }
            if(data.direccion == 'izqAbajo' && data.saltoDoble.izqAbajo != ''){
              blockPiece.id=data.targetId;
              blockPiece.status = true;
              data.validate = true;
              io.sockets.emit('comunicar movimiento', data);
            }
            if(data.direccion == 'derArriba' && data.saltoDoble.derArriba != ''){
              blockPiece.id=data.targetId;
              blockPiece.status = true;
              data.validate = true;
              io.sockets.emit('comunicar movimiento', data);
            }
            if(data.direccion == 'derAbajo' && data.saltoDoble.derAbajo != ''){
              blockPiece.id=data.targetId;
              blockPiece.status = true;
              data.validate = true;
              io.sockets.emit('comunicar movimiento', data);
            }
              data.validate = false;
              io.sockets.emit('comunicar movimiento', false);
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
