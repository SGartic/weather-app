import React, { createContext, useState, useContext } from "react";

const WeatherContext = createContext();

export const WeatherProvider = ({ children }) => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [todayTemp, setTodayTemp] = useState(null);
  const [error, setError] = useState("");

  const API_KEY = import.meta.env.VITE_OPENWEATHER_API;

  const getWeatherByCity = async (e, forcedCity = null) => {
    if (e) e.preventDefault();
    const ciudad = forcedCity || city;
    if (!ciudad) return;

    try {
      setError("");
      setWeather(null);
      setTodayTemp(null);

      const geoRes = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${ciudad}&limit=1&appid=${API_KEY}`
      );
      if (!geoRes.ok) throw new Error("No se pudo encontrar la ciudad");

      const geoData = await geoRes.json();
      if (!geoData.length) throw new Error("Ciudad no encontrada");

      const { lat, lon } = geoData[0];
      getWeatherByLocation(lat, lon);
    } catch (err) {
      setError(err.message);
    }
  };

  const getWeatherByLocation = async (lat, lon) => {
    try {
      setError("");
      setWeather(null);
      setTodayTemp(null);

      const [resWeather, resForecast] = await Promise.all([
        fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=es`
        ),
        fetch(
          `https://api.openweathermap.org/data/2.5/forecast/daily?lat=${lat}&lon=${lon}&cnt=1&units=metric&lang=es&appid=${API_KEY}`
        )
      ]);

      if (!resWeather.ok) throw new Error("No se pudo obtener clima por ubicación");
      if (!resForecast.ok) throw new Error("No se pudo obtener pronóstico diario");

      const [dataWeather, dataForecast] = await Promise.all([
        resWeather.json(),
        resForecast.json()
      ]);

      setWeather(dataWeather);
      setTodayTemp(dataForecast.list[0].temp);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <WeatherContext.Provider
      value={{
        city,
        setCity,
        weather,
        todayTemp,
        error,
        getWeatherByCity,
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
};

export const useWeather = () => useContext(WeatherContext);
