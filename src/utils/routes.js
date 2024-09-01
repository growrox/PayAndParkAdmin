export const ROUTES = {
  USER: {
    SIGN_UP: "/api/v1/sign-up",
    LOGIN: "/api/v1/login",
    GET_ALL: "/api/v1/users",
    UPDATE: "/api/v1/user",
    GET_SUPERVISOR_WITH_ASSISTANT: "/api/v1/supervisors-with-assistants",
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
    DELETE: "/api/v1/vehicle-passes",
  },
  TICKET: {
    GET_ALL: "/api/v1/admin/parking-tickets",
    GET_LOCATION: "/api/v1/parking-ticket/location",
    GET_PARKING_TICKETS_IN_DATE_RANGE: "/api/v1/parking-tickets-by-date-range",
    GET_ALL_TICKETS_AMOUNT_TOTAL: "/api/v1/admin/parking-tickets-cash-total",
  },
  SUPERVISOR: {
    GET_SETTLED_TICKETS: "/api/v1/supervisor/tickets/all",
  },
  ACCOUNTANT: {
    GET_SETTLED_TICKETS: "/api/v1/accountant/tickets/settled",
  },
  ATTENDANCE: {
    GET_ATTENDANCE: "/api/v1/get-monthly-attendance",
  },
  SITE: {
    CREATE: "/api/v1/create-site",
    GET_ALL: "/api/v1/get-all-sites",
    UPDATE: "/api/v1/update-site",
    DELETE: "/api/v1/delete-site",
  },
};
