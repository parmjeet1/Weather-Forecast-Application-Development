function clearSearchHistory() {
    localStorage.removeItem('recentCities'); // Remove from localStorage
    renderSearchHistory(); // Re-render to update UI
}
// Elements for search history
const searchHistoryContainer = document.getElementById('searchHistoryContainer');
const searchHistoryList = document.createElement('ul');
searchHistoryList.classList.add('list-disc', 'list-inside', 'p-4', 'rounded-lg', 'shadow-md');
searchHistoryContainer?.appendChild(searchHistoryList);

// Function to update search history in localStorage
function updateSearchHistory(city) {
    const cities = JSON.parse(localStorage.getItem('recentCities')) || [];

    // Avoid duplicates
    if (!cities.includes(city)) {
        cities.unshift(city); // Add the new city to the beginning

        // Limit to 5 searches
        if (cities.length > 5) {
            cities.pop(); // Remove the oldest city
        }

        localStorage.setItem('recentCities', JSON.stringify(cities));
    }

    // renderSearchHistory(); // Update the UI
}





function renderSearchHistory() {
    const cities = JSON.parse(localStorage.getItem('recentCities')) || [];
    // const searchHistoryLabel = document.querySelector('#searchHistoryList p'); // Label element

    // Clear the list
    searchHistoryList.innerHTML = '';
    // searchHistoryList.appendChild(searchHistoryLabel); // Re-add the label

    // If no cities, hide the history container
    if (cities.length === 0) {
        searchHistoryContainer.classList.add('hidden');
        return;
    }

    // Otherwise, show the history container
    searchHistoryContainer.classList.remove('hidden');
    const label = document.createElement('p');
    label.textContent = 'Recent Searches:';
    label.classList.add('font-semibold', 'text-gray-700');
    searchHistoryList.appendChild(label);
    // Populate the list with inline items
    cities.forEach(city => {
        const historyItem = document.createElement('button');
        historyItem.textContent = city;
        historyItem.classList.add(
            'bg-blue-200',
            'rounded',
            'px-4',
            'py-2',
            'hover:bg-blue-300',
            'transition',
            'cursor-pointer'

        );
        historyItem.addEventListener('click', () => {
            document.getElementById('cityInput').value = city;
            document.getElementById('searchButton').click(); // Trigger search
        });
        searchHistoryList.appendChild(historyItem);
    });
    // Add Clear History button at the end
    const clearButton = document.createElement('button');
    clearButton.textContent = 'Clear History';
    clearButton.classList.add(
        'bg-red-500',
        'text-white',
        'rounded',
        'px-4',
        'py-2',
        'hover:bg-red-600',
        'transition',
        'cursor-pointer',
        'mt-2',
        'text-sm'
    );
    clearButton.addEventListener('click', clearSearchHistory);
    searchHistoryList.appendChild(clearButton); // Add at the end
}


window.onload = function () {
    renderSearchHistory();
    // Apply initial blur
    document.querySelector('.content').classList.add('blur-md');

    // Check for Geolocation API
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function (position) {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                // Fetch current weather
                fetch(`https://api.weatherapi.com/v1/current.json?key=685d9b051845404c88361332240112&q=${latitude},${longitude}`)
                    .then(response => response.json())
                    .then(data => {
                        const weatherIcon=data.current.condition.icon;
                        
                        // Remove blur after data is fetched
                        document.querySelector('.content').classList.remove('blur-md');
                        document.querySelector('.content').classList.add('blur-none');

                        // Update current weather
                        const currentDate = new Date().toISOString().split('T')[0];
                        document.getElementById('cityName').innerText = `${data.location.name} (${currentDate})`;
                        document.getElementById('temperature').innerText = `${data.current.temp_c}°C`;
                        document.getElementById('wind').innerText = `${(data.current.wind_kph / 3.6).toFixed(2)} M/S`;
                        document.getElementById('humidity').innerText = `${data.current.humidity}%`;
                        document.getElementById('weatherIcon').src = `https:${weatherIcon}`;
                    })
                    .catch(error => {
                        console.error('Error fetching current weather:', error);
                    });

                // Fetch 5-day forecast
                fetch(`https://api.weatherapi.com/v1/forecast.json?key=685d9b051845404c88361332240112&q=${latitude},${longitude}&days=6`)
                    .then(response => response.json())
                    .then(data => {
                        const forecastContainer = document.querySelector('.grid');
                        forecastContainer.innerHTML = ''; // Clear previous forecast
  const forecastDays = data.forecast.forecastday.slice(1); // Skip today's data (index 0)

        // Populate forecast data
        forecastDays.forEach(day => {
                        	 const date = new Date(day.date);
            const formattedDate = new Intl.DateTimeFormat('en-GB', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            }).format(date);
                        const weatherIcon = `https:${day.day.condition.icon}`;

                            const forecastCard = `

                                <div class="bg-gray-200 p-4 rounded-lg text-center">
                                <img src="${weatherIcon}" alt="Weather Icon" class="w-8 h-8 mx-auto ">
                                    <div class="text-gray-700 font-semibold">${formattedDate}</div>
                                    
                                    <div class="text-gray-600">Temp: ${day.day.avgtemp_c}°C</div>
                                    <div class="text-gray-600">Wind: ${(day.day.maxwind_kph / 3.6).toFixed(2)} M/S</div>
                                    <div class="text-gray-600">Humidity: ${day.day.avghumidity}%</div>
                                </div>
                            `;
                            forecastContainer.insertAdjacentHTML('beforeend', forecastCard);
                        });
                    })
                    .catch(error => {
                        console.error('Error fetching 5-day forecast:', error);
                    });
            },
            function (error) {
                console.error('Error with Geolocation:', error);
                alert('Unable to retrieve your location. Please enable location services.');
            }
        );
    } else {
        alert('Geolocation is not supported by this browser.');
    }
};


const searchButton = document.getElementById("searchButton");

searchButton.addEventListener("click", function() {
    
    const cityInput = document.getElementById('cityInput').value.trim();
    if (cityInput) {
        updateSearchHistory(cityInput);
        // Render search history immediately
    renderSearchHistory();
    }

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
             const currentHumidity = data.current?.humidity;

             // Forecast humidity (for the first forecast day)
             const forecastHumidity = data.forecast?.forecastday[0]?.day?.avghumidity;
     
             // Decide which humidity to display (fallback logic)
             const humidity = currentHumidity ?? forecastHumidity;
             const weatherIcon=data.current.condition.icon;
            // Update the city name and date
            document.getElementById('cityName').innerHTML = `${data.location.name} (${currentDate})`;
            document.getElementById('temperature').innerHTML = `${data.current.temp_c} °C`;
// document.getElementById('wind').innerHTML =`${windSpeedMPS.toFixed(2)} M/S (${windDirection})`;
document.getElementById('humidity').innerHTML = humidity
    ? `${humidity}%`
    : 'N/A';
    document.getElementById('weatherIcon').src = `https:${weatherIcon}`;

        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
        });


        //five day data
fetch(`https://api.weatherapi.com/v1/forecast.json?key=685d9b051845404c88361332240112&q=${cityInput}&days=6`)
.then(response=>response.json())
.then(data=>{
    const forecastContainer = document.querySelector('.grid');
    forecastContainer.innerHTML = ''; // Clear previous forecast
const forecastDays = data.forecast.forecastday.slice(1); // Skip today's data (index 0)

// Populate forecast data
forecastDays.forEach(day => {
       
       const date = new Date(day.date);
        const formattedDate = new Intl.DateTimeFormat('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        }).format(date);
        const weatherIcon=`https:${day.day.condition.icon}`;
       const forecastCard = `<div class="bg-gray-200 p-4 rounded-lg text-center">
                                <img src="${weatherIcon}" alt="Weather Icon" class="w-8 h-8 mx-auto ">
                                    <div class="text-gray-700 font-semibold">${formattedDate}</div>
                                    
                                    <div class="text-gray-600">Temp: ${day.day.avgtemp_c}°C</div>
                                    <div class="text-gray-600">Wind: ${(day.day.maxwind_kph / 3.6).toFixed(2)} M/S</div>
                                    <div class="text-gray-600">Humidity: ${day.day.avghumidity}%</div>
                                </div>
                            `;
forecastContainer.insertAdjacentHTML('beforeend', forecastCard);
    })
})
.catch(error => {
    console.error('Error fetching 5-day forecast:', error);
});
});
// search history function
