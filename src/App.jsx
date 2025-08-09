import './App.css'
import Home from "./Home";
import Forecast from './Forecast';
import Map from './Map';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';


export default function App() {
  return(
   <Router basename="/weather-app/">
      {/* Menú */}
      <nav>
        <NavLink to="/" className={({ isActive }) => isActive ? "active" : "nav-link"}>
          Home
        </NavLink> |{" "}
        <NavLink to="/Forecast" className={({ isActive }) => isActive ? "active" : "nav-link"}>
          Forecast
        </NavLink> |{" "}
        <NavLink to="/Map" className={({ isActive }) => isActive ? "active" : "nav-link"}>
          Map
        </NavLink>

      </nav>

      {/* Rutas */}
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/Forecast" element={<Forecast/>}/>
        <Route path="/Map" element={<Map/>}/>
        <Route path="*" element={<Home/>}/> {/* 👈 Captura rutas no definidas */}
      </Routes>
    </Router>
  );
}
