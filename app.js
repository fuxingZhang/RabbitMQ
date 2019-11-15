const server_consume = require('./lib/server_consume');
const client_send = require('./lib/client_send');
const logger = require('./util/logger');
const queueName = 'test';

const sleep = n => new Promise((resolve, reject) => setTimeout(resolve, n));

async function test() {
  // 消费者：服务端监听并处理消息
  server_consume(queueName);

  // 客户端向消息队列发送消息
  let i = 1;
  client_send(queueName, `task${i++}`);
  await sleep(2000);
  client_send(queueName, `task${i++}`);
  await sleep(3000);
  client_send(queueName, `task${i++}`);
}

test().catch(console.error);

process.on('uncaughtException', async err => {
  await logger.error(err);
  process.exit();
});

process.on('unhandledRejection', async (err, reason) => {
  await logger.error(err, reason);
  process.exit();
});