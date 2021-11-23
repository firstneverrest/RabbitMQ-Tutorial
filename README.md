# RabbitMQ

RabbitMQ is an open-source message broker with advanced message queuing protocol. It gives your application a common platform to send and receive messages.

## Installation

1. Create NodeJS project with `npm init -y`.
2. Install RabbitMQ package with `npm i amqplib`.
3. Use Docker to run and test instance of RabbitMQ.

```
docker run -d --name rabbitmq -p 5672:5672 rabbitmq
```

4. Start writing publisher and consumer code

```js
// publisher.js
const amqp = require('amqplib');

const msg = { name: process.argv[2] };

async function connect() {
  try {
    // connect rabbitmq
    const connection = await amqp.connect('amqp://localhost:5672');

    // create a channel
    const channel = await connection.createChannel();

    // create a queue
    const result = await channel.assertQueue('jobs');

    // send to queue in rabbitmq
    channel.sendToQueue('jobs', Buffer.from(JSON.stringify(msg)));
    console.log(`Job sent successfully ${msg.name}`);
  } catch (e) {
    console.error(e);
  }
}

connect();
```

```js
// consumer.js
const amqp = require('amqplib');

async function connect() {
  try {
    // connect rabbitmq
    const connection = await amqp.connect('amqp://localhost:5672');

    // create a channel
    const channel = await connection.createChannel();

    // receive a message
    channel.consume('jobs', (message) => {
      const input = JSON.parse(message.content.toString());
      console.log(`Received job with input ${input.name}`);
      if (input.name === 'mint') channel.ack(message);
    });
  } catch (e) {
    console.error(e);
  }
}

connect();
```
