# Custom TCP Server
The repository contains code that implements the custom TCP protocol for Device data uploads.  
Devices upload data as Comma separated Values (CSV), each ending with a new line. On 
reception, the server adds it to a message Queue with the AMQP protocol (implemented with RabbitMq) and responds <code>REC</code> to the Device to get more data.  
Timing is implemented by the device as the server will allow devices with very power network to be able to send their data eventually.

## Server implementation
* The file [server.js](./server.js) contains the proram that is used to run the TCP server and this interacts directly with the hardware device.  
After the Data is received, it is added to the message queue and the server sends a response `REC` to notify the device that it can now send another log.
* [message_processor.js](./message_processor.js) is a message consumer and this receives the messages and converts them to JavaScript objects, which can be sent via an API or, as text through any protocal.

