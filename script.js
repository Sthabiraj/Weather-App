async function fetchData(cityName) {
  // Fetching weather data on the basis of city name
  const apiKey = "b9042ec5d9a26c6e11c152ed3cf8ec90";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`;
  const response = await fetch(url);
  const data = await response.json();

  console.log(data.name);

  // For current day and date
  const date = new Date();
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

  return {
    name: data.name, // City name
    day: weekdays[date.getDay()], // Current day
    date: date.toLocaleDateString("en-US", options), // Current date
    condition: data.weather[0].description, // Weather condition
    icon: data.weather[0].icon, // Weather icon
    temp: data.main.temp, // City temperature
    pressure: data.main.pressure, // Pressure
    windSpeed: data.wind.speed, // Wind speed
    humidity: data.main.humidity, // Humidity
  };
}
fetchData("chelmsford")
  .then((city) => {
    console.log(city);
  })
  .catch((error) => {
    console.log(error);
  });
