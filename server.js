'use strict';
require("dotenv").config();
const superagent = require('superagent');

const PORT = process.env.PORT;

const express =require('express');
const cors = require('cors');


const app = express();
app.use(cors());

app.get('/location',handlelocation);
app.get('/weather',handleweather);

const myLocalLocations = {};

function handlelocation(request,response){
    const city = request.query.city;

    if (myLocalLocations[city]) {
        response.send(myLocalLocations[city]);
      
      } else {    let key = process.env.GEOCODE_API_KEY;
        const url = `https://us1.locationiq.com/v1/search.php?key=${key}&q=${city}&format=json&limit=1`;
        superagent.get(url).then(res=> {
          const locationData = res.body[0];
          const location = new Location(city, locationData);
          myLocalLocations[city] = location;
          response.send(location);
    
        }).catch((err)=> {
          console.log("ERROR IN LOCATION API");
          console.log(err)
        });
      
    
    }
    // const getLocation = require('./data/location.json');
    // const newlocation = new Location(city , getLocation[0])
    // response.send(newlocation);
}


function Location(data) {
    this.search_query = city;
    this.formatted_query = data.display_name;
    this.latitude = data.lat;
    this.longitude = data.lon;
}
function Weather(data) {
    this.forecast = data.Weather.description;
    this.datetime = data.datetime;
}

function handleweather(request,response){
    const data = require('./data/weather.json');

    const weatherResponse = [];
    data.data.forEach(item => {
        weatherResponse.push({
            forecast:item.weather.description,
            datetime:item.datetime
            
        }
        )
        console.log(weatherResponse);
    });
    response.send(weatherResponse);

    }

    app.listen(PORT, ()=> console.log(`App is running on Server on port: ${PORT}`));

    // app.use('*', (request, response) => {
    //     let status =404;
    //     response.status(status).send({status:status , msg:'Not found'});
    //   });

    app.use('*', notFoundHandler); // 404 not found url
 
app.use(errorHandler);

function notFoundHandler(request, response) {
  response.status(404).send('requested API is Not Found!');
}

function errorHandler(err, request, response, next) {
  response.status(500).send('something is wrong in server');
}

      