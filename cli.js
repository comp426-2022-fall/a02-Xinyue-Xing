#!/usr/bin/env node
// Dependencies
import minimist from 'minimist';
import moment from 'moment-timezone';
import fetch from 'node-fetch';
// Use minimist to process one argument `--port=` on the command line after `node server.js`.
const args = minimist(process.argv.slice(2));
console.log(args);
// Default action
if(args.h){
    try{console.log(`Usage: galosh.js [options] -[n|s] LATITUDE -[e|w] LONGITUDE -z TIME_ZONE
    -h            Show this help message and exit.
    -n, -s        Latitude: N positive; S negative.
    -e, -w        Longitude: E positive; W negative.
    -z            Time zone: uses tz.guess() from moment-timezone by default.
    -d 0-6        Day to retrieve weather: 0 is today; defaults to 1.
    -j            Echo pretty JSON from open-meteo API and exit.
    `)
    process.exit(0);}
    catch (err) {
        process.exit(1);
    }
}

var latitude = args.n || args.s * -1;;
var longitude = args.e || args.w * -1;

var timezone = moment.tz.guess();
if (args.z) {
    timezone = args.z;
}

const url = 'https://api.open-meteo.com/v1/forecast?latitude=' + latitude + '&longitude=' + longitude + '&daily=weathercode,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum,precipitation_hours,windspeed_10m_max,windgusts_10m_max,winddirection_10m_dominant&current_weather=true&temperature_unit=fahrenheit&windspeed_unit=mph&precipitation_unit=inch&timezone=' + timezone;

const response = await fetch(url);

const data = await response.json();

if (args.j) {
    console.log(data);
    process.exit(0);
}

var days = 1;

if (args.d + 1) {
    days = args.d 
}

if (data.daily.precipitation_hours[days] != 0.0) {
    console.log("You might need your galoshes");
} else{
    console.log("You will not need your galoshes");
}

if (days == 0) {
    console.log("today.")
  } else if (days > 1) {
    console.log("in " + days + " days.")
  } else {
    console.log("tomorrow.")
  }

  