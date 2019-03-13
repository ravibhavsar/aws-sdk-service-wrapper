# AWS SDK Service Wrapper

Wrapper around [aws-sdk](https://www.npmjs.com/package/aws-sdk) services.

## Introduction

[aws-sdk-service-wrapper] is a wrapper around aws service functions.
e.g sns service: publish function
When [aws-sdk] is widely used in the project, (especially in serverless lambda), logic needs to be written to call `.promise()` function for each services you use. And also handling of the aws error gets repetitive.
To avoid this, this wrapper can be used.

The wrapper will also have AWS custom service extention feature such as function combining two functions etc.
eg emptyFolderKey :- combine S3 listing and deleting


## Installation
Using npm
```
npm install -s aws-sdk-service-wrapper
```

Using yarn
```
yarn add aws-sdk-service-wrapper
```

## AWS Services

AWS Service               | 	Functions
--------------------------|-----------------------
SNS                       | publish
