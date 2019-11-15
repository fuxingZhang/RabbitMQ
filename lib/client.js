'use strict';

const amqp = require('amqplib');
const logger = require('../util/logger');
const sleep = n => new Promise((resolve, reject) => setTimeout(resolve, n));
let ch;

async function init() {
  const conn = await amqp.connect('amqp://localhost');
  process.once('SIGINT', conn.close.bind(conn));
  ch = await conn.createChannel();
}
init().catch(console.error);

async function client(queueName, data) {
  if (ch === undefined) {
    await sleep(1000);
    return await client(queueName, data);
  }
  ch.sendToQueue(queueName, Buffer.from(JSON.stringify(data)));
  logger.info('client add task:', data);
}

module.exports = client