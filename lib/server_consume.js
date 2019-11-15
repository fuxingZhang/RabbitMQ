'use strict';

const amqp = require('amqplib');
const logger = require('../util/logger');
const sleep = n => new Promise((resolve, reject) => setTimeout(resolve, n));
let ch;

async function init() {
  const conn = await amqp.connect('amqp://localhost');
  process.once('SIGINT', conn.close.bind(conn));
  ch = await conn.createChannel();
  console.log('server mq was connected');
}
init().catch(console.error);

async function server_consume(queueName) {
  if (ch === undefined) {
    console.log('server awaiting for mq connect');
    await sleep(1000);
    console.log('server_consume run retry');
    return await server_consume(queueName);
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

module.exports = server_consume