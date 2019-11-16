'use strict';

const amqp = require('amqplib');
const logger = require('../util/logger');
const sleep = n => new Promise((resolve, reject) => setTimeout(resolve, n));
let ch;

async function init() {
  const conn = await amqp.connect('amqp://localhost');
  process.once('SIGINT', conn.close.bind(conn));
  ch = await conn.createChannel();
  logger.info('client has connected to mq');
}
init().catch(console.error);

async function client_send(queueName, data) {
  if (ch === undefined) {
    logger.info('client_send is waiting to connect to mq');
    await sleep(1000);
    logger.info('client_send tries to run again');
    return await client_send(queueName, data);
  }
  ch.sendToQueue(queueName, Buffer.from(JSON.stringify(data)));
  logger.info('client add task: ', data);
}

module.exports = client_send