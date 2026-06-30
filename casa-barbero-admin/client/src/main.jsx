import React from "react";
import { createRoot } from "react-dom/client";
import App from "./app/App.jsx";
import "./assets/styles/global.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
