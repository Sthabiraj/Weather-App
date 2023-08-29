// Constants
const error = document.querySelector(".error");
const group = document.querySelectorAll(".group");
const cityName = "Chelmsford";
const apiKey = "b9042ec5d9a26c6e11c152ed3cf8ec90";

// Function to save weather data to local storage
function saveWeatherToLocalStorage(weather) {
  localStorage.setItem("weatherData", JSON.stringify(weather));
}

// Function to retrieve weather data from local storage
function getWeatherFromLocalStorage() {
  const storedWeather = localStorage.getItem("weatherData");
  if (storedWeather) {
    return JSON.parse(storedWeather);
  }
  return null;
}

// Function to save past weather data to local storage
function savePastWeatherToLocalStorage(pastWeather) {
  localStorage.setItem("pastWeatherData", JSON.stringify(pastWeather));
}

// Function to retrieve past weather data from local storage
function getPastWeatherFromLocalStorage() {
  const storedPastWeather = localStorage.getItem("pastWeatherData");
  if (storedPastWeather) {
    return JSON.parse(storedPastWeather);
  }
  return null;
}

// Utility function to fetch JSON data
async function fetchJSON(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

// Function to display weather data
function displayWeather(weather) {
  const {
    condition,
    temp,
    date,
    day,
    name,
    pressure,
    windSpeed,
    humidity,
    icon,
  } = weather;

  // Update DOM elements with weather data
  document.querySelector("#condition").textContent = condition;
  document.querySelector("#temperature").textContent = Math.round(temp);
  document.querySelector("#date").textContent = date;
  document.querySelector("#day").textContent = day;
  document.querySelector("#city-name").textContent = name;
  document.querySelector("#pressure").textContent = pressure;
  document.querySelector("#wind-speed").textContent = windSpeed;
  document.querySelector("#humidity").textContent = humidity;
  document.querySelector("#weather-icon").src = `./icons/${icon}.svg`;
}

// Function to handle weather data retrieval and display
async function fetchAndDisplayWeather(cityName) {
  try {
    // Construct API URL
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;
    const data = await fetchJSON(url);

    // Get current date and format options
    const currentDate = new Date();
    const weekdays = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };

    // Extract weather data from API response
    const weather = {
      name: data.name,
      day: weekdays[currentDate.getDay()],
      date: currentDate.toLocaleDateString("en-US", options),
      condition: data.weather[0].description,
      icon: data.weather[0].icon,
      temp: data.main.temp,
      pressure: data.main.pressure,
      windSpeed: data.wind.speed,
      humidity: data.main.humidity,
    };

    // Display weather data and save to local storage
    displayWeather(weather);
    saveWeatherToLocalStorage(weather);
  } catch (error) {
    console.error(error);
    error.classList.remove("hide");
    group.forEach((node) => node.classList.add("hide"));
    alert(
      "An error occurred while fetching weather data. Please try again later."
    );
  }
}

// Main execution: Display saved weather data or fetch new weather data
const savedWeather = getWeatherFromLocalStorage();
if (savedWeather) {
  displayWeather(savedWeather);
} else {
  fetchAndDisplayWeather(cityName);
}

// Function to handle past weather data
async function fetchAndDisplayPastWeather() {
  try {
    // Update title for past weather
    document.querySelector(".right h1").innerText = `${cityName} Past Weather`;

    // Construct API URL for past weather data
    const url = `http://localhost/weather-app/index.php`;
    const data = await fetchJSON(url);

    // Generate HTML for past weather boxes
    const weekContainer = document.querySelector(".week-container");
    let weekBoxHTML = "";

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

    // Update DOM with past weather data and save to local storage
    weekContainer.innerHTML = weekBoxHTML;
    savePastWeatherToLocalStorage(data);
  } catch (error) {
    console.error(error);
  }
}

// Main execution for past weather: Display saved past weather data or fetch new past weather data
const savedPastWeather = getPastWeatherFromLocalStorage();
if (savedPastWeather) {
  document.querySelector(".right h1").innerText = `${cityName} Past Weather`;

  const weekContainer = document.querySelector(".week-container");
  let weekBoxHTML = "";

  savedPastWeather.forEach((weather) => {
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

  weekContainer.innerHTML = weekBoxHTML;
} else {
  fetchAndDisplayPastWeather();
}
