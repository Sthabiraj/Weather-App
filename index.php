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

    // Construct the complete URL for the icon
    $icon_url = "https://openweathermap.org/img/w/$weather_icon.png";
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
  if ($conn->query($sql) === TRUE) {
    echo "Database created successfully<br>";
    // Select the database
    $conn->select_db($dbname);
  } else {
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
    Pressure DECIMAL(6, 2),
    Wind_Speed DECIMAL(5, 2),
    Humidity DECIMAL(5, 2)
  )";

  if ($conn->query($sql) === TRUE) {
    echo "Table MyGuests created successfully<br>";
  } else {
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

  $sql = "SELECT * FROM $city_name";
  $result = $conn->query($sql);

  if ($result->num_rows !== 7) {
    $sql_ = "INSERT INTO $city_name (Day_of_Week, Day_and_Date, Weather_Condition, Weather_Icon, Temperature, Pressure, Wind_Speed, Humidity)
            VALUES ('$day_of_week', '$day_and_date', '$weather_condition', '$weather_icon', $temperature, $pressure, $wind_speed, $humidity)";

    if ($conn->query($sql_) === TRUE) {
      echo "New record created successfully";
    } else {
      echo "Error: " . $sql_ . "<br>" . $conn->error;
    }
  } else {
    $sql_ = "UPDATE $city_name 
            SET 
                Day_and_Date = '$day_and_date',
                Weather_Condition = '$weather_condition',
                Weather_Icon = '$weather_icon',
                Temperature = $temperature,
                Pressure = $pressure,
                Wind_Speed = $wind_speed,
                Humidity = $humidity
            WHERE Day_of_Week = '$day_of_week'";

    if ($conn->query($sql_) === TRUE) {
      echo "Records updated successfully<br>";
    } else {
      echo "Error: " . $sql_ . "<br>" . $conn->error;
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

  $sql = "SELECT * FROM $city_name";
  $result = $conn->query($sql);
  if ($result->num_rows > 0) {
    // output weather data of each row
    while ($row = $result->fetch_assoc()) {
      echo $row["Day_of_Week"] . " | " . $row["Day_and_Date"] . " | " . $row["Weather_Condition"] . " | " . $row["Weather_Icon"] . " | " . $row["Temperature"] . " | " . $row["Pressure"] . " | " . $row["Wind_Speed"] . " | " . $row["Humidity"] . "<br><br>";
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
  $dbname = "City_Weather";

  // Create database
  create_DB($servername, $username, $password, $dbname);

  // Create table
  create_table($servername, $username, $password, $dbname);

  // Insert data to table
  insert_update_data($servername, $username, $password, $dbname);

  // Display weather data
  display_data($servername, $username, $password, $dbname);
}

connect_DB();
?>