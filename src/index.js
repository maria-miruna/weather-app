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

function showFormatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.toLocaleDateString(undefined, {
    weekday: "short",
  });
  let dates = date.getDate();

  return `${day} ${dates}`;
}

function showTwoDecimalNumber(number) {
  if (number > 9) {
    return number;
  } else {
    return `0${number}`;
  }
}

function search(event) {
  event.preventDefault();
  showCity(document.querySelector("#search-text-input").value);
}

function showCity(city) {
  apiRequest(`q=${city}`).then(showCurrentWeather);
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
    setWeatherIcon(response.data.weather[0].icon)
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);

  showHourSunriseOrSunset(response, response.data.sys.sunrise, "sunrise");
  showHourSunriseOrSunset(response, response.data.sys.sunset, "sunset");

  showCurrentCity(response);
  showFormatDate(response);

  getForecast(response.data.coord);

  setTemperatureUnitLinks(true);
}

function setWeatherIcon(icon) {
  return {
    "01d":
      "https://s3.amazonaws.com/shecodesio-production/uploads/files/000/080/289/original/Sun.png?1683133617", // clear sky day
    "01n":
      "https://s3.amazonaws.com/shecodesio-production/uploads/files/000/080/290/original/moon.png?1683133683", // clear sky night
    "02d":
      "https://s3.amazonaws.com/shecodesio-production/uploads/files/000/080/291/original/few.png?1683133743", // few clouds day
    "02n":
      "https://s3.amazonaws.com/shecodesio-production/uploads/files/000/080/292/original/few-night.png?1683133774", // few clouds night
    "03d":
      "https://s3.amazonaws.com/shecodesio-production/uploads/files/000/080/311/original/cloud.png?1683136885", // scattered clouds day
    "03n":
      "https://s3.amazonaws.com/shecodesio-production/uploads/files/000/080/311/original/cloud.png?1683136885", // scattered clouds night
    "04d":
      "https://s3.amazonaws.com/shecodesio-production/uploads/files/000/080/313/original/cloud-icon.png?1683137089", // broken clouds day
    "04n":
      "https://s3.amazonaws.com/shecodesio-production/uploads/files/000/080/313/original/cloud-icon.png?1683137089", // broken clouds night
    "09d":
      "https://s3.amazonaws.com/shecodesio-production/uploads/files/000/080/082/original/rain.png?1683047905", // shower rain day
    "09n":
      "https://s3.amazonaws.com/shecodesio-production/uploads/files/000/080/082/original/rain.png?1683047905", // shower rain night
    "10d":
      "https://s3.amazonaws.com/shecodesio-production/uploads/files/000/080/084/original/light-rain.png?1683048003", // rain day
    "10n":
      "https://s3.amazonaws.com/shecodesio-production/uploads/files/000/080/086/original/light-rain-night.png?1683048147", // rain night
    "11d":
      "https://s3.amazonaws.com/shecodesio-production/uploads/files/000/080/295/original/storm.png?1683134159", // thunderstorm day
    "11n":
      "https://s3.amazonaws.com/shecodesio-production/uploads/files/000/080/296/original/storm-night.png?1683134166", // thunderstorm night
    "13d":
      "https://s3.amazonaws.com/shecodesio-production/uploads/files/000/080/297/original/snow.png?1683134271", // snow day
    "13n":
      "https://s3.amazonaws.com/shecodesio-production/uploads/files/000/080/297/original/snow.png?1683134271", // snow night
    "50d":
      "https://s3.amazonaws.com/shecodesio-production/uploads/files/000/080/298/original/haze.png?1683134404", // mist day
    "50n":
      "https://s3.amazonaws.com/shecodesio-production/uploads/files/000/080/301/original/fog.png?1683134489", // mist night
  }[icon];
}

function getForecast(coordinates) {
  let apiKey = `62bc298785543e137bc6756e514eb1c3`;
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showForecast);
}

function showCurrentCity(response) {
  let cityName = response.data.name;
  document.querySelector("h1").innerHTML = cityName;
}

function showForecast(response) {
  let maximumTemperature = Math.round(response.data.daily[0].temp.max);
  showElement("#maximum-temperature", `${maximumTemperature}º`);

  let minimumTemperature = Math.round(response.data.daily[0].temp.min);
  showElement("#minimum-temperature", `${minimumTemperature}º`);

  let forecast = response.data.daily;

  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = "";

  forecast.forEach(function (forecastDay, index) {
    if (index > 0 && index < 6) {
      image = setWeatherIcon(forecastDay.weather[0].icon);
      forecastHTML =
        forecastHTML +
        `<div class="weather-item col">
    <p>${showFormatDay(forecastDay.dt)}</p>
    <img
      src=${image}
      alt=""
      width="50"
    />
    <p>
      <span class="weather-forecast-temperature-max">
        <strong>${Math.round(forecastDay.temp.max)}°</strong>
      </span>
      / <span class="weather-forecast-temperature-min">${Math.round(
        forecastDay.temp.min
      )}°</span>
    </p>
  </div>`;
    }
  });

  forecastElement.innerHTML = forecastHTML;
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

showCity("Coimbra");

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
