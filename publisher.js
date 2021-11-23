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
