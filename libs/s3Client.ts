/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */

// Create service client module using ES6 syntax.
import { S3Client } from "@aws-sdk/client-s3";
import config from "../src/config";
// Set the AWS Region.
const REGION = "eu-north-1"; //e.g. "us-east-1"
// Create an Amazon S3 service client object.
const s3Client = new S3Client({ 
  region: REGION,  
  credentials:{
    accessKeyId: config.S3_ACCESSKEY,
    secretAccessKey: config.S3_SECRETACCESSKEY
}
});
export { s3Client };

