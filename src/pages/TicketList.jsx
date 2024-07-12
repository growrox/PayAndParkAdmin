import React, { useState, useEffect } from "react";
import { Card, Table, Pagination, Button, Input, Tag, Space } from "antd";
import { Outlet } from "react-router-dom";
import useApiRequest from "../components/common/useApiRequest";
import { ROUTES } from "../utils/routes";

const { Search } = Input;

const TicketList = () => {
  const { sendRequest } = useApiRequest();
  const [isLoading, setIsLoading] = useState(false);
  const [ticketList, setTicketList] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [addresses, setAddresses] = useState({});

  const {
    TICKET: { GET_ALL, GET_LOCATION },
  } = ROUTES;

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 50,
    total: 0,
  });

  const getTicketList = async (page = 1, pageSize = 50, searchText = "") => {
    setIsLoading(true);
    try {
      const { totalCount, parkingTickets } = await sendRequest({
        url: `${
          import.meta.env.VITE_BACKEND_URL
        }${GET_ALL}?page=${page}&pageSize=${pageSize}&search=${searchText}`,
        method: "GET",
        showNotification: false,
      });
      const ticketsWithSerial = parkingTickets.map((ticket, index) => ({
        serial: (page - 1) * pageSize + index + 1,
        ...ticket,
      }));
      setTicketList(ticketsWithSerial);
      setPagination({ ...pagination, total: totalCount });
    } catch (error) {
      console.error(error);
      setTicketList([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getTicketLocation = async (ticket) => {
    setIsLoading(true);
    let lat = 19.2856,
      lon = 72.8691;
    try {
      const response = await sendRequest({
        url: `${
          import.meta.env.VITE_BACKEND_URL
        }${GET_LOCATION}?lat=${lat}&lon=${lon}`,
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

  useEffect(() => {
    getTicketList(pagination.current, pagination.pageSize, searchText);
  }, [pagination.current, pagination.pageSize, searchText]);

  const handlePageChange = (page, pageSize) => {
    setPagination({ current: page, pageSize, total: pagination.total });
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
          <p> {addresses[record._id]}</p>
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
      dataIndex: ["parkingAssistant", "name"],
      key: "parkingAssistant",
      width: 150,
    },
    {
      title: "Assistant Contact",
      dataIndex: ["parkingAssistant", "phone"],
      key: "assistantContact",
      width: 120,
    },
    {
      title: "Supervisor Code",
      dataIndex: ["parkingAssistant", "supervisorCode"],
      key: "supervisorCode",
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
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 150,
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Vehicle Type",
      dataIndex: "vehicleType",
      key: "vehicleType",
      width: 100,
    },
  ];

  return (
    <>
      <Card title="Tickets List">
        <Search
          placeholder="Search tickets"
          onSearch={handleSearch}
          style={{ width: 200, marginBottom: 16 }}
        />
        <Table
          columns={columns}
          dataSource={ticketList}
          loading={isLoading}
          pagination={false}
          scroll={{ y: 500 }}
        />
        <Pagination
          current={pagination.current}
          pageSize={pagination.pageSize}
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
