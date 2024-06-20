import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Dashboard, Login } from "./pages/index.js";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <App>
              <Dashboard />
            </App>
          }
        />
        <Route path="/login" element={<Login />} />

        {/* Add more routes as needed */}
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
