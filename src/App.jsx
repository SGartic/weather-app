import { useEffect, useState } from 'react'
import { FaArrowUp, FaArrowDown, FaSun, FaMoon  } from "react-icons/fa";
import { WiThermometer, WiHumidity, WiStrongWind, WiBarometer, WiCloud, WiDayFog } from "react-icons/wi";
import './App.css'



export default function App() {
  const[view, setView] = useState("actual");
  const [city, setCity] = useState("")
  const [weather, setWeather] = useState(null)
  const [todayTemp, setTodayTemp] = useState(null);

  const[error, setError] = useState("")

  const VITE_OPENWEATHER_API = import.meta.env.VITE_OPENWEATHER_API;

  const getWeatherByCity = async (e, forcedCity = null) => {
    if (e) e.preventDefault();
    const ciudad = forcedCity || city;
    if (!ciudad) return;

    try {
      setError("");
      setWeather(null);
      setTodayTemp(null);

      const geoRes = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${VITE_OPENWEATHER_API}`
      );
      if (!geoRes.ok) throw new Error("No se pudo encontrar la ciudad");

      const geoData = await geoRes.json();
      if (!geoData.length) throw new Error("Ciudad no encontrada");

      const { lat, lon } = geoData[0];

      // 2️⃣ Ahora obtenemos el clima usando lat/lon
      getWeatherByLocation(lat, lon);

    } catch (err) {
      setError(err.message);
    }
  };
  

  const getWeatherByLocation = async (lat, lon) => {
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${VITE_OPENWEATHER_API}&units=metric&lang=es`
      );
      if (!res.ok) throw new Error("No se pudo obtener clima por ubicación");

      const data = await res.json();
      setWeather(data);

      // Pronóstico diario (solo hoy)
    const forecastRes = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast/daily?lat=${lat}&lon=${lon}&cnt=1&units=metric&lang=es&appid=${VITE_OPENWEATHER_API}`
    );
    if (!forecastRes.ok) throw new Error("No se pudo obtener pronóstico diario");

    const forecastData = await forecastRes.json();
    const todayTemp = forecastData.list[0].temp; // { min, max, day, night }
    setTodayTemp(todayTemp);


    } catch (err) {
      setError(err.message);
    }
  };

  const getWindDirection = (deg) => {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return directions[Math.round(deg / 45) % 8];
};

const getBackgroundByHour = (dt, timezone) => {
  const localTime = new Date((dt + timezone) * 1000).getUTCHours();

  if (localTime >= 6 && localTime < 12) {
    // Mañana
    return "linear-gradient(135deg, #FFD580, #FFB347)"; // amarillo-naranja
  } else if (localTime >= 12 && localTime < 18) {
    // Tarde
    return "linear-gradient(135deg, #87CEEB, #4682B4)"; // azul claro-azul medio
  } else if (localTime >= 18 && localTime < 21) {
    // Atardecer
    return "linear-gradient(135deg, #FF7E5F, #FEB47B)"; // naranja-rosa
  } else {
    // Noche
    return "linear-gradient(135deg, #0F2027, #203A43, #2C5364)"; // azules oscuros
  }
};

const getSunrise = (time) => {
  const offset = weather.timezone;

  const localUnix = time + offset;
  
  // Crear fecha en UTC para esa ciudad
  const date = new Date(localUnix * 1000);

  // Obtener horas y minutos en UTC (sin tu offset)
  const hours = date.getUTCHours().toString().padStart(2, "0");
  const minutes = date.getUTCMinutes().toString().padStart(2, "0");

  return `${hours}:${minutes}`;

};

const getSunset = (time) => {
  const offset = weather.timezone;

  const localUnix = time + offset;
  
  // Crear fecha en UTC para esa ciudad
  const date = new Date(localUnix * 1000);

  // Obtener horas y minutos en UTC (sin tu offset)
  const hours = date.getUTCHours().toString().padStart(2, "0");
  const minutes = date.getUTCMinutes().toString().padStart(2, "0");

  return `${hours}:${minutes}`;
};

const getCurrentTime = (time) => {
  const offset = weather.timezone;

  const localUnix = time + offset;
  
  // Crear fecha en UTC para esa ciudad
  const date = new Date(localUnix * 1000);

  // Obtener horas y minutos en UTC (sin tu offset)
  const hours = date.getUTCHours().toString().padStart(2, "0");
  const minutes = date.getUTCMinutes().toString().padStart(2, "0");

  return `${hours}:${minutes}`;
};
  
  useEffect(() => {
    if (!navigator.geolocation) {
      setError("La geolocalización no es compatible con tu navegador");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        getWeatherByLocation(latitude, longitude);
      },
      () => {
        // Si el usuario no da permiso, puedes poner una ciudad por defecto
        setError("No se pudo acceder a tu ubicación. Busca una ciudad.");
      }
    );
  }, []);

  {/** Titulo en pagina **/}
  return (
  <div style={{ textAlign: "center", marginTop: "50px", fontFamily: "Arial, sans-serif" }}>
    <h1 style={{ marginBottom: "20px", color: "#b6f2f6ff" }}>🌤 Weather City</h1>

    <form
      onSubmit={getWeatherByCity}
      style={{ display: "flex", justifyContent: "center", gap: "10px", marginBottom: "20px" }}
    >
      {/** Input de ciudad **/}
      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Ej: Madrid"
        style={{
          padding: "8px",
          borderRadius: "6px",
          border: "1px solid #ccc",
          width: "200px",
          fontSize: "14px",
        }}
      />
      {/** Boton de búsqueda **/}
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

    {weather && todayTemp && (
      <div
        style={{
          maxWidth: "350px",
          margin: "0 auto",
          background: getBackgroundByHour(weather.dt, weather.timezone),
          borderRadius: "12px",
          padding: "20px",
          boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        {/* Hora */}
        <h2
          style={{
            margin: "0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            color: "#ccc",
          }}
        >
          <span style={{ fontSize: "32px", color: "#fff" }}>
            {getCurrentTime(weather.dt)}
          </span>
          <span style={{ fontSize: "30px", color: "#fff" }}>
            {weather.name}, {weather.sys.country}
          </span>
        </h2>
      
          {/* Descripcion */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            marginTop: "10px",
          }}
        >
          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt="icono del clima"
            style={{ width: "50px", height: "50px" }}
          />
          <span
            style={{
              textTransform: "capitalize",
              fontSize: "18px",
              color: "#fff",
            }}
          >
            {weather.weather[0].description}
          </span>
        </div>

        {/* Temperatura */}
        <p style={{ fontSize: "16px", margin: "4px 0", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
          <WiThermometer size={20} />
          Current: <b>{weather.main.temp}°C</b> Real Feel: <b>{(weather.main.feels_like).toFixed(1)}°C</b>
        </p>

        <p style={{ margin: "4px 0", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
          {/* Mínima */}
          <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <FaArrowDown size={14} color="blue" /> {todayTemp?.min}°C
          </span>

          {/* Máxima */}
          <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <FaArrowUp size={14} color="red" /> {todayTemp?.max}°C
          </span>

        </p>

        {/* Humedad */}

        <p style={{ margin: "4px 0", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
          <WiHumidity size={20} /> Humidity: {weather.main.humidity}%
        </p>

            {/* Viento */}

        <p style={{ margin: "4px 0", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
          <WiStrongWind size={20} /> Wind:
          <span style={{ transform: `rotate(${weather.wind.deg}deg)`, display: "inline-block" }}>
            <FaArrowUp size={14} />
          </span>
          {getWindDirection(weather.wind.deg)} : {(weather.wind.speed * 3.6).toFixed(1)} km/h
        </p>

            {/* Presion */}

        <p style={{ margin: "4px 0", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
          <WiBarometer size={20} /> Pressure: {weather.main.pressure} hPa
        </p>

        {/* Nubosidad */}

        <p style={{ margin: "4px 0", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
          <WiCloud size={20} /> Cloudiness: {weather.clouds.all}%
        </p>

        {/* Visibilidad */}

        <p style={{ margin: "4px 0", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
          <WiDayFog size={20} /> Visibility: {(weather.visibility / 1000).toFixed(1)} km
        </p>

        {/* Amanecer y atardecer (ABAJO)*/ }
        
        <p style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "16px", margin: "4px 0" }}>
          <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <FaSun color="orange" />
            {getSunrise(weather.sys.sunrise)}
          </span>

          <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <FaMoon color="goldenrod" />
            {getSunset(weather.sys.sunset)}
          </span>
        </p>
      </div>
    )}
  </div>
);

}