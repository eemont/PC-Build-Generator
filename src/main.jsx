import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "./index.css";
import App from "./App.jsx";
import Nav from "./components/Nav/Nav.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Nav />
    <App />
  </BrowserRouter>
);
