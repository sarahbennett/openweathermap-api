const apiURL = "http://api.openweathermap.org/data/2.5/weather"
const apiKey = "6410c52bfcdfdfea3c892dda7d405055"
//need to append: ?lat={lat}&lon={lon}&APPID=6410c52bfcdfdfea3c892dda7d405055

const form = document.getElementById("apiOptions")
let debug = null

const coordinates = [
  {lat: 47.6762, lon: -122.3182}, //seattle
  {lat: 51.5074, lon: 0.1278} //london
]

function addCoords(){
  navigator.geolocation.getCurrentPosition(geolocSuccess, geolocError);
}

function geolocSuccess(position){
  const newPos = {lat: position.coords.latitude, lon: position.coords.longitude};
  coordinates.push(newPos);
}

// callback for no success getting location from user's browser
function geolocError(){
  console.log("Error getting user's location :(");
}

function handleSubmit () {
  event.preventDefault()
  console.log(form)
  // get form values

  if (form.selection[0].value === "Seattle"){
    var cityChoice = coordinates[0]
    console.log(cityChoice)
  } else if (form.selection[1].value === "London") {
    var cityChoice = coordinates[1]
  } else if (form.selection[2].value === "My Location") {
    var cityChoice = coordinates[2]
  }
  // serialize them into a query string
  let queryString = buildQuery(cityChoice)
  // call getWeather with the query string
  console.log(queryString)
  getWeather(queryString)
}

function buildQuery(cityChoice) {
  if (form.units.value == "Celcius"){
    return `${apiURL}?lat=${cityChoice.lat}&lon=${cityChoice.lon}&units=metric&APPID=${apiKey}`
  } else {
    return `${apiURL}?lat=${cityChoice.lat}&lon=${cityChoice.lon}&units=imperial&APPID=${apiKey}`
  }
}

function getWeather (queryString) {
  let request = new XMLHttpRequest()
  // starts talk to API - 3 params
  request.open("GET", queryString, true)
  // fires when the request is complete
  request.onload = function () {
    let response = JSON.parse(request.response);

    var temp = response.main.temp
    let description = response.weather[0].description
    let humidity = response.main.humidity+"%"
    let sunsetUnix = response.sys.sunset
    let sunsetTime = moment(sunsetUnix*1000).toString()
    let sunriseUnix = response.sys.sunrise
    let sunriseTime = moment(sunriseUnix*1000).toString()

    var weatherInfo = []

    var info = document.forms[0].info;
    var i;
    for (i = 0; i < info.length; i++) {
        if (info[i].checked) {
        weatherInfo.push(info[i].value);
        }
      }

    let weatherDiv = document.getElementById("weather")
    for (i = 0; i < weatherInfo.length; i++) {
        var li = document.createElement("li");
        li.innerHTML = eval(weatherInfo[i]);
        weatherDiv.appendChild(li);
      }
  }

  // fires if something goes wrong
  request.error = function (errorObject) {
    console.log("Sorry, there is an error")
    console.log(errorObject)
  }
  request.send()
}


// tempEval = eval("response.main.temp")
// console.log(tempEval+ "\u00B0")
// function buildWeatherReport() {
// for (i=0; i<weatherInfo.length; i++) {
//   var infoValue = eval(weatherInfo[i])
//   console.log(infoValue);
// };
//   var information = form.info
//   var i;
//   for (i = 0; i < information.length; i++) {
//     if (information[i].checked){
//       var infoValue = eval(information[i].value)
//       console.log(infoValue);
//     }
//   }
// }

// functionweatherBuilder() {
//   console.log("building the weather report!")
//   event.preventDefault();
//   var form = document.querySelector("form");
//   var newWeather = form.info.value
//   weatherInfo.weather.push(newWeather);
