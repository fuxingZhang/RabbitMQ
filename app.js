const server = require('./lib/server');
const client = require('./lib/client');
const logger = require('./util/logger');
const queueName = 'test';

const sleep = n => new Promise((resolve, reject) => setTimeout(resolve, n));

async function test() {
  // 消费者：服务端监听并处理消息
  server(queueName);

  // 客户端向消息队列发送消息
  let i = 1;
  await sleep(1000);
  client(queueName, `task${i}`);
  await sleep(2000);
  client(queueName, `task${i++}`);
  await sleep(3000);
  client(queueName, `task${i++}`);
}

test().catch(console.error);