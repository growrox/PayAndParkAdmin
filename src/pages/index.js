import { lazy } from "react";

export const Dashboard = lazy(() => import("./Dashboard"));
export const Login = lazy(() => import("./Login"));
export const UserForm = lazy(() => import("./UserForm"));
export const UserList = lazy(() => import("./UserList"));
export const CreateVehicle = lazy(() => import("./CreateVehicle"));
export const GetVehicle = lazy(() => import("./VehicleList"));
export const VehiclePass = lazy(() => import("./VehiclePassManaget"));
export const TicketList = lazy(() => import("./TicketList"));
export const SettledTicketsTable = lazy(() => import("./SettledTicketsTable"));
export const AttendanceCalendar = lazy(() => import("./AttendanceCalendar"));
export const SiteManager = lazy(() => import("./Site"));
export const ForgotPassword = lazy(() => import("./ForgotPassword"));
export const ResetPassword = lazy(() => import("./ResetPassword"));
