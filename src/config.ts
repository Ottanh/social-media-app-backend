import getSecrets from './secrets';


interface Config {
  MONGODB_URI: string;
  PORT: string;
  JWT_SECRET: string
}

const config = async () => {
  const PORT = process.env.PORT ? process.env.PORT : '4000';

  return new Promise<Config>(resolve => {
    getSecrets().then(secrets => {
      let MONGODB_URI;
      switch(process.env.NODE_ENV){
        case 'test':
          MONGODB_URI = secrets.TEST_MONGODB_URI;
          break;
        case 'development':
          MONGODB_URI = secrets.DEV_MONGODB_URI;
          break;
        default:
          MONGODB_URI = secrets.MONGODB_URI;
          break;
      }
      const JWT_SECRET = secrets.JWT_SECRET;
      resolve({MONGODB_URI, PORT, JWT_SECRET});
    })
    .catch(e => {
      console.log(e);
    });
  });
};


export default config();

