/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { secretClient } from '../libs/s3Client';

const secretName = "sma-secrets";
let secret: string;

export interface Secrets {
  DEV_MONGODB_URI: string;
  TEST_MONGODB_URI: string;    
  MONGODB_URI: string;
  JWT_SECRET: string;
}

const getSecrets = () => {
  return new Promise<Secrets>(resolve => {
    secretClient.getSecretValue({SecretId: secretName}, function(err, data) {
      if (err) {
        if (err.code === 'DecryptionFailureException'){
          // Secrets Manager can't decrypt the protected secret text using the provided KMS key.
          console.log(err);
        }
				else if (err.code === 'InternalServiceErrorException'){
          // An error occurred on the server side.
					console.log(err);
				}
				else if (err.code === 'InvalidParameterException'){
          // You provided an invalid value for a parameter.
					console.log(err);
				}
				else if (err.code === 'InvalidRequestException'){
          // You provided a parameter value that is not valid for the current state of the resource.
					console.log(err);
				}
				else if (err.code === 'ResourceNotFoundException'){
          // We can't find the resource that you asked for.
					console.log(err);
				}
      }
      else {
        // Decrypts secret using the associated KMS key.
        // Depending on whether the secret is a string or binary, one of these fields will be populated.
        if (data && 'SecretString' in data) {
          secret = data.SecretString as string;
        }
      }
      resolve(JSON.parse(secret) as Secrets);
    });
	});
};

export default getSecrets;


