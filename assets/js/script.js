//Creating a var to store history
var city = "";

// Declaring all variables
var cityEl = $("#search-city");
var buttonEl = $("#search-button");
var clearButton = $("#clear-history");
var currentCity = $("#current-city");
var currentTemp = $("#temperature");
var currentHumidty = $("#humidity");
var windSpeed = $("#wind-speed");
var uvIndex = $("#uv-index");
var sCity = [];

//Creating a for loop to search for the city
function find(c) {
    for (var i = 0; i < sCity.length; i++) {
        if (c.toUpperCase() === sCity[i]) {
            return -1;
        }
    }
    return 1;
}