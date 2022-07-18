"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
const s3Client_1 = require("../libs/s3Client");
const secretName = "sma-secrets";
let secret;
const getSecrets = () => {
    return new Promise(resolve => {
        s3Client_1.secretClient.getSecretValue({ SecretId: secretName }, function (err, data) {
            if (err) {
                if (err.code === 'DecryptionFailureException') {
                    console.log(err);
                    // Secrets Manager can't decrypt the protected secret text using the provided KMS key.
                }
                else if (err.code === 'InternalServiceErrorException') {
                    console.log(err);
                    // An error occurred on the server side.
                }
                else if (err.code === 'InvalidParameterException') {
                    console.log(err);
                    // You provided an invalid value for a parameter.
                }
                else if (err.code === 'InvalidRequestException') {
                    console.log(err);
                    // You provided a parameter value that is not valid for the current state of the resource.
                }
                else if (err.code === 'ResourceNotFoundException') {
                    console.log(err);
                    // We can't find the resource that you asked for.
                }
            }
            else {
                // Decrypts secret using the associated KMS key.
                // Depending on whether the secret is a string or binary, one of these fields will be populated.
                if (data && 'SecretString' in data) {
                    secret = data.SecretString;
                }
            }
            resolve(JSON.parse(secret));
        });
    });
};
exports.default = getSecrets;
