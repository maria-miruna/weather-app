function showFormatDate(response) {
  let currentDate = new Date();
  let timeZone = response.data.timezone * 1000;
  let dateSearchedCity = new Date(currentDate.getTime() + timeZone);
  let days = dateSearchedCity.toLocaleDateString(undefined, {
    weekday: "long",
  });
  let hours = dateSearchedCity.getUTCHours();
  hours = showTwoDecimalNumber(hours);
  let minutes = dateSearchedCity.getUTCMinutes();
  minutes = showTwoDecimalNumber(minutes);
  let dates = dateSearchedCity.getUTCDate();
  let months = dateSearchedCity.toLocaleDateString(undefined, {
    month: "long",
  });

  let formatedDate = document.querySelector("p.days");
  formatedDate.innerHTML = `${days} ${hours}:${minutes}, ${dates} ${months}`;
}

function showTwoDecimalNumber(number) {
  if (number > 10) {
    return number;
  } else {
    return `0${number}`;
  }
}

function search(event) {
  event.preventDefault();
  let searchInput = document.querySelector("#search-text-input");

  apiRequest(`q=${searchInput.value}`).then(showCurrentWeather);
}
let searchCity = document.querySelector("#search-city");
searchCity.addEventListener("submit", search);

function showElement(id, value) {
  document.querySelector(id).innerHTML = value;
}

function showHourSunriseOrSunset(response, timestamp, label) {
  let time = new Date(timestamp * 1000 + response.data.timezone * 1000);
  let hours = showTwoDecimalNumber(time.getUTCHours());
  let minutes = showTwoDecimalNumber(time.getUTCMinutes());
  let formattedTime = `${hours}:${minutes}`;
  document.querySelector(`#${label}`).innerHTML = formattedTime;
}

function showCurrentWeather(response) {
  console.log(response.data);
  let temperature = Math.round(response.data.main.temp);
  showElement("#current-temperature", temperature);

  let description = response.data.weather[0].description;
  showElement("#weather-information", description);

  let wind = Math.round(response.data.wind.speed * 3.6);
  showElement("#wind", `${wind} km/h`);

  let humidity = response.data.main.humidity;
  showElement("#humidity", `${humidity}%`);

  showHourSunriseOrSunset(response, response.data.sys.sunrise, "sunrise");
  showHourSunriseOrSunset(response, response.data.sys.sunset, "sunset");

  showCurrentCity(response);
  showFormatDate(response);
}
function showCurrentCity(response) {
  let cityName = response.data.name;
  document.querySelector("h1").innerHTML = cityName;
}

function showPosition(position) {
  console.log(position);
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  apiRequest(`lat=${lat}&lon=${lon}`).then(showCurrentWeather);
}
function displayCurrentCity() {
  navigator.geolocation.getCurrentPosition(showPosition);
}
displayCurrentCity();

let positionButton = document.querySelector("#current-location");
positionButton.addEventListener("click", displayCurrentCity);

function deleteContent() {
  let searchInput = document.querySelector("#search-text-input");
  searchInput.value = "";
}

let clearButton = document.querySelector("#clear-button");
clearButton.addEventListener("click", deleteContent);

function apiRequest(query) {
  let apiKey = `2ad97b46f52d1ea9b55ab2f9586e1ccf`;
  let apiUrl = `http://api.openweathermap.org/data/2.5/weather?${query}&appid=${apiKey}&units=metric`;
  return axios.get(apiUrl);
}

function convertTemperature(event) {
  event.preventDefault();
  let temperature = document.querySelector("#current-temperature");
  temperature.innerHTML = 63;
  let fahrenheitLink = document.querySelector("#fahrenheit-link");
  fahrenheitLink.classList.add("current-selected");
  let celsiusLink = document.querySelector("#celsius-link");
  celsiusLink.classList.remove("current-selected");
}
let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", convertTemperature);

function newConvert(event) {
  event.preventDefault();
  let temperature = document.querySelector("#current-temperature");
  temperature.innerHTML = 17;
  let fahrenheitLink = document.querySelector("#fahrenheit-link");
  fahrenheitLink.classList.remove("current-selected");
  let celsiusLink = document.querySelector("#celsius-link");
  celsiusLink.classList.add("current-selected");
}
let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", newConvert);
