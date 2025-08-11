import React from "react";
import { useEffect, useState } from 'react';
import { useCity } from "./CityContext";

export default function Forecast() {
  const { city } = useCity();

  const VITE_OPENWEATHER_API = import.meta.env.VITE_OPENWEATHER_API;

  
  return (
    <div>
      <h2>Forecast</h2>
      <p>Weather forecast details go here.</p>
    </div>
  );
}
