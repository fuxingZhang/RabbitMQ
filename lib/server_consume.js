'use strict';

const amqp = require('amqplib');
const logger = require('../util/logger');
const sleep = n => new Promise((resolve, reject) => setTimeout(resolve, n));
let ch;

async function init() {
  const conn = await amqp.connect('amqp://localhost');
  process.once('SIGINT', conn.close.bind(conn));
  ch = await conn.createChannel();
  logger.info('server has connected to mq');
  ch.prefetch(1);
}
init().catch(console.error);

async function server_consume(queueName) {
  if (ch === undefined) {
    logger.info('server_consume is waiting to connect to mq');
    await sleep(1000);
    logger.info('server_consume tries to run again');
    return await server_consume(queueName);
  }
  await ch.assertQueue(queueName, { durable: false });
  ch.consume(queueName, async msg => {
    const content = msg.content.toString();
    logger.warn(`server start task:`, content);
    await sleep(3000);
    logger.error(`server complete task:`, content);
    ch.ack(msg);
  });
  logger.info('server is waiting for message');
}

module.exports = server_consume