const AWS = require('aws-sdk');

const fs = require('fs');
const config = fs.existsSync(`${__dirname}/../config.js`)? require(`${__dirname}/../config.js`) : null;

const AWS_KEY = process.env.AWSAccessKeyId ||config.AWSAccessKeyId;
const AWS_SECRET = process.env.AWSSecretKey ||config.AWSSecretKey;
const AWS_BUCKET =  process.env.AWSS3Bucket ||config.AWSS3Bucket;
const AWS_REGION =  process.env.AWSRegion ||config.AWSRegion;

module.exports = new AWS.S3({
  credentials: {
    accessKeyId: AWS_KEY,
    secretAccessKey: AWS_SECRET
  },
  region: AWS_REGION,
  params: {
    ACL: 'public-read',
    Bucket: AWS_BUCKET
  }
});
