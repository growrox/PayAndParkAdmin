import React, { useState, useEffect } from "react";
import {
  Badge,
  Card,
  Modal,
  Form,
  Switch,
  Button,
  message,
  Typography,
  Input,
  Table,
  DatePicker,
} from "antd";
import moment from "moment";
import { useParams } from "react-router-dom";
import { ROUTES } from "../utils/routes";
import useApiRequest from "../components/common/useApiRequest";

const { Text } = Typography;
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
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedAttendanceId, setSelectedAttendanceId] = useState(null); // Store attendance ID
  const [form] = Form.useForm();

  const {
    ATTENDANCE: { GET_ATTENDANCE, UPDATE_ATTENDANCE },
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
    console.log({ value });

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
      console.log({
        values,
        url: `${
          import.meta.env.VITE_BACKEND_URL
        }${UPDATE_ATTENDANCE}/${selectedAttendanceId}`,
      });

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
      // Refresh attendance data
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

  const dates = generateDatesForMonth(currentYear, currentMonth);

  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
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
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) =>
        record.attendanceId && (
          <Button onClick={() => showModal(record.attendanceId, record)}>
            View Details
          </Button>
        ),
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
          // defaultValue={moment(`${currentYear}-${currentMonth + 1}`, "YYYY-MM")}
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
