import React from "react";
import { useEffect, useState, useContext } from 'react';
import { WiThermometer, WiHumidity, WiStrongWind, WiBarometer, WiCloud, WiDayFog } from "react-icons/wi";
import { FaArrowDown, FaArrowUp, FaSun, FaMoon } from "react-icons/fa";
import { CityContext } from "./CityContext";



export default function Home() {
  const {setCity, forecastData, currentWeatherData} = useContext(CityContext);
  const [error, setError] = useState("");
  const [searchValue, setSearchValue] = useState("");
  
  // 🔹 Estado para forzar re-render cada minuto
  const [tick, setTick] = useState(0);

  


  const getWindDirection = (deg) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    return directions[Math.round(deg / 45) % 8];
  };

  const getBackgroundByHour = (dt, timezone) => {
    const localTime = new Date((dt + timezone) * 1000).getUTCHours();
    if (localTime >= 6 && localTime < 12) {
      return "linear-gradient(135deg, #FFD580, #FFB347)";
    } else if (localTime >= 12 && localTime < 18) {
      return "linear-gradient(135deg, #87CEEB, #4682B4)";
    } else if (localTime >= 18 && localTime < 21) {
      return "linear-gradient(135deg, #FF7E5F, #FEB47B)";
    } else {
      return "linear-gradient(135deg, #0F2027, #203A43, #2C5364)";
    }
  };

  const formatLocalTime = (time) => {
    const offset = currentWeatherData.timezone;
    const date = new Date((time + offset) * 1000);
    const hours = date.getUTCHours().toString().padStart(2, "0");
    const minutes = date.getUTCMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const getSunrise = (time) => formatLocalTime(time);
  const getSunset = (time) => formatLocalTime(time);
  const getCurrentTime = (time) => formatLocalTime(time);

    const handleSubmit = (e) => {
    e.preventDefault();
    if (searchValue.trim() !== "") {
      setCity(searchValue); // actualiza el contexto solo aquí
      setError(""); // limpia el error
    }
    else{
      setError("Por favor ingresa una ciudad válida");
    }
  };

  const getTempColor = (temp) => {
    if (temp < 0) return "#8cc5ffff";
  if (temp < 10) return "#20aeddff";
  if (temp < 20) return "#de9100ff";
  if (temp < 30) return "#b73100ff";
  return "#a41000ff";
};


  // 🔹 Forzar re-render cada minuto
  useEffect(() => {
    const interval = setInterval(() => {
      setTick(t => t + 1);
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "50px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ marginBottom: "20px", color: "#b6f2f6ff" }}>🌤 Weather City</h1>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", justifyContent: "center", gap: "10px", marginBottom: "20px" }}
      >
        <input
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          style={{
            padding: "8px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            width: "200px",
            fontSize: "14px",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "8px 14px",
            border: "none",
            borderRadius: "6px",
            background: "#4a90e2",
            color: "white",
            cursor: "pointer",
          }}
        >
          Search
        </button>
      </form>

      {error && <p style={{ color: "red", fontWeight: "bold" }}>{error}</p>}

      {currentWeatherData && forecastData && (
        <div
          style={{
            maxWidth: "350px",
            margin: "0 auto",
            background: getBackgroundByHour(currentWeatherData.dt, currentWeatherData.timezone),
            borderRadius: "12px",
            padding: "20px",
            boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          <h2 style={{
            margin: "0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            color: "#ccc",
          }}>
            <span style={{ fontSize: "32px", color: "#fff" }}>
              {getCurrentTime(Math.floor(Date.now() / 1000))}
            </span>
            <span style={{ fontSize: "30px", color: "#fff" }}>
              {currentWeatherData.name}, {currentWeatherData.sys.country}
            </span>
          </h2>

          {/* resto del código tal cual */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            marginTop: "10px",
          }}>
            <img
              src={`https://openweathermap.org/img/wn/${currentWeatherData.weather[0].icon}@2x.png`}
              alt="icono del clima"
              style={{ width: "50px", height: "50px" }}
            />
            <span style={{
              textTransform: "capitalize",
              fontSize: "18px",
              color: "#fff",
            }}>
              {currentWeatherData.weather[0].description}
            </span>
          </div>

          {/* Temperatura */}
          <p style={{ margin: "4px 0", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
            <WiThermometer size={30} color={getTempColor(currentWeatherData.main.temp)} />
            Current: <b style={{color: "black",
                        textShadow: `-1px -1px 0 white, 1px -1px 0 white,  -1px 1px 0 white,   1px 1px 0 white`,
                        fontSize: "20px"}}>{(currentWeatherData.main.temp).toFixed(1)}°C
              </b>{" "}
            Real Feel: <b style={{color: "black",
                        textShadow: `-1px -1px 0 white, 1px -1px 0 white,  -1px 1px 0 white,   1px 1px 0 white`,
                        fontSize: "20px"}}>{(currentWeatherData.main.feels_like).toFixed(1)}°C
            </b>
          </p>

          {/* Min / Max */}
          <p style={{ fontSize: "18px", margin: "4px 0", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "4px", color: "#3a8dd0ff" }}>
              <b><FaArrowDown size={26} /> {forecastData?.min}°C</b>
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "4px", color: "#be0101ff" }}>
              <FaArrowUp size={26} /> {forecastData?.max}°C
            </span>
          </p>

          {/* Humedad */}
          <p style={{ margin: "4px 0", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
            <WiHumidity size={30} /> Humidity: {currentWeatherData.main.humidity}%
          </p>

          {/* Viento */}
          <p style={{ margin: "4px 0", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
            <WiStrongWind size={30} /> Wind:
            <span style={{ transform: `rotate(${currentWeatherData.wind.deg}deg)`, display: "inline-block" }}>
              <FaArrowUp size={14} />
            </span>
            {getWindDirection(currentWeatherData.wind.deg)} : {(currentWeatherData.wind.speed * 3.6).toFixed(1)} km/h
          </p>

          {/* Presión */}
          <p style={{ margin: "4px 0", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
            <WiBarometer size={30} /> Pressure: {currentWeatherData.main.pressure} hPa
          </p>

          {/* Nubosidad */}
          <p style={{ margin: "4px 0", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
            <WiCloud size={30} /> Cloudiness: {currentWeatherData.clouds.all}%
          </p>

          {/* Visibilidad */}
          <p style={{ margin: "4px 0", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
            <WiDayFog size={30} /> Visibility: {(currentWeatherData.visibility / 1000).toFixed(1)} km
          </p>

          {/* Amanecer / Atardecer */}
          <p style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "16px", margin: "4px 0" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <FaSun color="orange" />
              {getSunrise(currentWeatherData.sys.sunrise)}
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <FaMoon color="goldenrod" />
              {getSunset(currentWeatherData.sys.sunset)}
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
