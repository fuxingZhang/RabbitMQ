# RabbitMQ
Examples showing how RabbitMQ is used in nodejs

## Consumer messages
There are two ways to consume messages, one is Consume and the other is Get.

* Consume: The message is pushed to the Consumer by RabbitMQ.
* Get : The client actively pulls messages from RabbitMQ. You can't loop through 'Get' instead of 'Consume', which can seriously affect performance.