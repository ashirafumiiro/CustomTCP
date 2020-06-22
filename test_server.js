const net = require('net');
const port = 7070;
const host = '127.0.0.1';

const server = net.createServer();
server.listen(port, host, () => {
    console.log('TCP Server is running on port ' + port + '.');
});


server.on('connection', function (sock) {
    let buffered = "";
    console.log('CONNECTED: ' + sock.remoteAddress + ':' + sock.remotePort);

    sock.on('data', function (data) {
        buffered += data;
        
        // Wait untill a new line is received to signify completion
        (function processReceived() {
            let splitter = '\n'
            var received = buffered.split(splitter);
            while (received.length > 1) {
                console.log("Completed", received[0]);

                // Fully received. inform Device that complition is reached.
                sock.write("REC\n");
                // Send to queue for later processing.

                buffered = received.slice(1).join(splitter);
                received = buffered.split(splitter);
            }
        })();
    });

    // Add a 'close' event handler to this instance of socket
    sock.on('close', function (data) {
        console.log('CLOSED: ' + sock.remoteAddress + ' ' + sock.remotePort);
    });
});