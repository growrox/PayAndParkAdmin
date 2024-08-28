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
  GetVehicle,
  VehiclePass,
  TicketList,
  SettledTicketsTable,
  AttendanceCalendar,
  SiteManager
} from "./pages/index.js";
import ErrorBoundary from "antd/es/alert/ErrorBoundary";
import Loader from "./components/common/loader.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
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
          <Route
            path="/edit-vehicle/:id"
            element={
              <App>
                <CreateVehicle />
              </App>
            }
          />
          <Route
            path="/vehicle-list"
            element={
              <App>
                <GetVehicle />
              </App>
            }
          />
          <Route
            path="/vehicle-pass"
            element={
              <App>
                <VehiclePass />
              </App>
            }
          />
          <Route
            path="/tickets-list"
            element={
              <App>
                <TicketList />
              </App>
            }
          />
          <Route
            path="/supervisor/:name/:role/:id"
            element={
              <App>
                <SettledTicketsTable />
              </App>
            }
          />
          <Route
            path="/site-lists"
            element={
              <App>
                <SiteManager />
              </App>
            }
          />
          <Route
            path="/attendance/:id/:name"
            element={
              <App>
                <AttendanceCalendar />
              </App>
            }
          />

          <Route path="/login" element={<Login />} />

          {/* Add more routes as needed */}
        </Routes>
      </BrowserRouter>
    </Suspense>
  </ErrorBoundary>
);
