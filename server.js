const net = require('net');
const amqp = require('amqplib/callback_api');

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
            let received = buffered.split(splitter);
            while (received.length > 1) {
                // console.log("Completed", received[0]);
                // Send to queue for later processing.
                addMessageToQueue(received[0]);
                // Fully received. inform Device that completion is reached.
                sock.write("REC\n");
                // Remove from buffer and continue receiving
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

function addMessageToQueue(msg) {
    amqp.connect('amqp://localhost', function (error0, connection) {
        if (error0) {
            throw error0;
        }
        connection.createChannel(function (error1, channel) {
            if (error1) {
                throw error1;
            }
            const queue = 'device_logs';

            channel.assertQueue(queue, {
                durable: false
            });

            channel.sendToQueue(queue, Buffer.from(msg));
            console.log(" [x] Sent %s", msg);
        });
        setTimeout(function () {
            connection.close();
        }, 500);
    });
}