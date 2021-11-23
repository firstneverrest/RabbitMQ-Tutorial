const amqp = require('amqplib');

async function connect() {
  try {
    // connect rabbitmq
    const connection = await amqp.connect('amqp://localhost:5672');

    // create a channel
    const channel = await connection.createChannel();

    // create a queue
    const result = await channel.assertQueue('jobs');

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
