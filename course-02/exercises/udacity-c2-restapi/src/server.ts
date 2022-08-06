import 'dotenv/config'
import express from 'express';
import { sequelize } from './sequelize';

import { IndexRouter } from './controllers/v0/index.router';

import bodyParser from 'body-parser';

import { V0MODELS } from './controllers/v0/model.index';

import cors from 'cors';

(async () => {
  await sequelize.addModels(V0MODELS);
  await sequelize.sync();

  const app = express();
  const port = process.env.PORT || 8080; // default port to listen
  
  // add a list of allowed origins
  const allowedOrigins = [
    'http://localhost:8100', // local development
    'http://localhost:4200',
    'http://my-080220473863-bucket.s3-website-us-east-1.amazonaws.com' // ionic frontend on s3 bucket
  ];
  const options : cors.CorsOptions = {
    origin: allowedOrigins
  };

  // pass these options to cors
  app.use(cors(options))

  app.use(bodyParser.json());

  //CORS Should be restricted
  app.use(function(req, res, next) {
    //res.header("Access-Control-Allow-Origin", "http://localhost:8100");
    //res.header("Access-Control-Allow-Origin", "http://udagram-waweru-dev.us-east-1.elasticbeanstalk.com");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
  });

  app.use('/api/v0/', IndexRouter)

  // Root URI call
  app.get( "/", async ( req, res ) => {
    res.send( "/api/v0/" );
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
      console.log(process.env.AWS_REGION)
  } );
})();