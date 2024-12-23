import React, { useState, useEffect } from "react";
import {
  Card,
  Table,
  Pagination,
  Button,
  Input,
  Tag,
  Space,
  message,
  Flex,
  DatePicker,
  Row,
  Col,
  Statistic,
  Checkbox,
  Switch,
  Select,
  Divider,
} from "antd";
import { Outlet } from "react-router-dom";
import useApiRequest from "../components/common/useApiRequest";
import { ROUTES } from "../utils/routes";
import UserFilter from "../components/userFilter";
import { ArrowUpOutlined } from "@ant-design/icons";
import DownloadReport from "../components/downloadTicketReport";
import moment from "moment";

const { Search } = Input;
const { RangePicker } = DatePicker;

const TicketList = () => {
  const today = moment(); // Today's date
  const oneMonthFromToday = moment().subtract(1, "month");
  const { sendRequest } = useApiRequest();
  const [isLoading, setIsLoading] = useState(false);
  const [ticketList, setTicketList] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [addresses, setAddresses] = useState({});
  const [dateRange, setDateRange] = useState([oneMonthFromToday, today]);
  const [assitants, setAssistants] = useState([]);
  const [supervisors, setSupervisors] = useState([]);
  const [ticketType, setTicketType] = useState(true);
  const [isPass, setIsPass] = useState("all");
  const [amountTotal, setAmountTotal] = useState({
    cash: 0,
    online: 0,
    free: 0,
    passOnline: 0,
    passCash: 0,
  });

  const {
    TICKET: {
      GET_ALL,
      GET_LOCATION,
      GET_ALL_TICKETS_AMOUNT_TOTAL,
      DELTE_TICEKT_BY_ID,
      GET_ALL_DELETED_TICKETS,
      RESTORE_TICEKT_BY_ID,
    },
  } = ROUTES;

  const [pagination, setPagination] = useState({
    current: 1,
    limit: 20,
    total: 0,
  });

  const getTicketList = async (
    page = 1,
    limit = 20,
    searchText = "",
    supervisors = [],
    assistants = []
  ) => {
    setIsLoading(true);
    try {
      const [startDate, endDate] = dateRange;
      const formattedStartDate = startDate
        ? new Date(startDate).toLocaleDateString()
        : "";
      const formattedEndDate = endDate
        ? new Date(endDate).toLocaleDateString()
        : "";

      if (!ticketType) {
        const { totalCount, parkingTickets } = await sendRequest({
          url: `${
            import.meta.env.VITE_BACKEND_URL
          }${GET_ALL_DELETED_TICKETS}?page=${page}&limit=${limit}`,
          method: "GET",
          showNotification: false,
        });
        const ticketsWithSerial = parkingTickets.map((ticket, index) => ({
          serial: (page - 1) * limit + index + 1,
          ...ticket,
        }));
        setTicketList(ticketsWithSerial);
        setAmountTotal({
          cash: 0,
          online: 0,
          free: 0,
          pass: 0,
        });
        setPagination({ ...pagination, total: totalCount });
      } else {
        const { totalCount, parkingTickets } = await sendRequest({
          url: `${
            import.meta.env.VITE_BACKEND_URL
          }${GET_ALL}?page=${page}&limit=${limit}&search=${searchText}&isPass=${isPass}&startDate=${formattedStartDate}&endDate=${formattedEndDate}`,
          method: "POST",
          showNotification: false,
          data: {
            supervisors,
            assistants,
          },
        });
        const total = await sendRequest({
          url: `${
            import.meta.env.VITE_BACKEND_URL
          }${GET_ALL_TICKETS_AMOUNT_TOTAL}?page=${page}&limit=${limit}&search=${searchText}&startDate=${formattedStartDate}&endDate=${formattedEndDate}`,
          method: "POST",
          showNotification: false,
          data: {
            supervisors,
            assistants,
          },
        });

        setAmountTotal(total);
        const ticketsWithSerial = parkingTickets.map((ticket, index) => ({
          serial: (page - 1) * limit + index + 1,
          ...ticket,
        }));
        setTicketList(ticketsWithSerial);
        setPagination({ ...pagination, total: totalCount });
      }
    } catch (error) {
      console.error(error);
      setTicketList([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getTicketLocation = async (ticket) => {
    setIsLoading(true);
    const {
      address: { latitude, longitude },
    } = ticket;
    try {
      if (!latitude || !longitude) {
        message.error("No Lattitude or Longitude");
        throw new Error("No Lattitude or Longitude");
      }
      const response = await sendRequest({
        url: `${
          import.meta.env.VITE_BACKEND_URL
        }${GET_LOCATION}?lat=${latitude}&lon=${longitude}`,
        method: "GET",
        showNotification: false,
      });
      setAddresses((prev) => ({
        ...prev,
        [ticket._id]: response[0].formattedAddress, // Assume response.data.address contains the address string
      }));
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteAndRestoreTicket = async (id) => {
    setIsLoading(true);

    try {
      if (!id) {
        message.error("No Id to delete the Ticket");
        throw new Error("No Id to delete the Ticket");
      }
      await sendRequest({
        url: `${import.meta.env.VITE_BACKEND_URL}${
          ticketType ? DELTE_TICEKT_BY_ID : RESTORE_TICEKT_BY_ID
        }/${id}`,
        method: ticketType ? "DELETE" : "GET",
        showNotification: true,
        data: {},
      });
      getTicketList(
        pagination.current,
        pagination.limit,
        searchText,
        supervisors,
        assitants
      );
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getTicketList(
      pagination.current,
      pagination.limit,
      searchText,
      supervisors,
      assitants
    );
  }, [
    pagination.current,
    pagination.limit,
    searchText,
    dateRange,
    ticketType,
    isPass,
  ]);

  const handlePageChange = (page, limit) => {
    setPagination({ current: page, limit, total: pagination.total });
  };

  const handleSearch = (value) => setSearchText(value);
  const columns = [
    {
      title: "Sr No.",
      dataIndex: "serial", // This might need to be manually assigned since it's not in the data.
      key: "serial",
      width: 70,
    },
    {
      title: "Address",
      key: "address",
      width: 150,
      render: (_, record) => (
        <>
          <Button
            type="primary"
            onClick={() => getTicketLocation(record)}
            disabled={!!addresses[record._id]}
          >
            Show Address
          </Button>
          <p
            style={
              addresses[record._id] ? { display: "block" } : { display: "none" }
            }
          >
            {" "}
            {addresses[record._id]}
          </p>
        </>
      ),
    },
    {
      title: "Action",
      key: "action",
      width: 150,
      render: (_, record) => (
        <>
          {!ticketType ? (
            <Button
              type="primary"
              onClick={() => deleteAndRestoreTicket(record._id)}
            >
              Restore Ticket
            </Button>
          ) : (
            <Button
              type="primary"
              onClick={() => deleteAndRestoreTicket(record._id)}
            >
              Delete Ticket
            </Button>
          )}
        </>
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: 100,
    },
    {
      title: "Ticket Id",
      dataIndex: "ticketRefId",
      key: "ticketRefId",
      width: 100,
    },
    {
      title: "Vehicle Number",
      dataIndex: "vehicleNumber",
      key: "vehicleNumber",
      width: 100,
    },
    {
      title: "Payment Mode",
      dataIndex: "paymentMode",
      key: "paymentMode",
      width: 100,
      render: (paymentMode) => (
        <Tag color={paymentMode === "Pass" ? "green" : "volcano"}>
          {paymentMode}
        </Tag>
      ),
    },
    {
      title: "Ticket / pass",
      dataIndex: "isPass",
      key: "isPass",
      width: 100,
      render: (isPass) => (
        <Tag color={"yellow"}>{isPass ? "Pass" : "Ticket"}</Tag>
      ),
    },
    {
      title: "Contact No",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      width: 100,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (status) => (
        <Tag color={status === "paid" ? "green" : "gold"}>{status}</Tag>
      ),
    },
    {
      title: "Parking Assistant",
      dataIndex: ["parkingAssistantDetails", "name"],
      key: "parkingAssistantDetails",
      width: 150,
    },
    {
      title: "Assistant Contact",
      dataIndex: ["parkingAssistantDetails", "phone"],
      key: "assistantContact",
      width: 120,
    },
    {
      title: "Supervisor Code",
      dataIndex: ["parkingAssistantDetails", "supervisorCode"],
      key: "supervisorCode",
      width: 100,
    },
    {
      title: "Supervisor Name",
      dataIndex: ["supervisorDetails", "name"],
      key: "supervisorName",
      width: 100,
    },
    {
      title: "Vehicle Type",
      dataIndex: "vehicleType",
      key: "vehicleType",
      width: 100,
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      width: 100,
      render: (amount) => `₹ ${amount.toFixed(2)}`,
    },
    {
      title: "Base Amount",
      dataIndex: "baseAmount",
      key: "baseAmount",
      width: 100,
      render: (baseAmount) => `₹ ${baseAmount?.toFixed(2)}`,
    },
    {
      title: "CGST",
      dataIndex: "cgst",
      key: "cgst",
      width: 100,
      render: (cgst) => `₹ ${cgst?.toFixed(2)}`,
    },
    {
      title: "SGST",
      dataIndex: "sgst",
      key: "sgst",
      width: 100,
      render: (sgst) => `₹ ${sgst?.toFixed(2)}`,
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 150,
      render: (date) => moment(date).format("MMMM Do YYYY, h:mm:ss a"),
    },
    {
      title: "Expiry Date",
      dataIndex: "ticketExpiry",
      key: "ticketExpiry",
      width: 150,
      render: (date) => moment(date).format("MMMM Do YYYY, h:mm:ss a"),
    },
  ];
  const handleDateChange = (dates) => {
    if (dates && dates.length === 2) {
      setDateRange(dates);
    } else {
      setDateRange([]);
    }
  };
  const handleTicketType = (value) => {
    setIsPass(value);
  };

  return (
    <>
      <Card title="Tickets List">
        <Row gutter={16} style={{ marginBottom: "1rem" }}>
          <Col xs={24} sm={12} md={8} lg={8}>
            <Card bordered={false} style={{ marginBottom: "0.5rem" }}>
              <Statistic
                title="Total Tickets Collection"
                value={amountTotal.cash + amountTotal.online}
                precision={0}
                valueStyle={{ color: "#3f8600" }}
                suffix="₹"
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8} lg={8}>
            <Card bordered={false} style={{ marginBottom: "0.5rem" }}>
              <Statistic
                title="Tickets Cash Collection"
                value={amountTotal.cash}
                precision={0}
                valueStyle={{ color: "#3f8600" }}
                prefix={amountTotal.cash > 0 ? <ArrowUpOutlined /> : <></>}
                suffix="₹"
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8} lg={8}>
            <Card bordered={false} style={{ marginBottom: "0.5rem" }}>
              <Statistic
                title="Tickets Online Collection"
                value={amountTotal.online}
                precision={0}
                valueStyle={{ color: "#3f8600" }}
                prefix={amountTotal.online > 0 ? <ArrowUpOutlined /> : <></>}
                suffix="₹"
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8} lg={8}>
            <Card bordered={false} style={{ marginBottom: "0.5rem" }}>
              <Statistic
                title="Pass Total Collection"
                value={amountTotal.passOnline + amountTotal.passCash}
                precision={0}
                valueStyle={{ color: "#3f8600" }}
                prefix={amountTotal.pass > 0 ? <ArrowUpOutlined /> : <></>}
                suffix="₹"
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8} lg={8}>
            <Card bordered={false} style={{ marginBottom: "0.5rem" }}>
              <Statistic
                title="Pass Cash Collection"
                value={amountTotal.passCash}
                precision={0}
                valueStyle={{ color: "#3f8600" }}
                prefix={amountTotal.pass > 0 ? <ArrowUpOutlined /> : <></>}
                suffix="₹"
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8} lg={8}>
            <Card bordered={false} style={{ marginBottom: "0.5rem" }}>
              <Statistic
                title="Pass Online Collection"
                value={amountTotal.passOnline}
                precision={0}
                valueStyle={{ color: "#3f8600" }}
                prefix={amountTotal.pass > 0 ? <ArrowUpOutlined /> : <></>}
                suffix="₹"
              />
            </Card>
          </Col>
          <Divider />

          <Col xs={24} sm={12} md={8} lg={8}>
            <Card bordered={false} style={{ marginBottom: "0.5rem" }}>
              <Statistic
                title="Total Collection"
                value={
                  amountTotal.cash +
                  amountTotal.online +
                  amountTotal.passCash +
                  amountTotal.passOnline
                }
                precision={0}
                valueStyle={{ color: "#3f8600" }}
                suffix="₹"
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginBottom: "1rem" }}>
          <Col xs={24} sm={12} md={8} lg={8}>
            <Search
              placeholder="Search tickets"
              onSearch={handleSearch}
              style={{ width: "100%" }}
            />
          </Col>
          <Col xs={24} sm={12} md={8} lg={8}>
            <UserFilter
              getTicketList={getTicketList}
              pagination={pagination}
              searchText={searchText}
              setSupervisors={setSupervisors}
              setAssistants={setAssistants}
            />
          </Col>
          <Col xs={24} sm={12} md={8} lg={8}>
            <RangePicker
              onChange={handleDateChange}
              format="YYYY-MM-DD"
              allowClear={true} // Prevent clearing of date range to ensure consistency
              style={{ width: "100%" }}
            />
          </Col>
          <Col xs={24} sm={12} md={8} lg={8}>
            <Select
              placeholder="Select Type of Ticket"
              style={{ width: "100%" }}
              onChange={handleTicketType}
              value={isPass}
            >
              <Option key={"all"} value={"all"}>
                All
              </Option>
              <Option key={"pass"} value={"pass"}>
                Pass
              </Option>
              <Option key={"ticket"} value={"ticket"}>
                Ticket
              </Option>
            </Select>
          </Col>

          <Col xs={24} sm={12} md={8} lg={8}>
            <Switch
              checkedChildren={"Regular"}
              unCheckedChildren={"Deleted"}
              value={ticketType}
              onChange={(value) => setTicketType(value)}
            />
          </Col>
          <Col xs={24} sm={12} md={8} lg={8}>
            <DownloadReport
              supervisors={supervisors}
              assistants={assitants}
              startDate={dateRange?.[0]}
              endDate={dateRange?.[1]}
              searchText={searchText}
              setIsLoading={setIsLoading}
              isPass={isPass}
            />
          </Col>
        </Row>
        <Table
          columns={columns}
          dataSource={ticketList}
          loading={isLoading}
          pagination={false}
          scroll={{ x: 350, y: 400 }}
        />
        <Pagination
          current={pagination.current}
          pageSize={pagination.limit}
          total={pagination.total}
          onChange={handlePageChange}
          showSizeChanger
        />
      </Card>
      <Outlet />
    </>
  );
};

export default TicketList;
