import React, { useState } from "react";
import "./App.css";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (event) => {
    setCity(event.target.value);
    setError("");
  };

  const getWeather = async () => {
    if (!city.trim()) {
      setError("Please enter a city name");
      return;
    }

    setLoading(true);
    setWeather(null);
    setError("");

    try {
      const geoResponse = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${city}`
      );
      const geoData = await geoResponse.json();

      if (!geoData.results || geoData.results.length === 0) {
        setError("City not found! Please try another city.");
        setLoading(false);
        return;
      }

      const { latitude, longitude } = geoData.results[0];

      const weatherResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
      );
      const weatherData = await weatherResponse.json();

      setWeather(weatherData.current_weather);
    } catch (error) {
      console.error(error);
      setError("Error fetching weather data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="weather-container">
      <h1 className="title">Weather App</h1>
      <p className="description">Enter the City to check the Weather details</p>
      
      <input
        className="weather-input"
        type="text"
        placeholder="Enter the City here"
        onChange={handleInputChange}
        value={city}
      />

      <button className="weather-btn" onClick={getWeather} disabled={loading}>
        {loading ? "Fetching Weather..." : "Get Weather"}
      </button>

      {error && <p className="error-message">{error}</p>}

      {loading && (
        <div className="loading-section">
          <div className="loading-spinner"></div>
          <p>Loading weather data...</p>
        </div>
      )}

      {weather && !loading && (
        <div className="weather-result">
          <h2>Current Weather in {city}</h2>
          <p>Temperature: {weather.temperature}°C</p>
          <p>Wind Speed: {weather.windspeed} km/h</p>
        </div>
      )}
    </div>
  );
}

export default App;