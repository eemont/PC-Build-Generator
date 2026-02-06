import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import './index.css'
import App from './App.jsx'
import Nav from './components/Nav/Nav.jsx'
import Home from "./pages/Home/Home";
import GenerateBuild from "./pages/GenerateBuild/GenerateBuild";
import SavedBuilds from "./pages/SavedBuilds/SavedBuilds";
import Reset from "./reset";

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Nav />

    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/build" element={<GenerateBuild />} />
      <Route path="/saved" element={<SavedBuilds />}/>
      <Route path="/Auth" element={<App />} />
      <Route path="/reset" element={<Reset />} />
    </Routes>
  </BrowserRouter>,
)
