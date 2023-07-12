async function fetchData(cityName) {
  const apiKey = "b9042ec5d9a26c6e11c152ed3cf8ec90";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`;
  const response = await fetch(url);
  const data = await response.json();
  console.log(data);
}
fetchData("Chelmsford");
