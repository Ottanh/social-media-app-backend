import 'dotenv/config';

const MONGODB_URI = process.env.MONGODB_URI;
if(!MONGODB_URI) {
  throw new TypeError('MONGODB_URI is undefined');
}

const SECRET = process.env.SECRET;
if(!SECRET) {
  throw new TypeError('SECRET is undefined');
}

const S3_ACCESSKEY = process.env.S3_ACCESSKEYID;
if(!S3_ACCESSKEY) {
  throw new TypeError('S3_ACCESSKEY is undefined');
}

const S3_SECRETACCESSKEY = process.env.S3_SECRETACCESSKEY;
if(!S3_SECRETACCESSKEY) {
  throw new TypeError('S3_SECRETACCESSKEY is undefined');
}

export default { MONGODB_URI, SECRET, S3_ACCESSKEY, S3_SECRETACCESSKEY };

