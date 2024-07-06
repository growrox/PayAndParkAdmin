export const ROUTES = {
  USER: {
    SIGN_UP: "/api/v1/sign-up",
    LOGIN: "/api/v1/login",
    GET_ALL: "/api/v1/users",
    UPDATE: "/api/v1/user"
  },
  VEHICLE_TYPE: {
    CREATE: "/api/v1/create-vehicle-type",
    GET_DETAIL: "/api/v1/get-vehicle-type",
    GET_ALL: "/api/v1/get-all-vehicle-type",
    UPDATE: "/api/v1/update-vehicle-type",
    DELETE: "/api/v1/delete-vehicle-type",
  },
  SHIFT: {
    GET: "/api/v1/shifts/list",
  },
  PASS: {
    GET_ALL: "/api/v1/vehicle-passes",
    UPDATE: "/api/v1/vehicle-passes",
    CREATE: "/api/v1/vehicle-passes",
  }
};
