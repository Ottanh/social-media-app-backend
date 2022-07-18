"use strict";
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
Object.defineProperty(exports, "__esModule", { value: true });
exports.secretClient = exports.s3Client = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const client_secrets_manager_1 = require("@aws-sdk/client-secrets-manager");
const REGION = "eu-north-1";
const s3Client = new client_s3_1.S3Client({
    region: REGION,
});
exports.s3Client = s3Client;
const secretClient = new client_secrets_manager_1.SecretsManager({
    region: REGION
});
exports.secretClient = secretClient;
