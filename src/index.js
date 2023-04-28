function showFormatDate(response) {
  let currentDate = new Date();
  let timeZone = response.data.timezone * 1000;
  let dateSearchedCity = new Date(currentDate.getTime() + timeZone);
  let days = dateSearchedCity.toLocaleDateString(undefined, {
    weekday: "long",
  });
  let hours = showTwoDecimalNumber(dateSearchedCity.getUTCHours());
  let minutes = showTwoDecimalNumber(dateSearchedCity.getUTCMinutes());
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

  setTemperatureUnitLinks(true);
}

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
  celsiusTemperature = response.data.main.temp;

  let temperature = Math.round(celsiusTemperature);
  showElement("#current-temperature", temperature);

  let description = response.data.weather[0].description;
  showElement("#weather-information", description);

  let wind = Math.round(response.data.wind.speed * 3.6);
  showElement("#wind", `${wind} km/h`);

  let humidity = response.data.main.humidity;
  showElement("#humidity", `${humidity}%`);

  let iconElement = document.querySelector("#icon");
  iconElement.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);

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
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  apiRequest(`lat=${lat}&lon=${lon}`).then(showCurrentWeather);
}
function displayCurrentCity() {
  navigator.geolocation.getCurrentPosition(showPosition);
}
displayCurrentCity();

function deleteContent() {
  let searchInput = document.querySelector("#search-text-input");
  searchInput.value = "";
}

function apiRequest(query) {
  let apiKey = `2ad97b46f52d1ea9b55ab2f9586e1ccf`;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?${query}&appid=${apiKey}&units=metric`;
  return axios.get(apiUrl);
}

function setTemperatureUnitLinks(isCelsius) {
  let fahrenheitLink = document.querySelector("#fahrenheit-link");
  let celsiusLink = document.querySelector("#celsius-link");

  if (isCelsius) {
    celsiusLink.classList.add("current-selected");
    fahrenheitLink.classList.remove("current-selected");
  } else {
    celsiusLink.classList.remove("current-selected");
    fahrenheitLink.classList.add("current-selected");
  }
}

function showFahrenheitTemperature(event) {
  event.preventDefault();
  let temperature = document.querySelector("#current-temperature");
  let fahrenheitTemperature = (celsiusTemperature * 9) / 5 + 32;
  temperature.innerHTML = Math.round(fahrenheitTemperature);

  setTemperatureUnitLinks(false);
}

function ShowCelsiusTemperature(event) {
  event.preventDefault();
  let temperature = document.querySelector("#current-temperature");
  temperature.innerHTML = Math.round(celsiusTemperature);

  setTemperatureUnitLinks(true);
}

let celsiusTemperature = null;

let searchCity = document.querySelector("#search-city");
searchCity.addEventListener("submit", search);

let positionButton = document.querySelector("#current-location");
positionButton.addEventListener("click", displayCurrentCity);

let clearButton = document.querySelector("#clear-button");
clearButton.addEventListener("click", deleteContent);

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", showFahrenheitTemperature);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", ShowCelsiusTemperature);
