import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import {
  Dashboard,
  Login,
  UserForm,
  UserList,
  CreateVehicle,
} from "./pages/index.js";
import ErrorBoundary from "antd/es/alert/ErrorBoundary";
import Loader from "./components/common/loader.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <Suspense fallback={<Loader />}>
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                <App>
                  <Dashboard />
                </App>
              }
            ></Route>
            <Route
              path="/create-user"
              element={
                <App>
                  <UserForm />
                </App>
              }
            />
            <Route
              path="/list-user"
              element={
                <App>
                  <UserList />
                </App>
              }
            />
            <Route
              path="/create-vehicle"
              element={
                <App>
                  <CreateVehicle />
                </App>
              }
            />

            <Route path="/login" element={<Login />} />

            {/* Add more routes as needed */}
          </Routes>
        </BrowserRouter>
      </Suspense>
    </ErrorBoundary>
  </React.StrictMode>
);
