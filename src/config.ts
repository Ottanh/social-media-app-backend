import getSecrets from './secrets';


interface Config {
  MONGODB_URI: string;
  PORT: string;
  SECRET: string
}

const config = async () => {
  const PORT = process.env.PORT ? process.env.PORT : '4000';

  return new Promise<Config>(resolve => {
    getSecrets().then(secrets => {
      const MONGODB_URI = process.env.NODE_ENV === 'test'   ? secrets.TEST_MONGODB_URI  : secrets.MONGODB_URI;
      const SECRET = secrets.SECRET;
      resolve({MONGODB_URI, PORT, SECRET});
    })
    .catch(e => {
      console.log(e);
    });
  });
};


export default config();

