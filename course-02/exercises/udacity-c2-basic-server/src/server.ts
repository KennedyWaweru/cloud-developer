import express, { Router, Request, Response } from 'express';
import bodyParser from 'body-parser';

import { Car, cars as cars_list } from './cars';

(async () => {
  let cars:Car[]  = cars_list;

  //Create an express application
  const app = express(); 
  //default port to listen
  const port = 8082; 
  
  //use middleware so post bodies 
  //are accessable as req.body.{{variable}}
  app.use(bodyParser.json()); 
  

  // Root URI call
  app.get( "/", ( req: Request, res: Response ) => {
    res.status(200).send("Welcome to the Cloud! guys");
  } );

  // Get a greeting to a specific person 
  // to demonstrate routing parameters
  // > try it {{host}}/persons/:the_name
  app.get( "/persons/:name", 
    ( req: Request, res: Response ) => {
      let { name } = req.params;

      if ( !name ) {
        return res.status(400)
                  .send(`name is required`);
      }

      return res.status(200)
                .send(`Welcome to the Cloud, ${name}!`);
  } );

  // Get a greeting to a specific person to demonstrate req.query
  // > try it {{host}}/persons?name=the_name
  app.get( "/persons/", ( req: Request, res: Response ) => {
    let { name } = req.query;

    if ( !name ) {
      return res.status(400)
                .send(`name is required`);
    }

    return res.status(200)
              .send(`Welcome to the Cloud, ${name}!`);
  } );

  // Post a greeting to a specific person
  // to demonstrate req.body
  // > try it by posting {"name": "the_name" } as 
  // an application/json body to {{host}}/persons
  app.post( "/persons", 
    async ( req: Request, res: Response ) => {

      const { name } = req.body;

      if ( !name ) {
        return res.status(400)
                  .send(`name is required`);
      }

      return res.status(200)
                .send(`Welcome to the Cloud, ${name}!`);
  } );


  // @TODO Add an endpoint to GET a list of cars
  // it should be filterable by make with a query paramater
  app.get('/cars/', (req: Request, res: Response) => {
    // get query parameter
    const {make} = req.query;
    if(make){
      const by_make = cars.filter((car)=>{
        return car.make === make;
      });
      return res.status(200).send(by_make);
    }
    return res.status(200).send(cars);
  });
  
    // @TODO Add an endpoint to get a specific car
  // it should require id
  // it should fail gracefully if no matching car is found
  app.get('/cars/:car_id',(req: Request, res: Response) => {
    let {car_id} = req.params;

    const to_return = cars.filter((car)=>{
      return car.id == Number(car_id);
    });

   
    if(to_return.length === 0){
      return res.status(404).send("Car not available");
    };
    
    
    return res.status(200).send(to_return);
    
   //return res.status(200).send("Sunday");
  });
  /// @TODO Add an endpoint to post a new car to our list
  // it should require id, type, model, and cost
  app.post('/cars',
  async (req: Request,res: Response) => {
    let { car_obj } = req.body;
    console.log(req.body);
    // return res.status(200).json(req.body);
    
    function isCar(obj: any) : obj is Car {
      return "make" in obj && "type" in obj && "model" in obj && "cost" in obj && "id" in obj;
    };
 
    if(isCar(req.body)){
      cars.push(req.body);
      return res.status(200).send(req.body);
    }else{
      return res.status(400).send("Car does not have all attributes");
    }
    
    return res.status(400).send(req.body); 
  });
  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();
