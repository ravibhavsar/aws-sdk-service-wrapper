import proxyquire from 'proxyquire';
import sinon from 'sinon';

describe('s3 handler', () => {
  let sandbox = null;
  let fakeHandler = null;
  let stubbedListObjectsV2 = null;
  let stubbedDeleteObjects = null;

  before(() => {
    sandbox = sinon.createSandbox();
    stubbedListObjectsV2 = sandbox.stub();
    stubbedDeleteObjects = sandbox.stub();
    const MockedS3 = function () {
      this.listObjectsV2 = stubbedListObjectsV2;
      this.deleteObjects = stubbedDeleteObjects;
    };
  fakeHandler = proxyquire(`${SRC}/s3/index`, {
      'aws-sdk': { S3: MockedS3 },
    });
  });

  afterEach(() => sandbox.restore());

  it('should list objects successfully', async () => {
      const region = 'testRegion';
    const params = {
        Bucket: 'testBucket',
        Prefix: 'testPrefix',
      };
    stubbedListObjectsV2.returns({ promise: () => Promise.resolve('success') });
    const result = await fakeHandler.listObjectsV2({ region, params });
    stubbedListObjectsV2.should.have.been.calledWith(params);
    result.should.eql('success');
  });

  it('should delete objects successfully', async () => {
        const region = 'testRegion';
        const params = {
            Bucket: 'testBucket',
            Delete: {
                Objects: [
                    { Key: 'key1' },
                    { Key: 'key2' },
                ],
            },  
        };
        const deleteObjectsResponse = {
            Deleted: [
                { Key: 'key1' },
                { Key: 'key2' },
            ]
        }
        stubbedDeleteObjects.returns({ promise: () => Promise.resolve(deleteObjectsResponse) });
        const result = await fakeHandler.deleteObjects({ region, params });
        stubbedDeleteObjects.should.have.been.calledWith(params);
        result.should.eql(deleteObjectsResponse);
    });


    it('should empty s3 folder imaes', async () => {
        const region = 'testRegion';
        const listParams = {
          Bucket: 'testBucket',
          Prefix: 'root1',
        };
    
        const deleteObjectsParams = {
          Bucket: 'testBucket',
          Delete: {
            Objects: [
              { Key: 'root1/test1.jpg' },
              { Key: 'root1/test2.jpg' },
            ],
          },
        };
    
        const keysToDelete = {
          Contents: [
            { Key: 'root1/test1.jpg' },
            { Key: 'root1/test2.jpg' },
          ],
        };
    
        const deleteObjectsResponse = {
          Deleted: [
            { Key: 'root1/test1.jpg' },
            { Key: 'root1/test2.jpg' },
          ],
        };
    
        stubbedListObjectsV2.returns({ promise: () => Promise.resolve(keysToDelete) });
        stubbedDeleteObjects.returns({ promise: () => Promise.resolve(deleteObjectsResponse) });
        const result = await fakeHandler.emptyBucketFolder({ region, listParams, deleteObjectsParams });
        result.should.eql(deleteObjectsResponse);
      });
    
});
