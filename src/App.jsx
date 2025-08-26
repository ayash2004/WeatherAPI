import { useState } from 'react'

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

function App() {
  
  const [cityInput,setCityInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showWeatherCard, setShowWeatherCard] = useState(false);
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState([]);  

  const getWeatherEmoji = (iconCode) => {
    const iconMap = {
      '01d': '☀️', '01n': '🌙',
      '02d': '⛅', '02n': '⛅',
      '03d': '☁️', '03n': '☁️',
      '04d': '☁️', '04n': '☁️',
      '09d': '🌧️', '09n': '🌧️',
      '10d': '🌦️', '10n': '🌦️',
      '11d': '⛈️', '11n': '⛈️',
      '13d': '❄️', '13n': '❄️',
      '50d': '🌫️', '50n': '🌫️'
    };
    return iconMap[iconCode] || '☁️';
  };

  const getWeatherByCity = async (city) => {
    setIsLoading(true)
    setError('')
    setShowWeatherCard(false)

    try{
      const response = await fetch (`${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`)
      console.log("citttttttttt");
      const data = await response.json()
      
      if(response.ok) {
        const processedWeather = {
          cityName: data.name,
          country: data.sys.country,
          temperature: Math.round(data.main.temp),
          feelsLike: Math.round(data.main.feels_like),
          description: data.weather[0].description,
          humidity: data.main.humidity,
          windSpeed: data.wind.speed,
          pressure: data.main.pressure,
          visibility: (data.visibility / 1000).toFixed(1),
          icon: data.weather[0].icon
        };
        console.log("by city");
        
        setCurrentWeather(processedWeather);
        setShowWeatherCard(true);
        await getForecastData(data.coord.lat, data.coord.lon);
      }
      else {
        setError(error.message || 'City not found');
      }
    }
    catch (error) {
      setError('Failed to fetch weather data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  const getWeatherByCoords = async (lat, lon) => {
    setIsLoading(true);
    setError('');
    setShowWeatherCard(false);
    
    try {
      const response = await fetch(
        `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      const data = await response.json()
      if(data){
        console.log(data);
        
      if (response.ok) {
        const processedWeather = {
          cityName: data.name,
          country: data.sys.country,
          temperature: Math.round(data.main.temp),
          feelsLike: Math.round(data.main.feels_like),
          description: data.weather[0].description,
          humidity: data.main.humidity,
          windSpeed: data.wind.speed,
          pressure: data.main.pressure,
          visibility: (data.visibility / 1000).toFixed(1),
          icon: data.weather[0].icon
        };
        setCurrentWeather(processedWeather);
        setShowWeatherCard(true);
        getForecastData(lat,lon);
      }
    }
    } catch (error) {
        setError('Failed to fetch weather data for your location.');
    } finally {
      setIsLoading(false);
    }
  };  
  
  const getForecastData = async (lat, lon) => {
    try {      
      const response = await fetch(
        `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      const data = await response.json();
      // console.log(data);
      
      if (data) {
        console.log(data);
        
        const dailyForecasts = data.list
        .filter((item, index) => index % 8 === 0)
        .slice(0, 5)
        .map(item => ({
          date: item.dt_txt,
          day: new Date(item.dt_txt).toLocaleDateString('en-US', { weekday: 'short' }),
          temperature: Math.round(item.main.temp),
          description: item.weather[0].description,
          icon: item.weather[0].icon
        }));
    
        // console.log("yashah222"); 
        setForecast(dailyForecasts);
        // console.log(typeof dailyForecasts);
        console.log( dailyForecasts);
      }
    }
    catch (error) {
      console.error('Failed to fetch forecast data:', error);
    }
  };

  const handleSearch = () => {
    const city = cityInput.trim()
    if(city){
      console.log("searh butt");
      
      getWeatherByCity(city)
    }
    else 
      setError('Please enter a city name');
  }
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch()
    }
  };

  const getCurrentLocationWeather = () => {
    if (navigator.geolocation) {
      setIsLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          getWeatherByCoords(lat, lon);
        },
        (error) => {
          setIsLoading(false);
          setError('Unable to get your location. Please enable location access.');
        }
      );
    } else {
      setError('Geolocation is not supported by this browser');
    }
  };

  const getCurrentDate = () =>{
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

    return (
    <div className="bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            ⛅ Weather App
          </h1>
          <p className="text-blue-100 text-lg">Get real-time weather information for any city</p>
        </header>

        {/* Search Section */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <input 
              type="text" 
              value={cityInput}
              onChange={(e) => setCityInput(e.target.value)}
              onKeyDown={ handleKeyPress}
              placeholder="Enter city name..." 
              className="w-full px-4 py-3 pr-12 rounded-full border-2 border-white/20 bg-white/10 backdrop-blur-sm text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-300"
            />
            <button 
              onClick={handleSearch}
              disabled={isLoading}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 disabled:opacity-50 rounded-full p-2 transition-colors duration-300"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </button>
          </div>
          
          <button 
            onClick={getCurrentLocationWeather}
            disabled={isLoading}
            className="w-full mt-3 px-4 py-2 bg-white/20 hover:bg-white/30 disabled:opacity-50 text-white rounded-full transition-colors duration-300 backdrop-blur-sm"
          >
            📍 Use Current Location
          </button>
        </div>

        {/* Loading State */}
        {isLoading && (
           <div className="text-center mb-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            <p className="text-white mt-2">Loading weather data...</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="max-w-md mx-auto mb-8">
            <div className="bg-red-500/20 backdrop-blur-sm border border-red-300/30 text-white px-4 py-3 rounded-lg">
              <p>{error}</p>
            </div>
          </div>
        )}

        {/* Weather Card */}
        {showWeatherCard && currentWeather && (
          <div className="max-w-4xl mx-auto">
            
            {/* Current Weather */}
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 md:p-8 shadow-2xl border border-white/20 mb-6">
              
              {/* City and Date */}
              <div className="text-center mb-6">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  
                  {currentWeather.cityName}
                  {currentWeather.country && currentWeather.country !== 'Demo' && (
                    <span className="text-xl text-blue-100 ml-2">
                      ({currentWeather.country})
                    </span>
                  )}
                </h2>
                <p className="text-blue-100 text-lg">{getCurrentDate()}</p>
              </div>

              {/* Main Weather Display */}
              <div className="flex flex-col md:flex-row items-center justify-around mb-6">
                
                {/* Temperature and Icon */}
                <div className="flex items-center mb-4 md:mb-0">
                  <div className="text-6xl md:text-8xl mr-4">
                    {getWeatherEmoji(currentWeather.icon)}
                  </div>
                  <div>
                    <div className="text-5xl md:text-7xl font-bold text-white">
                      {currentWeather.temperature}°C
                    </div>
                    <div className="text-xl text-blue-100 capitalize">
                      {currentWeather.description}
                    </div>
                  </div>
                </div>

                {/* Feels Like */}
                <div className="text-center ">
                  <p className="text-blue-100 text-sm">Feels like</p>
                  <p className="text-2xl font-semibold text-white">
                    {currentWeather.feelsLike}°C
                  </p>
                </div>
              </div>

              {/* Weather Details Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                
                <div className="bg-white/5 rounded-xl p-4 text-center">
                  <div className="text-2xl mb-2">💧</div>
                  <p className="text-blue-100 text-sm">Humidity</p>
                  <p className="text-white font-semibold">{currentWeather.humidity}%</p>
                </div>

                <div className="bg-white/5 rounded-xl p-4 text-center">
                  <div className="text-2xl mb-2">💨</div>
                  <p className="text-blue-100 text-sm">Wind Speed</p>
                  <p className="text-white font-semibold">{currentWeather.windSpeed} m/s</p>
                </div>

                <div className="bg-white/5 rounded-xl p-4 text-center">
                  <div className="text-2xl mb-2">🌡️</div>
                  <p className="text-blue-100 text-sm">Pressure</p>
                  <p className="text-white font-semibold">{currentWeather.pressure} hPa</p>
                </div>

                <div className="bg-white/5 rounded-xl p-4 text-center">
                  <div className="text-2xl mb-2">👁️</div>
                  <p className="text-blue-100 text-sm">Visibility</p>
                  <p className="text-white font-semibold">{currentWeather.visibility} km</p>
                </div>
              </div>
            </div>

            {/* 5-Day Forecast */}
            {forecast.length > 0 && (
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 md:p-8 shadow-2xl border border-white/20">
                <h3 className="text-2xl font-bold text-white mb-6 text-center">5-Day Forecast</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {forecast.map((day, index) => (
                    <div key={index} className="bg-white/5 rounded-xl p-4 text-center">
                      <p className="text-blue-100 text-sm mb-2">{day.day}</p>
                      <div className="text-3xl mb-2">{getWeatherEmoji(currentWeather.icon)}</div>
                      <p className="text-white font-semibold">{day.temperature}°C</p>
                      <p className="text-blue-100 text-xs capitalize">{day.description}</p>
                    </div>
                   ))}  
                </div>
              </div>
             )} 
          </div>
          
        )} 

        {/* Footer */}
        <footer className="text-center mt-8">
          <p className="text-blue-100 text-sm">
            Powered by OpenWeather API | Built with ❤️
          </p>
        </footer>
      </div>
    </div>
  );
};

export default App

// 