const error = document.querySelector(".error");
const offline = document.querySelector(".offline");
const group = document.querySelectorAll(".group");
const weekContainer = document.querySelector(".week-container");
const cityName = "Chelmsford";

function populateWeatherData(weather) {
  document.querySelector("#condition").innerHTML = weather.condition;
  document.querySelector("#temperature").innerHTML = Math.round(weather.temp);
  document.querySelector("#date").innerHTML = weather.date;
  document.querySelector("#day").innerHTML = weather.day;
  document.querySelector("#city-name").innerHTML = weather.name;
  document.querySelector("#pressure").innerHTML = weather.pressure;
  document.querySelector("#wind-speed").innerHTML = weather.windSpeed;
  document.querySelector("#humidity").innerHTML = weather.humidity;
  document.querySelector("#weather-icon").src = `./icons/${weather.icon}.svg`;
}

async function fetchData(cityName) {
  try {
    // Fetching weather data based on the city name
    const apiKey = "b9042ec5d9a26c6e11c152ed3cf8ec90";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;
    const response = await fetch(url);
    if (!response.ok) {
      // add error
      error.classList.remove("hide");
      group.forEach((node) => node.classList.add("hide"));
    } else {
      // remove error
      error.classList.add("hide");
      group.forEach((node) => node.classList.remove("hide"));

      const data = await response.json();
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

      // Adding the weather data to an object
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

      // Adding the data to the html using DOM
      populateWeatherData(weather);

      localStorage.setItem("defaultWeatherData", JSON.stringify(weather));
    }
  } catch (error) {
    // Handle the error
    console.error(error);
    // Display an error message to the user
    error.classList.remove("hide");
    group.forEach((node) => node.classList.add("hide"));
    alert(
      "An error occurred while fetching weather data. Please try again later."
    );
  }
}

// For default location weather
fetchData(cityName);

const cachedWeatherData = localStorage.getItem("defaultWeatherData");
if (cachedWeatherData) {
  const weather = JSON.parse(cachedWeatherData);
  populateWeatherData(weather);
}

const city = document.querySelector("#search-box");
function searchWeather() {
  fetchData(city.value);
  city.value = "";
}

// Event listener for the "Enter" key press on the input element
city.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    searchWeather();
  }
});

// Past weather data
async function pastWeatherData() {
  try {
    // Heading
    document.querySelector(".right h1").innerText = `${cityName} Past Weather`;
    // Fetching past weather data from php
    let url = `http://localhost/weather-app/pastWeatherAPI.php`;
    let response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    } else {
      let data = await response.json();
      let weekBoxHTML = ""; // Collect HTML in a variable

      data.forEach((weather) => {
        weekBoxHTML += `
          <div class="week-box">
            <div class="date">${weather.Day_and_Date}</div>
            <div class="db-info">
              <p>${weather.Day_of_Week}</p>
              <figure><img src="./icons/${weather.Weather_Icon}.svg" alt="weather-icon" /></figure>
              <p>${weather.Temperature}°C</p>
              <p>${weather.Pressure} Pa</p>
              <p>${weather.Wind_Speed} m/s</p>
              <p>${weather.Humidity} %</p>
            </div>
          </div>
          <hr>
        `;
      });

      // Set the innerHTML of the weekContainer
      weekContainer.innerHTML = weekBoxHTML;

      savePastData();
    }
  } catch (error) {
    console.error(error);
  }
}

// Call pastWeatherData
pastWeatherData();

function savePastData() {
  localStorage.setItem("data", weekContainer.innerHTML);
}

function showPastData() {
  weekContainer.innerHTML = localStorage.getItem("data");
}

showPastData();
