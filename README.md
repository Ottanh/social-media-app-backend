# Back end for [social media app](https://github.com/Ottanh/social-media-app)
Backend for a twitter like social media website.

## Requirements
* AWS S3 bucket called 'sma-bucket'
* AWS Secrests Manager containing 'sma-secrets' with following keys:    
  * MONGODB_URI
  * DEV_MONGODB_URI
  * TEST_MONGODB_URI
  * JWT_SECRET
  
## Run locally
`npm install`  
`npm run dev`   

## Production build:  
`npm run tsc`  
`npm start`  

## Tests
Integration tests made with Jest and ApolloServer's executeOperation()    

`npm run test-user`   
`npm run test-post`   

## Tech stack
<a href="https://www.typescriptlang.org/" title="Typescript"><img src="https://github.com/get-icon/geticon/raw/master/icons/typescript-icon.svg" alt="Typescript" width="21px" height="21px"></a>
<a href="https://nodejs.org/" title="Node.js"><img src="https://github.com/get-icon/geticon/raw/master/icons/nodejs-icon.svg" alt="Node.js" width="21px" height="21px"></a>
<a href="https://www.mongodb.org/" title="MongoDB"><img src="https://github.com/get-icon/geticon/raw/master/icons/mongodb-icon.svg" alt="MongoDB" width="21px" height="21px"></a>
<a href="https://graphql.org/" title="GraphQL"><img src="https://github.com/get-icon/geticon/raw/master/icons/graphql.svg" alt="GraphQL" width="21px" height="21px"></a>
<a href="https://www.apollographql.com/" title="Apollo"><img src="https://github.com/get-icon/geticon/raw/master/icons/apollostack.svg" alt="Apollo" width="21px" height="21px"></a>
<a href="https://eslint.org/" title="ESLint"><img src="https://github.com/get-icon/geticon/raw/master/icons/eslint.svg" alt="ESLint" width="21px" height="21px"></a>
<a href="https://jestjs.io/" title="Jest"><img src="https://github.com/get-icon/geticon/raw/master/icons/jest.svg" alt="Jest" width="21px" height="21px"></a>
<a href="https://aws.amazon.com/" title="AWS"><img src="https://github.com/get-icon/geticon/raw/master/icons/aws.svg" alt="AWS" width="21px" height="21px"></a>
