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
      let MONGODB_URI;
      switch(process.env.NODE_ENV){
        case 'test':
          MONGODB_URI = secrets.TEST_MONGODB_URI;
          break;
        case 'production':
          MONGODB_URI = secrets.MONGODB_URI;
          break;
        case 'development':
          MONGODB_URI = secrets.DEV_MONGODB_URI;
          break;
        default:
          throw new Error('Invalid NODE_ENV');
      }
      const SECRET = secrets.SECRET;
      resolve({MONGODB_URI, PORT, SECRET});
    })
    .catch(e => {
      console.log(e);
    });
  });
};


export default config();

