var net = require('net');

var serverA = net.createServer();

serverA.on('connection',function(socket){
    socket.write('Howdy\r\n');
    console.log('num of connections on port 1337: ' + serverA.connections);
    
    socket.on('data',function(data){
        console.log(socket.remoteAddress + ':' + socket.remotePort + '  ' +data);
        socket.write(socket.remoteAddress + ':' + socket.remotePort + ' said: ' + data + '\r\n');
    });
});

serverA.listen(1337);
console.log('tcp server running on port 1337');
