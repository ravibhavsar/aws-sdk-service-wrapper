const { SNS } = require('aws-sdk');

const publish = ({ message, topicArn, region }) => (
  (new SNS({ region })).publish({
    Message: JSON.stringify(message),
    TopicArn: topicArn,
  }).promise()
    .catch(err => err)
);

module.exports.SNS = { publish }
