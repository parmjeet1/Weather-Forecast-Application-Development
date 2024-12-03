
window.onload = function() {
	document.getElementById('container').classList.add('blur-md');
    // Get the user's current location using Geolocation API
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
//five day data
             // Show loader initially
      const loader = document.getElementById('loader');
      const forecastContainer = document.getElementById('forecast');

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          function (position) {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            // Fetch 5-day weather forecast
            fetch(`https://api.weatherapi.com/v1/forecast.json?key=685d9b051845404c88361332240112&q=${latitude},${longitude}&days=5`)
              .then(response => {
                if (!response.ok) {
                  throw new Error('Network response was not ok');
                }
                return response.json();
              })
              .then(data => {
                // Remove loader
                loader.style.display = 'none';

                // Process and display the forecast data
                const forecastDays = data.forecast.forecastday;
                forecastDays.forEach(day => {
                  const forecastDate = day.date;
                  const temperature = day.day.avgtemp_c;
                  const windSpeed = (day.day.maxwind_kph / 3.6).toFixed(2); // Convert to m/s
                  const humidity = day.day.avghumidity;

                  // Create forecast card
                  const card = document.createElement('div');
                  card.className = 'p-4 bg-gray-100 rounded-lg shadow text-center';
                  card.innerHTML = `
                    <h2 class="text-lg font-bold">${forecastDate}</h2>
                    <p class="text-sm mt-2">Temp: ${temperature}°C</p>
                    <p class="text-sm">Wind: ${windSpeed} M/S</p>
                    <p class="text-sm">Humidity: ${humidity}%</p>
                  `;
                  forecastContainer.appendChild(card);
                });
              })
              .catch(error => {
                console.error('Error fetching weather data:', error);
              });
          },
          function (error) {
            console.error('Error getting location: ', error);
            alert('Unable to retrieve your location. Please enable location services.');
          }
        );
      } else {
        alert('Geolocation is not supported by this browser.');
      }

            //five day data
            // Fetch weather data based on the user's current location
            fetch(`https://api.weatherapi.com/v1/current.json?key=685d9b051845404c88361332240112&q=${latitude},${longitude}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                	        	 document.getElementById('container').classList.remove('blur-md');
        	   document.getElementById('container').classList.add('blur-none');
                    // console.log(data); // Log the data to verify it

                    // Get the current date in "YYYY-MM-DD" format
                    const currentDate = new Date().toISOString().split('T')[0];

                    // Update the city name and date
                    document.getElementById('cityName').innerHTML = `${data.location.name} (${currentDate})`;

                    // Extract wind speed and humidity
                    const humidity = data.current.humidity; // Humidity percentage
                    const windSpeedMPS = data.current.wind_kph / 3.6; // Convert km/h to m/s
                    const windDirection = data.current.wind_dir;

                    // Update the HTML elements with fetched data
                    document.getElementById('temperature').innerHTML = `${data.current.temp_c}°C`;
                    document.getElementById('wind').innerHTML = `${windSpeedMPS.toFixed(2)} M/S`;
                    document.getElementById('humidity').innerHTML = `${humidity}%`;

                    // Update the weather icon based on fetched data
const weatherIcon = `https:${data.current.condition.icon}`;

                    document.querySelector("img").src = weatherIcon;

                })
                .catch(error => {
                    console.error('Error fetching weather data:', error);
                });
        }, function(error) {
            console.error("Error getting location: ", error);
            alert("Unable to retrieve your location. Please enable location services.");
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
};

const searchButton = document.getElementById("searchButton");

searchButton.addEventListener("click", function() {
    const cityInput = document.getElementById("cityInput").value; // Get the input value when the button is clicked

    // Fetch data from the API
    fetch(`https://api.weatherapi.com/v1/current.json?key=685d9b051845404c88361332240112&q=${cityInput}`)
        .then(response => {

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // console.log(data); // Log the data to verify it
             const currentDate = new Date().toISOString().split('T')[0];

            // Update the city name and date
            document.getElementById('cityName').innerHTML = `${data.location.name} (${currentDate})`;
            document.getElementById('temperature').innerHTML = `${data.current.temp_c} °C`;
// document.getElementById('wind').innerHTML =`${windSpeedMPS.toFixed(2)} M/S (${windDirection})`;
document.getElementById('humidity').innerHTML =`${humidity}%`;
// const weatherIcon = `https:${data.current.condition.icon}`;

//                     document.querySelector("img").src = weatherIcon;

//                     console.log(weatherIcon);

            // Example: Display the city name and temperature on the page
            // const weatherInfo = document.getElementById("weatherInfo");
            // weatherInfo.innerHTML = `
            //     <p>Location: ${data.location.name}</p>
            //     <p>Temperature: ${data.current.temp_c}°C</p>
            //     <p>Condition: ${data.current.condition.text}</p>
            //     <img src="${data.current.condition.icon}" alt="weather icon">
            // `;
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
        });
});
