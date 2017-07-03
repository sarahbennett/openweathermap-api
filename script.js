const apiURL = "http://api.openweathermap.org/data/2.5/weather"
const apiKey = "6410c52bfcdfdfea3c892dda7d405055"
//need to append: ?lat={lat}&lon={lon}&APPID=6410c52bfcdfdfea3c892dda7d405055

const form = document.getElementById("apiOptions")
let debug = null

const coordinates = [
  {lat: 51.5074, lon: 0.1278}, //london
  {lat: 47.6762, lon: -122.3182} //seattle
]

var weatherInfo = []

  function buildWeatherReport() {
      var info = document.forms[0];
      var i;
      for (i = 0; i < info.length; i++) {
          if (info[i].checked) {
            weatherInfo.push(info[i].value);
          }
      }
  }

function handleSubmit () {
  event.preventDefault()
  console.log(form)
  // get form values
  var cityChoice = form.selection.value
  if (form.selection.value === "London"){
    var cityChoice = coordinates[0]
  } else {
    var cityChoice = coordinates[1]
  }
  // serialize them into a query string
  let queryString = buildQuery(cityChoice)
  // call getWeather with the query string
  console.log(queryString)
  buildWeatherReport()
  getWeather(queryString)
}

function buildQuery(cityChoice) {
  if (form.units.value == "Celcius"){
    return `${apiURL}?lat=${cityChoice.lat}&lon=${cityChoice.lon}&units=metric&APPID=${apiKey}`
  } else {
    return `${apiURL}?lat=${cityChoice.lat}&lon=${cityChoice.lon}&units=imperial&APPID=${apiKey}`}
}


function getWeather (queryString) {
  let request = new XMLHttpRequest()
  // starts talk to API - 3 params
  request.open("GET", queryString, true)
  // fires when the request is complete
  request.onload = function () {
    let response = JSON.parse(request.response);
    let description = response.weather[0].description
    let icon = response.weather[0].icon
    let temp = response.main.temp+"\u00B0"
    let humidity = response.main.humidity+"%"
    let sunsetUnix = response.sys.sunset
    let sunsetTime = moment(sunsetUnix*1000).toString()
    let sunriseUnix = response.sys.sunrise
    let sunriseTime = moment(sunsetUnix*1000).toString()

    let weatherDiv = document.getElementById("weather")
    var li = document.createElement("li");
    var i=0;
    for (i = 0; i < weatherInfo.length; i++) {
        if(weatherInfo[i] == "temperature"){
          li.innerHTML = "The current " + weatherInfo[i] + " is" + temp
        } else if (weatherInfo[i] == "weather overall"){
          li.innerHTML = "General weather description: " + description
        } else if (weatherInfo[i] == "humidity"){
          li.innerHTML = "The current " + weatherInfo[i] + " is" + humidity
        }
        weatherDiv.appendChild(li)
      }
  }
  // fires if something goes wrong
  request.error = function (errorObject) {
    console.log("Sorry, there is an error")
    console.log(errorObject)
  }
  request.send()
}

// function weatherBuilder() {
//   console.log("building the weather report!")
//   event.preventDefault();
//   var form = document.querySelector("form");
//   var newWeather = form.info.value
//   weatherInfo.weather.push(newWeather);
