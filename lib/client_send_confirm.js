'use strict';

const amqp = require('amqplib');
const logger = require('../util/logger');
const sleep = n => new Promise((resolve, reject) => setTimeout(resolve, n));
let conn;

async function init() {
  const conn = await amqp.connect('amqp://localhost');
  process.once('SIGINT', conn.close.bind(conn));
  logger.info('client has connected to mq');
}
init().catch(console.error);

async function client_send(queueName, msg) {
  if (conn === undefined) {
    logger.info('client_send is waiting to connect to mq');
    await sleep(1000);
    logger.info('client_send tries to run again');
    return await client_send(queueName, msg);
  }
  const ch = await conn.createConfirmChannel();
  await ch.assertQueue(queueName, { durable: false });
  ch.sendToQueue(queueName, Buffer.from(msg));
  await ch.waitForConfirms();
  logger.info('client add task:', msg);
  ch.close();
}

module.exports = client_send