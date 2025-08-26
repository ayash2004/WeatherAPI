
import { useState } from "react";
import { Search, Sun, CloudRain, Cloud, MapPin } from "lucide-react";

export default function WeatherApp() {
  const [city1, setCity1] = useState("");
  const [currentweather, setCurrentWeather] = useState("")

  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const API_KEY = import.meta.env.VITE_API_KEY;

  const fetchWeather = async () => {
      try{
          const response = await fetch(`${BASE_URL}/weather?q=${city1}&appid=${API_KEY}&units=metric`)
          const data = await response.json()
          console.log(data);
                  
          if(data){
              const fetchedData = {
                  cityname : data.name,
                  temp : data.main.temp,
                  description: data.weather[0].description,
                  icon: data.weather[0].icon,
                  humidity : data.main.humidity,
                  wind : data.wind.speed,
                  sunrise : data.sys.sunrise,
                  sunset : data.sys.sunset,
                }
                setCurrentWeather(fetchedData)
        }
      }
        catch(error){
            console.log(error);
        }
    }

function calculateSR(ss){
  let sunset = new Date (ss * 1000)
  return sunset.toLocaleTimeString();
}
function calculateSS(sr){
  let sunrise = new Date (sr* 1000)
  // console.log(sunrise.toLocaleTimeString());
   return sunrise.toLocaleTimeString();
}
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 to-indigo-600 p-4">
      <div className="w-full max-w-md bg-white/20 backdrop-blur-md rounded-2xl shadow-xl p-6 text-white">
        
        {/* App Title */}
        <h1 className="text-2xl font-bold text-center mb-6">🌤 Weather App</h1>

        {/* Search Bar */}
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="Enter city name..."
            value={city1}
            onChange={(e) => setCity1(e.target.value)}
            className="flex-1 p-3 rounded-xl text-gray-900 outline-none"
            onKeyDown={(e) => {
                if(e.key === "Enter"){
                    console.log("Pressed Enter");
                    fetchWeather()
                }
                else return;
            }}
          />
          <button
            // TODO: Call fetchWeather(city) here 
            className="bg-indigo-500 hover:bg-indigo-600 p-3 rounded-xl"
            onClick={ fetchWeather }
          >
            <Search size={20} />
          </button>
        </div>

        {/* Weather Info Card (conditionally render after fetching) */}
        <div className="bg-white/10 rounded-xl p-6 text-center space-y-4">
          {/* TODO: Show dynamic weather data */}
          <h2 className="text-xl font-semibold flex items-center justify-center gap-2">
            {/* <MapPin size={20} /> */}
            {currentweather.cityname} 
          </h2>
          
          <p className="text-5xl font-bold">{currentweather.temp}</p>
          <p className="capitalize text-lg">{currentweather.description}</p>

          {/* Extra details */}
          <div className="grid grid-cols-2 gap-4 text-sm mt-4">
            <div className="bg-white/20 rounded-lg p-3">
              <p>Humidity</p>
              <p className="font-semibold">{currentweather.humidity}%</p>
            </div>
            <div className="bg-white/20 rounded-lg p-3">
              <p>Wind</p>
              <p className="font-semibold">{currentweather.wind} km/h</p>
            </div>
            <div className="bg-white/20 rounded-lg p-3">
              <p>Sunrise</p>
              <p className="font-semibold">{calculateSR(currentweather.sunrise)}</p>
            </div>
            <div className="bg-white/20 rounded-lg p-3">
              <p>Sunset</p>
              <p className="font-semibold">{calculateSS(currentweather.sunset)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

}
