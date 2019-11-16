'use strict';

const amqp = require('amqplib');
const logger = require('../util/logger');
const sleep = n => new Promise((resolve, reject) => setTimeout(resolve, n));
let ch;

async function init() {
  const conn = await amqp.connect('amqp://localhost');
  process.once('SIGINT', conn.close.bind(conn));
  ch = await conn.createConfirmChannel();
  logger.info('client has connected to mq');
  await ch.assertQueue(queueName, { durable: false });
}
init().catch(console.error);

async function client_send(queueName, msg) {
  if (ch === undefined) {
    logger.info('client_send is waiting to connect to mq');
    await sleep(1000);
    logger.info('client_send tries to run again');
    return await client_send(queueName, msg);
  }
  await ch.sendToQueue(queueName, Buffer.from(msg)); 
  /**
   * Resolves the promise, or invokes the callback, when all published messages have been confirmed. 
   * If any of the messages has been nacked, this will result in an error; otherwise the result is no value. 
   * Either way, the channel is still usable afterwards. 
   * It is also possible to call waitForConfirms multiple times without waiting for previous invocations to complete.
   */
  // await ch.waitForConfirms();
  logger.info('client add task:', msg);
}

module.exports = client_send