"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSignedDelete = exports.getSignedGet = exports.getSignedPut = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const s3Client_1 = require("../../libs/s3Client");
const getSignedPut = (fileName) => __awaiter(void 0, void 0, void 0, function* () {
    const bucketParams = {
        Bucket: `sma-bucket`,
        Key: fileName
    };
    const command = new client_s3_1.PutObjectCommand(bucketParams);
    const signedUrl = yield (0, s3_request_presigner_1.getSignedUrl)(s3Client_1.s3Client, command, {
        expiresIn: 3600,
    });
    return signedUrl;
});
exports.getSignedPut = getSignedPut;
const getSignedGet = (fileName) => __awaiter(void 0, void 0, void 0, function* () {
    const bucketParams = {
        Bucket: `sma-bucket`,
        Key: fileName
    };
    const command = new client_s3_1.GetObjectCommand(bucketParams);
    const signedUrl = yield (0, s3_request_presigner_1.getSignedUrl)(s3Client_1.s3Client, command, {
        expiresIn: 3600,
    });
    return signedUrl;
});
exports.getSignedGet = getSignedGet;
const getSignedDelete = (fileName) => __awaiter(void 0, void 0, void 0, function* () {
    const bucketParams = {
        Bucket: `sma-bucket`,
        Key: fileName
    };
    const command = new client_s3_1.DeleteObjectCommand(bucketParams);
    const signedUrl = yield (0, s3_request_presigner_1.getSignedUrl)(s3Client_1.s3Client, command, {
        expiresIn: 3600,
    });
    return signedUrl;
});
exports.getSignedDelete = getSignedDelete;
