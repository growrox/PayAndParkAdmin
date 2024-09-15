import React, { useState, useEffect } from "react";
import {
  Badge,
  Card,
  Modal,
  Form,
  Switch,
  Button,
  message,
  Input,
  Table,
  DatePicker,
} from "antd";
import moment from "moment";
import { useParams } from "react-router-dom";
import { ROUTES } from "../utils/routes";
import useApiRequest from "../components/common/useApiRequest";

const { MonthPicker } = DatePicker;

const generateDatesForMonth = (year, month) => {
  const startDate = moment([year, month]);
  const endDate = startDate.clone().endOf("month");
  const dates = [];

  for (let date = startDate; date.isBefore(endDate); date.add(1, "day")) {
    dates.push(date.clone());
  }

  return dates;
};

const AttendanceTable = () => {
  const { id: userId, name } = useParams();
  const [attendance, setAttendance] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(moment().month());
  const [currentYear, setCurrentYear] = useState(moment().year());
  const { sendRequest } = useApiRequest();
  const [isLoading, setIsLoading] = useState(false);
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedAttendanceId, setSelectedAttendanceId] = useState(null); // Store attendance ID
  const [addresses, setAddresses] = useState({}); // Store locations
  const [form] = Form.useForm();

  const {
    ATTENDANCE: { GET_ATTENDANCE, UPDATE_ATTENDANCE },
    TICKET: { GET_LOCATION },
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

  const handleMonthChange = (date) => {
    setCurrentMonth(date.month());
    setCurrentYear(date.year());
  };

  const showModal = (attendanceId, value) => {
    form.setFieldsValue({
      isLateToday: value.isLateToday,
      clockInTime: value.clockInTime
        ? moment(value.clockInTime).format("MMMM Do YYYY, h:mm:ss a")
        : "N/A",
      clockOutTime: value.clockOutTime
        ? moment(value.clockOutTime).format("MMMM Do YYYY, h:mm:ss a")
        : "N/A",
    });
    setSelectedAttendanceId(attendanceId); // Set selected attendance ID
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleUpdate = async () => {
    try {
      const values = await form.validateFields();
      await sendRequest({
        url: `${
          import.meta.env.VITE_BACKEND_URL
        }${UPDATE_ATTENDANCE}/${selectedAttendanceId}`,
        method: "PATCH",
        data: values,
      });
      message.success("Attendance updated successfully!");
      setIsModalVisible(false);
      form.resetFields();
      const data = await sendRequest({
        url: `${
          import.meta.env.VITE_BACKEND_URL
        }${GET_ATTENDANCE}?userId=${userId}&year=${currentYear}&month=${currentMonth}`,
        method: "GET",
        showNotification: false,
      });
      setAttendance(data);
    } catch (error) {
      console.error("Failed to update attendance:", error);
      message.error("Failed to update attendance.");
    } finally {
      setSelectedAttendanceId(null);
    }
  };

  const getTicketLocation = async (attendanceData, type) => {
    setIsLocationLoading(true);
    const latitude =
      type === "clockIn"
        ? attendanceData.clockInLat
        : attendanceData.clockOutLat;
    const longitude =
      type === "clockIn"
        ? attendanceData.clockInLon
        : attendanceData.clockOutLon;
    console.log({ latitude, longitude });

    try {
      if (
        !latitude ||
        !longitude ||
        latitude === "undefined" ||
        longitude === "undefined"
      ) {
        return message.error("No Latitude or Longitude available");
      }
      const response = await sendRequest({
        url: `${
          import.meta.env.VITE_BACKEND_URL
        }${GET_LOCATION}?lat=${latitude}&lon=${longitude}`,
        method: "GET",
        showNotification: false,
      });

      const address = response[0].formattedAddress;
      setAddresses((prev) => ({
        ...prev,
        [attendanceData._id + type]: address, // Save location for this attendance and type (clockIn/clockOut)
      }));
    } catch (error) {
      console.error(error);
      message.error("Failed to fetch location.");
    } finally {
      setIsLocationLoading(false);
    }
  };

  const dates = generateDatesForMonth(currentYear, currentMonth);

  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      width: 70,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      sorter: (a, b) => {
        const statusOrder = { Present: 1, Late: 2, "No Data / Absent": 3 };
        return statusOrder[a.status] - statusOrder[b.status];
      },
      render: (status) => (
        <Badge
          status={
            status === "Present"
              ? "success"
              : status === "Late"
              ? "warning"
              : "error"
          }
          text={status}
        />
      ),
      width: 70,
    },
    {
      title: "Clock In Location",
      dataIndex: "clockInLocation",
      key: "clockInLocation",

      render: (_, record) =>
        addresses[record.attendanceId + "clockIn"] || (
          <Button
            loading={isLocationLoading}
            onClick={() => getTicketLocation(record, "clockIn")}
            disabled={!record.clockInLat || !record.clockInLon}
          >
            Fetch Location
          </Button>
        ),
      width: 150,
    },
    {
      title: "Clock Out Location",
      dataIndex: "clockOutLocation",
      key: "clockOutLocation",
      render: (_, record) =>
        addresses[record.attendanceId + "clockOut"] || (
          <Button
            loading={isLocationLoading}
            onClick={() => getTicketLocation(record, "clockOut")}
            disabled={!record.clockOutLat || !record.clockOutLon}
          >
            Fetch Location
          </Button>
        ),
      width: 150,
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) =>
        record.attendanceId && (
          <>
            <Button onClick={() => showModal(record.attendanceId, record)}>
              View Details
            </Button>
          </>
        ),
      width: 80,
    },
  ];

  const dataSource = dates.map((date) => {
    const attendanceData = attendance.find((item) =>
      moment(item.clockInTime).isSame(date, "day")
    );
    if (attendanceData) {
      return {
        ...attendanceData,
        key: date.format("YYYY-MM-DD"),
        date: date.format("MMMM Do YYYY"),
        status: attendanceData.isLateToday ? "Late" : "Present",
        attendanceId: attendanceData._id,
        clockInTime: attendanceData.clockInTime,
        clockOutTime: attendanceData.clockOutTime,
        clockInLat: attendanceData?.clockInLocation?.latitude, // Assume latitude and longitude are available
        clockInLon: attendanceData?.clockInLocation?.longitude,
        clockOutLat: attendanceData?.clockOutLocation?.latitude,
        clockOutLon: attendanceData?.clockOutLocation?.longitude,
      };
    } else {
      return {
        key: date.format("YYYY-MM-DD"),
        date: date.format("MMMM Do YYYY"),
        status: "No Data / Absent",
        attendanceId: null,
      };
    }
  });

  const disabledDate = (current) => {
    // Disable all months before August 2024
    return current && current.isBefore(moment("2024-08", "YYYY-MM"));
  };

  return (
    <Card
      title={`${name} Attendance`}
      extra={
        <MonthPicker
          format="MMMM YYYY"
          onChange={handleMonthChange}
          disabledDate={disabledDate}
        />
      }
      loading={isLoading}
    >
      <Table
        scroll={{ x: 350, y: 600 }}
        dataSource={dataSource}
        columns={columns}
        pagination={false}
      />
      <Modal
        title="Update Attendance"
        visible={isModalVisible}
        onCancel={handleCancel}
        onOk={handleUpdate}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="isLateToday"
            label="Mark as Late"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
          <Form.Item
            name="removeClockOut"
            label="Hard Clock In (Override)"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
          <Form.Item name="clockInTime" label="Clock In Time">
            <Input readOnly />
          </Form.Item>
          <Form.Item name="clockOutTime" label="Clock Out Time">
            <Input readOnly />
          </Form.Item>
        </Form>
      </Modal>
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
            <Badge status="error" text="No Data / Absent" />
          </li>
        </ul>
      </div>
    </Card>
  );
};

export default AttendanceTable;
