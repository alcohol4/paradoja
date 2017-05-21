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
var id = 0;
var nicknames = {};
var jugadorBlancas = '';
var jugadorNegras = '';
var tablero;
var turnBlancas = true;
var turnNegras = false;
var ableChangeTurn;
var timeTurno = false;
io.sockets.on('connection', function(socket) {
    if (turnBlancas == true) {
        turnBlancas = false;
        turnNegras = true;
    } else if (turnNegras == true) {
        turnBlancas = true;
        turnNegras = false;
    }
    var turnos = {
        turnBlancas,
        turnNegras
    }
    io.sockets.emit('carga variables', turnos);

    function cambiarTurno() {
        if (turnBlancas == true) {
            turnBlancas = false;
            turnNegras = true;
        } else if (turnNegras == true) {
            turnBlancas = true;
            turnNegras = false;
        }
        var turnos = {
            turnBlancas,
            turnNegras
        }
        io.sockets.emit('setear turno', turnos);
        timeTurno = false;
    }

    socket.on('cambiar turno', function(data) {
        if (timeTurno == false) {
            setTimeout(cambiarTurno, 3000);
            timeTurno = 'true'
        }
    })

    if (timeTurno == false) {
        setTimeout(cambiarTurno, 3000);
        timeTurno = 'true'
    }
    socket.on('send message', function(data) {
        io.sockets.emit('new message', {
            msg: data,
            nick: socket.nickname
        });
    });
    socket.on('new user', function(data, callback) {
        if (data in nicknames) {
            callback(false);
        } else {
            callback(true);
            socket.nickname = data;
            nicknames[socket.nickname] = 1;
            updateNickNames();
        }
    });
    socket.on('disconnect', function(data) {
        if (!socket.nickname) return;
        delete nicknames[socket.nickname];
        updateNickNames();
    });
    socket.on('set player blancas', function(data) {
        jugadorBlancas = socket.nickname;
        if (jugadorBlancas != '' && jugadorNegras != '') {
            io.sockets.emit('empieza el juego')

        }
        if (socket.nickname) {
            io.sockets.emit('player blancas', {
                nick: jugadorBlancas
            });
        } else {
            return 'error';
        }
    });
    socket.on('set player negras', function(data) {
        jugadorNegras = socket.nickname;
        if (jugadorBlancas != '' && jugadorNegras != '') {
            console.log("asdsad")
        }
        if (socket.nickname) {
            io.sockets.emit('player negras', {
                nick: jugadorNegras
            });
        } else {
            return 'error';
        }
    });
    socket.on('validate player blancas', function(data) {
        if (data == socket.nickname) {
            io.sockets.emit('check player blancas', true);
        } else {
            io.sockets.emit('check player blancas', false);
        }
    });
    socket.on('validate player negras', function(data) {
        if (data == socket.nickname) {
            io.sockets.emit('check player negras', true);
        } else {
            io.sockets.emit('check player negras', false);
        }
    });
    socket.on('update tablero', function(data) {
        io.sockets.emit('refresh tablero', data);
    });

    function updateNickNames() {
        io.sockets.emit('usernames', nicknames);
        io.sockets.emit('player blancas', {
            nick: jugadorBlancas
        });
        io.sockets.emit('player negras', {
            nick: jugadorNegras
        });
    }
})

app.use(express.static(__dirname + "/"));
io.on("connection", function(socket) {


})
app.get("/", function(req, res) {
    res.sendFile(__dirname + "/tablero.html")
});
