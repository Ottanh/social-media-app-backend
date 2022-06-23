import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client } from "../../libs/s3Client";


export const getSignedPut = async (fileName: string) => {
  const bucketParams = {
    Bucket: `sma-bucket`,
    Key: fileName
  };

  const command = new PutObjectCommand(bucketParams);
  const signedUrl = await getSignedUrl(s3Client, command, {
    expiresIn: 3600,
  });

  return signedUrl;
};

export const getSignedGet = async (fileName: string) => {
  const bucketParams = {
    Bucket: `sma-bucket`,
    Key: fileName
  };

  const command = new GetObjectCommand(bucketParams);
  const signedUrl = await getSignedUrl(s3Client, command, {
    expiresIn: 3600,
  });

  return signedUrl;
};
