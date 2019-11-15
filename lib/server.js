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

async function server(queueName) {
  if (ch === undefined) {
    await sleep(1000);
    return await server(queueName);
  }
  ch.consume(queueName, async msg => {
    const content = msg.content.toString();
    logger.warn(`server start task: `, content);
    await sleep(10000);
    logger.error(`server complete task: `, content);
    ch.ack(msg);
  });
  logger.info('server is waiting message');
}

module.exports = server