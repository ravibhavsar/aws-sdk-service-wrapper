import sinon from 'sinon';
import proxyquire from 'proxyquire';
import to from 'await-to-js';

describe('sqs handler', () => {
  let sandbox = null;
  let fakeHandler = null;
  let stubbedSendMessage = null;
  let stubbedDeleteMessage = null;
    
  const region = 'test-region';
  const queueUrl ='test-queue-url';
  const payload = 'test-payload';
  const receiptHandle = 'testReceiptHandle';
  const sendMessagePayload = {
    MessageBody: JSON.stringify(payload),
    QueueUrl: queueUrl,
  }
  const deleteMessagePayload = {
    QueueUrl: queueUrl,
    ReceiptHandle: receiptHandle,
  };

  before(() => {
    sandbox = sinon.createSandbox();
    stubbedSendMessage = sandbox.stub();
    stubbedDeleteMessage = sandbox.stub();
    const mockedSqs = function() {
      this.sendMessage = stubbedSendMessage;
      this.deleteMessage = stubbedDeleteMessage;
    };
    fakeHandler = proxyquire(`${SRC}/sqs/index`, {
      'aws-sdk': { SQS: mockedSqs },
    });
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should create sqs record successfully', async () => {
    stubbedSendMessage.returns({ promise: () => Promise.resolve('success') });
    const result = await fakeHandler.sendMessage({ region, queueUrl, payload });
    stubbedSendMessage.should.have.been.calledWith(sendMessagePayload);
    result.should.eql('success');
  });

  it('sendMessage should throw error if failed', async () => {
    stubbedSendMessage.returns({ promise: () => Promise.reject('error') });
    const [err] = await to(fakeHandler.sendMessage({ region, queueUrl, payload }));
    stubbedSendMessage.should.have.been.calledWith(sendMessagePayload);
    err.should.eql('error');
  });

  it('should delete sqs record successfully', async () => {
    stubbedDeleteMessage.returns({ promise: () => Promise.resolve('success') });
    const result = await fakeHandler.deleteMessage({ region, queueUrl, receiptHandle });
    stubbedDeleteMessage.should.have.been.calledWith(deleteMessagePayload);
    result.should.eql('success');
  });

  it('deleteMessage should throw interal server error if failed', async () => {
    stubbedDeleteMessage.returns({ promise: () => Promise.reject('error') });
    const [err] = await to(fakeHandler.deleteMessage({ region, queueUrl, receiptHandle }));
    stubbedDeleteMessage.should.have.been.calledWith(deleteMessagePayload);
    err.should.eql('error');
  });
});
