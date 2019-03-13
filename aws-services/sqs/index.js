import { SQS } from 'aws-sdk';

const sendMessage = ({ region, queueUrl, payload}) => (
    new SQS({ region })
        .sendMessage({
            MessageBody: JSON.stringify(payload),
            QueueUrl: queueUrl,
        })
        .promise()
);


const deleteMessage = ({ region, queueUrl, receiptHandle})  => (
    new SQS({ region })
        .deleteMessage({
            QueueUrl: queueUrl,
            ReceiptHandle: receiptHandle,
        })
        .promise()
);


module.exports = { sendMessage, deleteMessage };
