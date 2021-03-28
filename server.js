'use strict';

const PORT = 3000;

const express =require('express');
const cors = require('cors');

const app = express();
app.use(cors());

app.get('/location',handlelocation);
app.get('/weather',handleweather);

function handlelocation(request,response){
    const getLocation = require('./data/location.json');
    const city = request.query.city;
    let obj = {
        name: getLocation[0].display_name,
        search_query: city,
        formatted_query : city,
        latitude : getLocation[0].lat,
        longitude : getLocation[0].lon
    };
    response.send(obj);
}


function handleweather(request,response){
    const data = require('./data/weather.json');
    const weathers = data.weather;
    const weatherResponse = [];
    weathers.forEach(item => {
        const current = item.weather;
        weatherResponse.push({
            weather = current.description,    
        })
        datetime = current.datetime;
        
    });
    response.send(weatherResponse);

    }

    app.listen(PORT, ()=> console.log(`App is running on Server on port: ${PORT}`));
