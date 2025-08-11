import { createContext, useState, useContext, useEffect, use } from "react";

export const CityContext = createContext();

export const CityProvider = ({ children }) => {
    const [city, setCity] = useState("");
    const [currentWeatherData, setWeatherData] = useState(null);
    const [geoData, setGeoData] = useState(null);
    const [forecastData, setForecastData] = useState(null);
    const VITE_OPENWEATHER_API = import.meta.env.VITE_OPENWEATHER_API;

  

    const fetchGeolocation = async (city) => {
        try {
        const res = await fetch(
            `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${VITE_OPENWEATHER_API}`
        );
        const data = await res.json();
        if (data.length > 0) {
            setGeoData(data);
            fetchCurrentWeather(data[0].lat, data[0].lon);
            fetchForecast(data[0].lat, data[0].lon);
            setCity(data[0].name);
        }
        } catch (error) {
        console.error("Error obteniendo geolocalización:", error);
        }
    };

    const fetchCurrentWeather = async (lat, lon) => {
        try {
        const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${VITE_OPENWEATHER_API}&units=metric&lang=es`
        );
        const data = await res.json();
        setWeatherData(data);
        } catch (error) {
        console.error("Error obteniendo clima actual:", error);
        }
    };

    const fetchForecast = async (lat, lon) => {
        try {
            const res = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min&timezone=auto`
            );
            const data = await res.json();
            
            // Guardar solo la info del día actual
            setForecastData({
            min: data.daily.temperature_2m_min[0],
            max: data.daily.temperature_2m_max[0]
            });
        } catch (error) {
            console.error("Error obteniendo min/max:", error);
        }
    };

    useEffect(() => {
    if (!city) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          try {
            const res = await fetch(
              `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${VITE_OPENWEATHER_API}&units=metric&lang=es`
            );
            const data = await res.json();
            setCity(data.name);
          } catch (error) {
            console.error("Error obteniendo ciudad por geolocalización:", error);
          }
        },
        (error) => {
          console.error("Error obteniendo ubicación:", error);
        }
      );
    }
  }, []);


  
  // Cuando cambia la ciudad, recargamos datos
    useEffect(() => {
        if (city) fetchGeolocation(city);
    }, [city]);

    return (
        <CityContext.Provider
        value={{
            city,
            setCity,
            geoData,
            forecastData,
            currentWeatherData,
            fetchGeolocation,
            fetchForecast,
            fetchCurrentWeather
        }}
        >
        {children}
        </CityContext.Provider>
    );
};

export const useCity = () => useContext(CityContext);
