/* src/routes/AppRouter.jsx */

import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import DashboardLayout from "../layouts/DashboardLayout";

import Home from "../pages/home/Home";
import Login from "../pages/auth/Login";
import Dashboard from "../pages/dashboard/Dashboard";
import Devices from "../pages/devices/Devices";
import Alerts from "../pages/alerts/Alerts";
import Metrics from "../pages/metrics/Metrics";
import Settings from "../pages/settings/Settings";
import Users from "../pages/users/Users";
import Locations from "../pages/locations/Locations";

import ProtectedRoute from "./ProtectedRoute";

function AppRouter() {

  return (
    <BrowserRouter>

      <Routes>

        {/* PUBLIC */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
        </Route>

        {/* AUTH */}
        <Route path="/login" element={<Login />} />

        {/* PROTECTED DASHBOARD */}
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >

          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/devices" element={<Devices />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/metrics" element={<Metrics />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/users" element={<Users />} />
          <Route path="/locations" element={<Locations />} />

        </Route>

      </Routes>

    </BrowserRouter>
  );
}

export default AppRouter;