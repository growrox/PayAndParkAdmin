import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Table,
  Pagination,
  Spin,
  Alert,
  Card,
  Flex,
  DatePicker,
  Input,
  Row,
  Col,
  Typography,
  Statistic,
  Tag,
} from "antd";
import { ROUTES } from "../utils/routes";
import useApiRequest from "../components/common/useApiRequest";
import moment from "moment";

const { RangePicker } = DatePicker;
const { Search } = Input;

const SettledTicketsTable = () => {
  const { id, name, role } = useParams();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCollection, setTotalCollection] = useState(0);
  const [totalCollected, setTotalCollected] = useState(0);
  const [totalFine, setTotalFine] = useState(0);
  const [totalReward, setTotalReward] = useState(0);
  const {
    SUPERVISOR: { GET_SETTLED_TICKETS: SUPERVISOR },
    ACCOUNTANT: { GET_SETTLED_TICKETS: ACCOUNTANT },
  } = ROUTES;
  const navigate = useNavigate();
  const { sendRequest } = useApiRequest();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 50,
    total: 0,
  });
  const [dateRange, setDateRange] = useState([null, null]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchTickets = async (page, pageSize) => {
    try {
      const query = new URLSearchParams({
        page,
        pageSize,
        ...(dateRange?.[0] && { startDate: moment(new Date(dateRange[0])) }),
        ...(dateRange?.[1] && { endDate: moment(new Date(dateRange[1])) }),
        ...(searchTerm && { searchQuery: searchTerm }),
      }).toString();

      const {
        tickets,
        pagination: { totalCount },
        stats: {
          totalCollectedAmount,
          totalCollection,
          totalFine,
          totalReward,
        },
      } = await sendRequest({
        url: `${import.meta.env.VITE_BACKEND_URL}${
          role === "supervisor" ? SUPERVISOR : ACCOUNTANT
        }/${id}?${query}`,
        method: "GET",
        showNotification: false,
      });

      const ticketList = tickets?.map((ticket, index) => {
        return {
          ...ticket,
          serial: (page - 1) * pageSize + index + 1,
          // _id: ticket._id.slice(0, 5),
          createdAt: moment(ticket.createdAt).format("DD-MM-YYYY HH:ss"),
        };
      });
      setTickets(ticketList);
      setPagination({
        ...pagination,
        total: totalCount || 0,
      });
      setTotalCollection(
        role === "supervisor" ? totalCollection || 0 : totalCollectedAmount || 0
      );
      if (role !== "accountant") {
        setTotalCollected(totalCollectedAmount);
        setTotalReward(totalReward);
        setTotalFine(totalFine);
      }
    } catch (err) {
      console.log({ error });
      setTickets([]);
      setTotalCollection(0);
      setTotalCollected(0);
      setTotalReward(0);
      setTotalFine(0);
    } finally {
      setLoading(false);
    }

    if (!id) {
      navigate("/list-users");
    }
  };

  useEffect(() => {
    fetchTickets(pagination.current, pagination.pageSize);
  }, [id, pagination.current, pagination.pageSize, dateRange, searchTerm]);

  const handlePageChange = (page, size) => {
    setPagination({
      ...pagination,
      current: page,
      pageSize: size,
    });
  };

  const columns = [
    {
      title: "Sr No.",
      dataIndex: "serial",
      key: "serial",
      render: (text) => <a>{text}</a>,
      width: 70,
    },
    // {
    //   title: "Ticket ID",
    //   dataIndex: "_id",
    //   key: "id",
    //   width: 100,
    // },
    ...(role === "supervisor"
      ? [
          {
            title: "Total Collection (Online / Offline)",
            dataIndex: "totalCollection",
            key: "totalCollection",
            width: 150,
          },
          {
            title: "Total Reward",
            dataIndex: "totalReward",
            key: "totalReward",
            width: 150,
          },
          {
            title: "Total Fine",
            dataIndex: "totalFine",
            key: "totalFine",
            width: 150,
          },
          {
            title: "Total Collected Amount",
            dataIndex: "totalCollectedAmount",
            key: "totalCollectedAmount",
            width: 200,
          },
          {
            title: "Settled",
            dataIndex: "isSettled",
            key: "isSettled",
            render: () => <Tag color="green">Settled</Tag>,
            width: 150,
          },
          {
            title: "Accountant Settled",
            dataIndex: "accountantName",
            key: "accountantName",
            render: (accountantName, _) =>
              accountantName !== _?.parkingAssistantName ? (
                <Tag color="green">{accountantName}</Tag>
              ) : (
                <Tag color="red">Not Settled</Tag>
              ),
            width: 150,
          },
          {
            title: "Parking Assitant",
            dataIndex: "parkingAssistantName",
            key: "parkingAssistantName",
            render: (parkingAssistantName) => (
              <Tag color="green">{parkingAssistantName}</Tag>
            ),
            width: 150,
          },
        ]
      : [
          {
            title: "Supervisor Name",
            dataIndex: "supervisorName",
            key: "supervisorName",
            width: 200,
          },
          {
            title: "Supervisor Phone",
            dataIndex: "supervisorPhone",
            key: "supervisorPhone",
            width: 200,
          },
          {
            title: "Created At",
            dataIndex: "createdAt",
            key: "createdAt",
            width: 150,
          },
        ]),
  ];

  if (loading)
    return (
      <Flex style={{ height: "100vh" }} justify="center" align="center">
        <Spin size="large" />
      </Flex>
    );
  if (error)
    return (
      <Flex>
        <Alert message="Error" description={error} type="error" showIcon />
      </Flex>
    );

  return (
    <Card title={`${role} -> ${name} Settled Tickets`}>
      <Row gutter={[16, 16]} style={{ marginBottom: "16px" }}>
        <Col>
          <RangePicker
            value={dateRange}
            onChange={(dates) => setDateRange(dates)}
            disabled={loading}
          />
        </Col>
        <Col>
          <Search
            placeholder="Search tickets"
            onSearch={(value) => setSearchTerm(value)}
            allowClear
            disabled={loading}
          />
        </Col>
      </Row>
      <Flex style={{ marginBottom: "1rem" }} wrap gap={"0.5rem"}>
        <Card bordered={false}>
          <Statistic
            valueStyle={{ color: "#3f8600" }}
            title={
              +role !== "accountant"
                ? "Total Collection Online / Offline"
                : "Total Collection"
            }
            value={totalCollection}
          />
        </Card>
        {role !== "accountant" ? (
          <>
            <Card bordered={false}>
              <Statistic
                valueStyle={{ color: "#f8a81a" }}
                title="Total Reward"
                value={totalReward}
              />
            </Card>
            <Card bordered={false}>
              <Statistic
                valueStyle={{ color: "#cf1322" }}
                title="Total Fine"
                value={totalFine}
              />
            </Card>
            <Card bordered={false}>
              <Statistic
                valueStyle={{ color: "#3f8600" }}
                title="Total Cash Collected"
                value={totalCollected}
              />
            </Card>
          </>
        ) : (
          <></>
        )}
      </Flex>
      <Table
        dataSource={tickets}
        columns={columns}
        pagination={false}
        rowKey="_id"
        scroll={{ x: 350, y: 800 }}
      />
      <Pagination
        size="small"
        current={pagination.current}
        pageSize={pagination.pageSize}
        total={pagination.total}
        onChange={handlePageChange}
        showSizeChanger={true}
        className="user-pagination"
      />
    </Card>
  );
};

export default SettledTicketsTable;
