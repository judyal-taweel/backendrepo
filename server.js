'use strict';

const PORT = 3000;

const express =require('express');
const cors = require('cors');


const app = express();
app.use(cors());

app.get('/location',handlelocation);
app.get('/weather',handleweather);

function handlelocation(request,response){
    const city = request.query.city;
    const getLocation = require('./data/location.json');
    const newlocation = new Location(getLocation[0])
    response.send(newlocation);
}


function Location(data) {
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

    app.use('*', (request, response) => {
        let status =404;
        response.status(status).send({status:status , msg:'Not found'});
      });
      