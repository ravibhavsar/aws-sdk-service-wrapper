import proxyquire from 'proxyquire';
import sinon from 'sinon';
import { InternalServerError } from 'http-custom-errors';

describe('snsClient', () => {
  let sandbox = null;
  let snsClient = null;
  let stubbedPublish = null;

  before(() => {
    sandbox = sinon.createSandbox();
    stubbedPublish = sandbox.stub();
    const MockedSns = function () {
      this.publish = stubbedPublish;
    };
    snsClient = proxyquire(`${SRC}/sns/index`, {
      'aws-sdk': { SNS: MockedSns },
    });
  });

  afterEach(() => sandbox.restore());

  it('should publish messages successfully', () => {
    stubbedPublish.returns({ promise: () => Promise.resolve('hello') });
    return snsClient.publish({
      message: { title: 'some title' },
      topicArn: 'topicArn',
      region: 'us-west-1',
    })
      .then((data) => {
        stubbedPublish.should.have.been.calledWith({
          Message: '{"title":"some title"}',
          TopicArn: 'topicArn',
        });
        data.should.eql('hello');
      });
  });

  it('should throw interal server error if failed', () => {
    stubbedPublish.returns({ promise: () => Promise.reject(new Error('original aws error')) });
    return snsClient.publish({
      message: { title: 'some title' },
      topicArn: 'topicArn',
      region: 'us-west-1',
    })
      .catch((err) => {
        stubbedPublish.should.have.been.calledWith({
          Message: '{"title":"some title"}',
          TopicArn: 'topicArn',
        });
        err.should.be.instanceof(InternalServerError);
      });
  });
});
