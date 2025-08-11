import { createContext, useState, useContext, useEffect, use } from "react";

export const CityContext = createContext();

export const CityProvider = ({ children }) => {
    const [city, setCity] = useState("");
    const [currentWeatherData, setWeatherData] = useState(null);
    const [forecastData, setForecastData] = useState(null);
    const [coords, setCoords] = useState({ lat: null, lon: null });
    const [error, setError] = useState("");

    const VITE_OPENWEATHER_API = import.meta.env.VITE_OPENWEATHER_API;
    const VITE_GEOAPIFY_API = import.meta.env.VITE_GEOAPIFY_API;
    
  

    const fetchCurrentWeather = async (lat, lon) => {
        try {
        const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${VITE_OPENWEATHER_API}&units=metric&lang=es`
        );
        const data = await res.json();
        console.log("Datos del clima actual:", data);
        setWeatherData(data);
        } catch (error) {ç
          setError("Error obteniendo clima actual");
        }
    };

    const fetchCity = async (city) => {
        try {
          const res = await fetch(
              `https://api.geoapify.com/v1/geocode/search?text=${city}&apiKey=${VITE_GEOAPIFY_API}`
        );
        const data = await res.json();
        const { lat, lon } = data.features[0].properties;
        fetchCurrentWeather(lat, lon);
        fetchForecast(lat, lon);
        } catch (error) {
          setError("Error obteniendo ciudad");
        }
    };


    const fetchForecast = async (lat, lon) => {
        try {
            const res = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min&timezone=auto`
            );
            const data = await res.json();

            setForecastData({
              min: data.daily.temperature_2m_min[0],
              max: data.daily.temperature_2m_max[0]
            });
        } catch (error) {
            setError("Error obteniendo min/max");
        }
    };

    useEffect(() => {
    if (!city) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          setCoords({ lat, lon });
          fetchCurrentWeather(lat, lon);
          fetchForecast(lat, lon);
        },
        (error) => {
          console.error("Error obteniendo ubicación:", error);
        }
      );
    }
  }, []);


  
  // Cuando cambia la ciudad, recargamos datos
    useEffect(() => {
        if (city) fetchCity(city);
    }, [city]);

    return (
        <CityContext.Provider
        value={{
            city,
            setCity,
            forecastData,
            currentWeatherData,
            fetchForecast,
            fetchCurrentWeather,
            coords,
            error,
            setError
        }}
        >
        {children}
        </CityContext.Provider>
        
    );
};

export const useCity = () => useContext(CityContext);
