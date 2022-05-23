import 'dotenv/config';

const MONGODB_URI = process.env.MONGODB_URI;
if(!MONGODB_URI) {
  throw new TypeError('MONGODB_URI is undefined');
}

const SECRET = process.env.SECRET;
if(!SECRET) {
  throw new TypeError('MONGODB_URI is undefined');
}

export default { MONGODB_URI, SECRET };

