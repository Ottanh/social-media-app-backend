/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */

import { S3Client } from "@aws-sdk/client-s3";
import { SecretsManager } from '@aws-sdk/client-secrets-manager';


const REGION = "eu-north-1"; 

const s3Client = new S3Client({ 
  region: REGION,  
});

const secretClient = new SecretsManager({
  region: REGION
});


export { s3Client, secretClient };

