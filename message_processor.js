#!/usr/bin/env node

const amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', function (error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function (error1, channel) {
        if (error1) {
            throw error1;
        }

        var queue = 'device_logs';

        channel.assertQueue(queue, {
            durable: false
        });

        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

        channel.consume(queue, function (msg) {
            let csv_log = msg.content.toString();
            csv_log = csv_log.split(',');
            let log_obj = {
                time: csv_log[0],
                sv: csv_log[1],
                sc: csv_log[2],
                bv: csv_log[3],
                pv: csv_log[4],
                pc: csv_log[5],
                lat: csv_log[6],
                lon: csv_log[7],
                tr: csv_log[8],  // room temp
                tb: csv_log[9],  // battery temp
                imei: csv_log[10]
            }
            console.log(" [x] Received:", log_obj);

            // call api to send to Remote


        }, {
            noAck: true
        });
    });
});