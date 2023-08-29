<?php
$city_name = "Chelmsford";
function fetch_weather_data()
{
  global $city_name; // Make the $city_name variable accessible within the function
  $api_key = "b9042ec5d9a26c6e11c152ed3cf8ec90";
  $url = "https://api.openweathermap.org/data/2.5/weather?q=$city_name&appid=$api_key&units=metric";

  // Reads the JSON file
  $json_data = file_get_contents($url);

  // Decodes the JSON data to PHP object
  $response_data = json_decode($json_data);
  if ($response_data === null || isset($response_data->cod) && $response_data->cod !== 200) {
    return false; // Return false to indicate an error
  }

  // Check if the API request was successful
  if ($response_data->cod === 200) {
    $day_of_week = date('l');
    $day_and_date = date('M j, Y');
    $weather_condition = $response_data->weather[0]->description;
    $weather_icon = $response_data->weather[0]->icon;
    $temperature = $response_data->main->temp;
    $pressure = $response_data->main->pressure;
    $wind_speed = $response_data->wind->speed;
    $humidity = $response_data->main->humidity;

    // Return data as tuple
    return [$day_of_week, $day_and_date, $weather_condition, $weather_icon, $temperature, $pressure, $wind_speed, $humidity];
  } else {
    echo "Error: Unable to fetch weather data.";
  }
}

function create_DB($servername, $username, $password, $dbname)
{
  // Create connection
  $conn = new mysqli($servername, $username, $password);

  // Check connection
  if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
  }

  // Create database
  $sql = "CREATE DATABASE IF NOT EXISTS $dbname";
  if ($conn->query($sql) !== TRUE) {
    echo "Error creating database: " . $conn->error;
  }

  $conn->close();
}

function create_table($servername, $username, $password, $dbname)
{
  global $city_name; // Make the $city_name variable accessible within the function
  // Create connection
  $conn = new mysqli($servername, $username, $password, $dbname);
  // Check connection
  if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
  }

  // sql to create table
  $sql = "CREATE TABLE if not exists $city_name(
    id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    Day_of_Week VARCHAR(15),
    Day_and_Date VARCHAR(20),
    Weather_Condition VARCHAR(50),
    Weather_Icon VARCHAR(100),
    Temperature INT(5),
    Pressure INT(6),
    Wind_Speed DECIMAL(5, 2),
    Humidity INT(5)
  )";

  if ($conn->query($sql) !== TRUE) {
    echo "Error creating table: " . $conn->error;
  }

  $conn->close();
}

function insert_update_data($servername, $username, $password, $dbname)
{
  global $city_name;
  $conn = new mysqli($servername, $username, $password, $dbname);

  if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
  }

  list($day_of_week, $day_and_date, $weather_condition, $weather_icon, $temperature, $pressure, $wind_speed, $humidity) = fetch_weather_data();

  $existing_sql = "SELECT * FROM $city_name WHERE Day_of_Week = '$day_of_week'";
  $existing_result = $conn->query($existing_sql);

  if ($existing_result->num_rows === 0) {
    $insert_sql = "INSERT INTO $city_name (Day_of_Week, Day_and_Date, Weather_Condition, Weather_Icon, Temperature, Pressure, Wind_Speed, Humidity)
                  VALUES ('$day_of_week', '$day_and_date', '$weather_condition', '$weather_icon', $temperature, $pressure, $wind_speed, $humidity)";

    if ($conn->query($insert_sql) !== TRUE) {
      echo "Error: " . $insert_sql . "<br>" . $conn->error;
    }
  } else {
    $update_sql = "UPDATE $city_name 
              SET 
                Weather_Condition = '$weather_condition',
                Weather_Icon = '$weather_icon',
                Temperature = $temperature,
                Pressure = $pressure,
                Wind_Speed = $wind_speed,
                Humidity = $humidity,
                Day_and_Date = '$day_and_date'
              WHERE Day_of_Week = '$day_of_week'";

    if ($conn->query($update_sql) !== TRUE) {
      echo "Error: " . $update_sql . "<br>" . $conn->error;
    }
  }

  $conn->close();
}

function display_data($servername, $username, $password, $dbname)
{
  global $city_name;

  // Create connection
  $conn = new mysqli($servername, $username, $password, $dbname);
  // Check connection
  if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
  }

  $sql = "SELECT * FROM $city_name ORDER BY id ASC";
  $result = $conn->query($sql);
  if ($result->num_rows > 0) {
    // output weather data of each row
    while ($row = $result->fetch_assoc()) {
      echo '<div class="week-box">
              <div class="date">' . $row["Day_and_Date"] . '</div>
              <div class="db-info">
                <p>' . date("D", strtotime($row["Day_of_Week"])) . '</p>
                <figure><img src="./icons/' . $row["Weather_Icon"] . '.svg" alt="weather-icon" /></figure>
                <p>' . $row["Temperature"] . '°C</p>
                <p>' . $row["Pressure"] . ' Pa</p>
                <p>' . $row["Wind_Speed"] . ' m/s</p>
                <p>' . $row["Humidity"] . ' %</p>
              </div>
            </div>
            <hr>';
    }
  } else {
    echo "0 results";
  }

  $conn->close();
}

function connect_DB()
{
  $servername = "localhost";
  $username = "root";
  $password = "";
  $dbname = "city_weather";

  // Create database
  create_DB($servername, $username, $password, $dbname);

  // Create table
  create_table($servername, $username, $password, $dbname);

  // Insert data to table
  insert_update_data($servername, $username, $password, $dbname);

  // Display weather data
  display_data($servername, $username, $password, $dbname);
}
?>

<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Weather Forecast App</title>
  <link rel="icon" href="icons/weather-icon.png" type="image/x-icon" />
  <link rel="stylesheet" href="style.css" />
  <link rel="stylesheet"
    href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
</head>

<body>
  <main class="container">
    <section class="left">
      <!-- Search section -->
      <section class="search-section">
        <input type="search" id="search-box" placeholder="eg. London" />
        <button id="button" onclick="searchWeather()">Search</button>
      </section>
      <!-- End of Search section -->

      <!-- City Weather -->
      <section class="city-weather group">
        <h2><span id="condition"></span></h2>
        <figure>
          <img alt="weather icon" id="weather-icon" />
        </figure>
        <h1><span id="temperature"></span>°C</h1>
        <p><span id="day"></span>, <span id="date"></span></p>
        <h2>
          <span class="material-symbols-outlined"> location_on </span>
          <span id="city-name"></span>
        </h2>
      </section>
      <!-- End of City Weather -->
      <hr class="group" />
      <!-- Weather info -->
      <section class="weather-info group">
        <!-- Pressure -->
        <div class="info-item">
          <figure><img src="./icons/pressure.png" alt="info icon" /></figure>
          <h1><span id="pressure"></span> Pa</h1>
          <p>Pressure</p>
        </div>
        <!-- Wind speed -->
        <div class="info-item">
          <figure>
            <img src="./icons/wind speed.png" alt="info icon" />
          </figure>
          <h1><span id="wind-speed"></span> m/s</h1>
          <p>Wind Speed</p>
        </div>
        <!-- Humidity -->
        <div class="info-item">
          <figure><img src="./icons/humidity.png" alt="info icon" /></figure>
          <h1><span id="humidity"></span> %</h1>
          <p>Humidity</p>
        </div>
      </section>
      <!-- End of weather info -->

      <!-- Error section -->
      <section class="error hide">
        <figure>
          <img src="./icons/error.png" alt="Error icon" />
        </figure>
        <p>Invalid city. Please enter a valid city name.</p>
      </section>
      <!-- End of Error Section -->
    </section>

    <section class="right">
      <h1>
        <?php echo $city_name . " Past Weather"; ?>
      </h1>
      <div class="week-container">
        <?php
        try {
          connect_DB();
        } catch (Exception $e) {
          echo "An error occurred: " . $e->getMessage();
        } ?>
      </div>
    </section>
  </main>
  <script src="script.js"></script>
</body>

</html>