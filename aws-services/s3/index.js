const { S3 } = require('aws-sdk');

const listObjectsV2 = ({region, params}) =>
(new S3({ region }))
    .listObjectsV2(params)
    .promise();

const deleteObjects = ({region, params}) =>
(new S3({ region }))
    .deleteObjects(params)
    .promise()
    .then(data => {
      if (data.Deleted.length === 1000) {
        return deleteObjectsFromBucket(params);
      }
      return data;
    });

const emptyBucketFolder = async ({ region, listParams, deleteParams }) => {    
    const keys = await listObjectsV2({ region, listParams });
    if (keys.Contents.length === 0) {
        return Promise.resolve(`Nothing to delete from : ${listParams.prefix}`);
    }
    
    const deleteObjectsParams = {
        ...deleteParams,
        Delete: {
        Objects: [],
        },
    };
    
    keys.Contents.map(content =>
        deleteObjectsParams.Delete.Objects.push({ Key: content.Key })
    );

    return deleteObjects({region, deleteObjectsParams});
    };
      

module.exports = { listObjectsV2, deleteObjects, emptyBucketFolder };

