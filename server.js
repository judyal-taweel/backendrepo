'use strict';
require("dotenv").config();
const superagent = require('superagent');
const pg = require('pg');

const PORT = process.env.PORT;
const GEOCODE_API_KEY = process.env.GEOCODE_API_KEY;
const WEATHERS_API_KEY = process.env.WEATHERS_API_KEY;
const PARKS_API_KEY = process.env.PARKS_API_KEY;


const express = require('express');
const cors = require('cors');
const { query } = require("express");


const app = express();
app.use(cors());
const client = new pg.Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
      rejectUnauthorized: false
  }
}); // initialize the pg database with the url of the database


app.get('/location', handlelocation);
app.get('/weather', handleweather);
app.get('/parks', handleparks);

const client = new pg.Client(process.env.DATABASE_URL);

let citiesData = {};
client.query('select * from locations').then(data => {
    data.rows.forEach(elem => {
        citiesData[elem.query] = elem;
    });
});



function handlelocation(request, response) {
  const search_query = request.query.city;
  let sql = `SELECT * FROM locations WHERE search_query=${search_query}`;
  client.query(sql).then(result=>{
    console.log(result.rows);
  })
  const url = `https://us1.locationiq.com/v1/search.php?key=${GEOCODE_API_KEY}&q=${search_query}&format=json`;
  superagent.get(url).then(data =>{
    const newlocation = data.body.map(location=>{
      return{
        search_query: search_query,
        formatted_query: location.display_name,
        latitude: location.lat,
        longitude: location.lon

      }
    });
    let SQL = 'INSERT INTO location (search_query, formatted_query, latitude, longitude) VALUES($1, $2, $3, $4) RETURNING *';
    let values = [search_query, newlocation[0].formatted_query, newlocation[0].latitude, newlocation[0].longitude];
    client.query(SQL, values).then(result => {
    });
    response.send(newlocation[0]);
  })



}


function Location(search_query, data) {
  this.search_query = search_query;
  this.formatted_query = data.display_name;
  this.latitude = data.lat;
  this.longitude = data.lon;
}
function Weather(data) {
  this.forecast = data.weather.description;
  this.datetime = data.datetime;
}

function handleweather(request, response) {
  const query1 = request.query.search_query;
  const url = `http://api.weatherbit.io/v2.0/forecast/daily?KEY=${WEATHERS_API_KEY}&city=${query1}&country=US`;
  superagent.get(url).then(data => {
   let newArr = data.body.data.map(element =>{
      return new Weather(element);
   })
   response.send(newArr);
  });
  }


  function handleparks(request,response){
    const q = request.query.search_query;
    const url = `https://developer.nps.gov/api/v1/parks?city=${q}&api_key=${PARKS_API_KEY}&limit=10`;
    superagent.get(url).then(data => {
      const parkData = data.body.data.map(park => {
        return new Parks(park);
      });
      response.send(parkData);   
     });
   
  }

  function Parks(data){
    this.name = data.name;

    this.address = `${data.addresses[0].line1} ${data.addresses[0].city} ${data.addresses[0].stateCode} ${data.addresses[0].postalCode}`;
    this.fees ="0.00";
    this.park_url = data.url;
  }

  client.connect().then(()=>{

    app.listen(PORT, () => console.log(`App is running on Server on port: ${PORT}`));
  })



app.use('*', notFoundHandler); // 404 not found url

app.use(errorHandler);

function notFoundHandler(request, response) {
  response.status(404).send('requested API is Not Found!');
}

function errorHandler(err, request, response, next) {
  response.status(500).send('something is wrong in server');
}

