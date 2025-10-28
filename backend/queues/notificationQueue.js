const Queue = require('bull');
const sendNotification = require('../utils/sendNotification');

const notificationQueue = new Queue('notifications', {
  redis: { host: '127.0.0.1', port: 6379 },
});

notificationQueue.process(async (job) => {
  await sendNotification(job.data);
});

module.exports = notificationQueue;
