var express = require('express');
var http = require('http');
var path = require('path');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

var Haml = require("haml"),
    fs = require("fs");


var arduino = require('duino'),
    board, sensor;

board = new arduino.Board({
  device: "ACM"
});

sensor = new arduino.Sensor({
  board: board,
  pin: "A0",
  throttle: 1000
});

var aPins = {}
var pins = {};

for ( i = 2; i < 13; i++) {
  pins[i] = new arduino.Led({
    board: board,
    pin: i,
  }); 
}

for ( i = 0; i < 6; i++) {
  var pinId = "A" + new String(i);

  aPins[pinId] = new arduino.Sensor({
    board: board,
    pin: pinId,
    throttle: 1000
  });
}

app.set('port', process.env.PORT || 3000);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname)));

server.listen(process.env.PORT || 3000);

console.log("defining routes");
app.get("/", function( req, res ) {
  var haml = fs.readFileSync("index.html.haml", "utf8");

  res.send(Haml.render(haml));
});

console.log("starting socket.io");
io.sockets.on('connection', function( socket ) {
  aPins["A0"].on('read', function(err, value) {
    value = +value;
    // |value| is the raw sensor output
    var data = {
      value: value,
      pinId: "A0"
    }
    socket.emit("sensor_data", data);
  });
  aPins["A1"].on('read', function(err, value) {
    value = +value;
    // |value| is the raw sensor output
    var data = {
      value: value,
      pinId: "A1"
    }
    socket.emit("sensor_data", data);
  });
  aPins["A2"].on('read', function(err, value) {
    value = +value;
    // |value| is the raw sensor output
    var data = {
      value: value,
      pinId: "A2"
    }
    socket.emit("sensor_data", data);
  });
  aPins["A3"].on('read', function(err, value) {
    value = +value;
    // |value| is the raw sensor output
    var data = {
      value: value,
      pinId: "A3"
    }
    socket.emit("sensor_data", data);
  });
  aPins["A4"].on('read', function(err, value) {
    value = +value;
    // |value| is the raw sensor output
    var data = {
      value: value,
      pinId: "A4"
    }
    socket.emit("sensor_data", data);
  });
  aPins["A5"].on('read', function(err, value) {
    value = +value;
    // |value| is the raw sensor output
    var data = {
      value: value,
      pinId: "A5"
    }
    socket.emit("sensor_data", data);
  });

  socket.on('update-pins', function( data ) {
    var message;

    for( var pin in data ) {
      console.log("pin data: " + data[pin]);

      if ( data[pin] === 1 ) {
        message = 'Turning pin ' + pin + ' on.';

        pins[pin].on();
      } else {
        message = 'Turning pin ' + pin + ' off.';
        
        pins[pin].off();
      }
    }
    // We can add error handling once we figure out how
    // duino handles errors.
    socket.emit('message', message);
  });
});

