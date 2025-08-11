import React from "react";
import { useEffect, useState, useContext} from 'react';
import { CityContext } from "./CityContext";

export default function Forecast() {
  const {setCity, forecastData, currentWeatherData} = useContext(CityContext);


  
  return (
    <div>
      <h2>Forecast</h2>
      <p>Weather forecast details go here.</p>
    </div>
  );
}
