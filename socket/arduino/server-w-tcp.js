/**
 * Important note: this application is not suitable for benchmarks!
 */

var http = require('http')
  , net = require('net')
  , url = require('url')
  , fs = require('fs')
  , io = require('socket.io')
  , sys = require(process.binding('natives').util ? 'util' : 'sys')
  , server;
  
var tcpGuests = [];
var chatGuests = [];

server = http.createServer(function(req, res){
  // your normal server code
  var path = url.parse(req.url).pathname;
  switch (path){
    case '/':
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write('<h1>Welcome. Try the <a href="/arduino.html">Arduino</a> example.</h1>');
      res.end();
      break;
      
    case '/json.js':
    case '/arduino.html':
      fs.readFile(__dirname + path, function(err, data){
        if (err) return send404(res);
        res.writeHead(200, {'Content-Type': path == 'json.js' ? 'text/javascript' : 'text/html'})
        res.write(data, 'utf8');
        res.end();
      });
      break;
      
    default: send404(res);
  }
}),

send404 = function(res){
  res.writeHead(404);
  res.write('404');
  res.end();
};

server.listen(8090);



// socket.io, I choose you
// simplest chat application evar
var io = io.listen(server)
  , buffer = [];
  
io.on('connection', function(client){
  client.send({ buffer: buffer });
  client.broadcast.send({ announcement: client.sessionId + ' connected' });
  
  chatGuests.push(client);
  
  client.on('message', function(message){
    var msg = { message: [client.sessionId, message] };
    buffer.push(msg);
    if (buffer.length > 15) buffer.shift();
    client.broadcast.send(msg);
    
    //send msg to tcp connections
    for (g in tcpGuests) {
        tcpGuests[g].write(message);
    }
  });

  client.on('disconnect', function(){
    client.broadcast.send({ announcement: client.sessionId + ' disconnected' });
  });
});

//tcp socket server
var tcpServer = net.createServer(function (socket) {
  console.log('tcp server running on port 1337');
  console.log('web server running on http://localhost:8090');
});

tcpServer.on('connection',function(socket){
    socket.write('connected to the tcp server\r\n');
    console.log('num of connections on port 1337: ' + tcpServer.connections);
    
    tcpGuests.push(socket);
    
    socket.on('data',function(data){
        console.log('received on tcp socket:'+data);
        socket.write('msg received\r\n');
        
        //send data to guest socket.io chat server
        for (g in io.clients) {
            var client = io.clients[g];
            client.send({message:["arduino",data.toString('ascii',0,data.length)]});
            
        }
    })
});
tcpServer.listen(1337);