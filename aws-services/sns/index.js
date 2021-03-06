const { SNS } = require('aws-sdk');

const publish = ({ region, topicArn, message}) => (
  (new SNS({ region })).publish({
    Message: JSON.stringify(message),
    TopicArn: topicArn,
  }).promise()
);

module.exports = { publish };