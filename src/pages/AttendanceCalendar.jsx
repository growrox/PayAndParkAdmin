import React, { useState, useEffect } from "react";
import { Calendar, Card } from "antd";
import moment from "moment";
import { useParams } from "react-router-dom";
import { ROUTES } from "../utils/routes";
import useApiRequest from "../components/common/useApiRequest";

const getStatus = (value, attendance) => {
  const today = moment().startOf("day");
  const dayAttendance = attendance.find(
    (item) => moment(item.clockInTime).date() === moment(new Date(value)).date()
  );

  if (dayAttendance) {
    return dayAttendance.isLateToday ? "late" : "present";
  } else if (moment(new Date(value)).isSameOrBefore(today)) {
    return "absent";
  } else {
    return "future";
  }
};

const dateCellRender = (value, attendance) => {
  const status = getStatus(value, attendance);

  return (
    <div className={`cell ${status}`}>
      <div className="date">{value.date()}</div>
    </div>
  );
};

const AttendanceCalendar = () => {
  const { id: userId, name } = useParams();
  const [attendance, setAttendance] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(moment().month());
  const [currentYear, setCurrentYear] = useState(moment().year());
  const { sendRequest } = useApiRequest();
  const {
    ATTENDANCE: { GET_ATTENDANCE },
  } = ROUTES;

  useEffect(() => {
    const fetchAttendance = async () => {
      const data = await sendRequest({
        url: `${
          import.meta.env.VITE_BACKEND_URL
        }${GET_ATTENDANCE}?userId=${userId}&year=${currentYear}&month=${currentMonth}`,
        method: "GET",
        showNotification: false,
      });
      setAttendance(data);
    };

    fetchAttendance();
  }, [userId, currentMonth, currentYear]);

  const onPanelChange = (value) => {
    setCurrentMonth(value.month());
    setCurrentYear(value.year());
  };

  const disabledDate = (current) => {
    return current.month() !== currentMonth;
  };

  return (
    <Card title={`${name} Attendance`}>
      <Calendar
        dateCellRender={(value) => dateCellRender(value, attendance)}
        onPanelChange={onPanelChange}
        disabledDate={disabledDate}
        className="custom-calendar"
        mode="month"
      />
      <div style={{ marginTop: 20 }}>
        <ul
          className="legend"
          style={{
            listStyleType: "none",
            padding: 0,
            display: "flex",
            justifyContent: "space-around",
          }}
        >
          <li>
            <span className="legend-item present">Present</span>
          </li>
          <li>
            <span className="legend-item late">Late</span>
          </li>
          <li>
            <span className="legend-item absent">Absent</span>
          </li>
        </ul>
      </div>
    </Card>
  );
};

export default AttendanceCalendar;
