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

//Set up the API key instead of using the full key in every call
var APIKey = "a0aca8a89948154a4182dcecc780b513";
// Display the curent and future weather to the user after grabing the city form the input text box.
function displayWeather(event) {
    event.preventDefault();
    if (cityEl.val().trim() !== "") {
        city = cityEl.val().trim();
        currentWeather(city);
    }
}
// Using ajax call instead of fetch because I am more familiar with it
function currentWeather(city) {

    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&APPID=" + APIKey;
    $.ajax({
        url: queryURL,
        method: "GET",
    }).then(function (response) {



        var weathericon = response.weather[0].icon;
        var iconurl = "https://openweathermap.org/img/wn/" + weathericon + "@2x.png";


        var date = new Date(response.dt * 1000).toLocaleDateString();


        $(currentCity).html(response.name + "(" + date + ")" + "<img src=" + iconurl + ">");


        var tempF = (response.main.temp - 273.15) * 1.80 + 32;
        $(currentTemp).html((tempF).toFixed(2) + "&#8457");

        // Display Humidity
        $(currentHumidty).html(response.main.humidity + "%");

        //Display Wind speed
        var ws = response.wind.speed;
        var windsmph = (ws * 2.237).toFixed(1);
        $(windSpeed).html(windsmph + "MPH");
        // Display UVIndex.
        UVIndex(response.coord.lon, response.coord.lat);
        forecast(response.id);
        if (response.cod == 200) {
            sCity = JSON.parse(localStorage.getItem("cityname"));

            if (sCity == null) {
                sCity = [];
                sCity.push(city.toUpperCase()
                );
                localStorage.setItem("cityname", JSON.stringify(sCity));
                addToList(city);
            }
            else {
                if (find(city) > 0) {
                    sCity.push(city.toUpperCase());
                    localStorage.setItem("cityname", JSON.stringify(sCity));
                    addToList(city);
                }
            }
        }

    });
}

//returnning the UVIindex response.
function UVIndex(ln, lt) {

    var uvqURL = "https://api.openweathermap.org/data/2.5/uvi?appid=" + APIKey + "&lat=" + lt + "&lon=" + ln;
    $.ajax({
        url: uvqURL,
        method: "GET"
    }).then(function (response) {
        $(uvIndex).html(response.value);
    });
}

// 5 day forcast
function forecast(cityid) {
    var dayover = false;
    var queryforcastURL = "https://api.openweathermap.org/data/2.5/forecast?id=" + cityid + "&appid=" + APIKey;
    $.ajax({
        url: queryforcastURL,
        method: "GET"
    }).then(function (response) {

        for (i = 0; i < 5; i++) {
            var date = new Date((response.list[((i + 1) * 8) - 1].dt) * 1000).toLocaleDateString();
            var iconcode = response.list[((i + 1) * 8) - 1].weather[0].icon;
            var iconurl = "https://openweathermap.org/img/wn/" + iconcode + ".png";
            var tempK = response.list[((i + 1) * 8) - 1].main.temp;
            var tempF = (((tempK - 273.5) * 1.80) + 32).toFixed(2);
            var humidity = response.list[((i + 1) * 8) - 1].main.humidity;

            $("#fDate" + i).html(date);
            $("#fImg" + i).html("<img src=" + iconurl + ">");
            $("#fTemp" + i).html(tempF + "&#8457");
            $("#fHumidity" + i).html(humidity + "%");
        }

    });
}

// past city for search history
function addToList(c) {
    var listEl = $("<li>" + c.toUpperCase() + "</li>");
    $(listEl).attr("class", "list-group-item");
    $(listEl).attr("data-value", c.toUpperCase());
    $(".list-group").append(listEl);
}
// display the past search again when clicked
function invokePastSearch(event) {
    var liEl = event.target;
    if (event.target.matches("li")) {
        city = liEl.textContent.trim();
        currentWeather(city);
    }
}

// render function
function loadlastCity() {
    $("ul").empty();
    var sCity = JSON.parse(localStorage.getItem("cityname"));
    if (sCity !== null) {
        sCity = JSON.parse(localStorage.getItem("cityname"));
        for (i = 0; i < sCity.length; i++) {
            addToList(sCity[i]);
        }
        city = sCity[i - 1];
        currentWeather(city);
    }

}
//Clear the search history
function clearHistory(event) {
    event.preventDefault();
    sCity = [];
    localStorage.removeItem("cityname");
    document.location.reload();

}

$("#search-button").on("click", displayWeather);
$(document).on("click", invokePastSearch);
$(window).on("load", loadlastCity);
$("#clear-history").on("click", clearHistory);
