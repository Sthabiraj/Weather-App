async function fetchData(cityName = "Chelmsford") {
  // Fetching weather data based on the city name
  const apiKey = "b9042ec5d9a26c6e11c152ed3cf8ec90";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;
  const response = await fetch(url);
  const data = await response.json();

  console.log(data);

  // For the current day and date
  const currentDate = new Date();
  let weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  // Define the options for formatting the date
  let options = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  const weather = {
    name: data.name, // City name
    day: weekdays[currentDate.getDay()], // Current day
    date: currentDate.toLocaleDateString("en-US", options), // Current date
    condition: data.weather[0].description, // Weather condition
    icon: data.weather[0].icon, // Weather icon
    temp: data.main.temp, // City temperature
    pressure: data.main.pressure, // Pressure
    windSpeed: data.wind.speed, // Wind speed
    humidity: data.main.humidity, // Humidity
  };

  document.querySelector("#condition").innerHTML = weather.condition;
  document.querySelector("#temperature").innerHTML = Math.round(weather.temp);
  document.querySelector("#date").innerHTML = weather.date;
  document.querySelector("#day").innerHTML = weather.day;
  document.querySelector("#city-name").innerHTML = weather.name;
  document.querySelector("#pressure").innerHTML = weather.pressure;
  document.querySelector("#wind-speed").innerHTML = weather.windSpeed;
  document.querySelector("#humidity").innerHTML = weather.humidity;

  const icon = document.querySelector("#weather-icon");
  if (weather.condition == "clear sky") {
    icon.src = "./icons/Clear.svg";
  } else if (weather.condition == "few clouds") {
    icon.src = "./icons/few clouds.svg";
  } else if (weather.condition == "scattered clouds") {
    icon.src = "./icons/scattered clouds.svg";
  } else if (weather.condition == "broken clouds") {
    icon.src = "./icons/broken clouds.svg";
  } else if (weather.condition == "shower rain") {
    icon.src = "./icons/shower rain.svg";
  } else if (weather.condition == "rain") {
    icon.src = "./icons/rain.svg";
  } else if (weather.condition == "thunderstorm") {
    icon.src = "./icons/thunderstorm.svg";
  } else if (weather.condition == "snow") {
    icon.src = "./icons/snow.svg";
  } else if (weather.condition == "mist") {
    icon.src = "./icons/mist.svg";
  }
}

fetchData("Chelmsford");

const city = document.querySelector("#search-box");
function searchWeather() {
  fetchData(city.value);
}
city.innerText = "";
