import React, { useState, useEffect } from "react";
import { Badge, Calendar, Card } from "antd";
import moment from "moment";
import { useParams } from "react-router-dom";
import { ROUTES } from "../utils/routes";
import useApiRequest from "../components/common/useApiRequest";

const getListData = (value, attendance) => {
  const today = moment().startOf("day");
  const listData = attendance
    .filter((item) => {
      return moment(item.clockInTime).date() === moment(new Date(value)).date();
    })
    .map((item) => ({
      type: item.isLateToday ? "warning" : "success",
      content: item.isLateToday ? "Late" : "Present",
    }));

  if (listData.length === 0 && moment(new Date(value)).isSameOrBefore(today)) {
    listData.push({
      type: "error",
      content: "Absent",
    });
  }

  return listData;
};

const dateCellRender = (value, attendance) => {
  const listData = getListData(value, attendance);
  return (
    <ul className="events">
      {listData.map((item, index) => (
        <li key={index}>
          <Badge status={item.type} text={item.content} />
        </li>
      ))}
    </ul>
  );
};

const AttendanceCalendar = () => {
  const { id: userId, name } = useParams();
  const [attendance, setAttendance] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(moment().month());
  const [currentYear, setCurrentYear] = useState(moment().year());
  const { sendRequest } = useApiRequest();
  const [isLoading, setIsLoading] = useState(false);
  const {
    ATTENDANCE: { GET_ATTENDANCE },
  } = ROUTES;

  useEffect(() => {
    const fetchAttendance = async () => {
      setIsLoading(true);
      try {
        const data = await sendRequest({
          url: `${
            import.meta.env.VITE_BACKEND_URL
          }${GET_ATTENDANCE}?userId=${userId}&year=${currentYear}&month=${currentMonth}`,
          method: "GET",
          showNotification: false,
        });
        setAttendance(data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
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
    <Card title={`${name} Attendance`} loading={isLoading}>
      <Calendar
        dateCellRender={(value) => dateCellRender(value, attendance)}
        onPanelChange={onPanelChange}
        disabledDate={disabledDate}
        className="custom-calendar"
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
            <Badge status="success" text="Present" />
          </li>
          <li>
            <Badge status="warning" text="Late" />
          </li>
          <li>
            <Badge status="error" text="Absent" />
          </li>
        </ul>
      </div>
    </Card>
  );
};

export default AttendanceCalendar;
