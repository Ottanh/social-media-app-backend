/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */

import { S3Client } from "@aws-sdk/client-s3";
import config from "../src/config";

const REGION = "eu-north-1"; 

const s3Client = new S3Client({ 
  region: REGION,  
  credentials:{
    accessKeyId: config.S3_ACCESSKEY,
    secretAccessKey: config.S3_SECRETACCESSKEY
}
});
export { s3Client };

