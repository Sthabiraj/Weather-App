const error = document.querySelector(".error");
const group = document.querySelectorAll(".group");

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
        temp: data.main.temp, // City temperature
        pressure: data.main.pressure, // Pressure
        windSpeed: data.wind.speed, // Wind speed
        humidity: data.main.humidity, // Humidity
      };

      // Adding the data to the html using DOM
      document.querySelector("#condition").innerHTML = weather.condition;
      document.querySelector("#temperature").innerHTML = Math.round(
        weather.temp
      );
      document.querySelector("#date").innerHTML = weather.date;
      document.querySelector("#day").innerHTML = weather.day;
      document.querySelector("#city-name").innerHTML = weather.name;
      document.querySelector("#pressure").innerHTML = weather.pressure;
      document.querySelector("#wind-speed").innerHTML = weather.windSpeed;
      document.querySelector("#humidity").innerHTML = weather.humidity;

      // Condition to add weather icon based on condition
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
fetchData("Chelmsford");

// For weather based on location
const city = document.querySelector("#search-box");
function searchWeather() {
  fetchData(city.value);
  city.value = "";
}
