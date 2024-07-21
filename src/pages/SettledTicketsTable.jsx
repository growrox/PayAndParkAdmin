import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Table, Pagination, Spin, Alert, Card, Flex } from 'antd';
import { ROUTES } from '../utils/routes';
import useApiRequest from '../components/common/useApiRequest';

const SettledTicketsTable = () => {
  const { id,name,role } = useParams();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { SUPERVISOR: { GET_SETTLED_TICKETS: SUPERVISOR },ACCOUNTANT: { GET_SETTLED_TICKETS: ACCOUNTANT }  } = ROUTES;
  const navigate = useNavigate();
  const { sendRequest } = useApiRequest();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 50,
    total: 0,
  });
  const fetchTickets = async (page, pageSize) => {
    try {
      const {tickets, pagination: {totalCount}} = await sendRequest({
        url: `${import.meta.env.VITE_BACKEND_URL}${role === "supervisor" ?  SUPERVISOR : ACCOUNTANT}/${id}?page=${page}&pageSize=${pageSize}`,
        method: 'GET',
        showNotification: false,
      });
      const ticketList = tickets?.map((ticket, index) => {
        return {
          ...ticket,
          serial: (page - 1) * pageSize + index + 1,
          _id: ticket._id.slice(0,5),
        };
      });
      setTickets(ticketList);
      setPagination({
        ...pagination,
        total: totalCount,
      });
    } catch (err) {
      setError(err.message);
      setTickets([]);
    }finally{
      setLoading(false);
    }

    if (!id) {
      navigate('/list-users');
    }
  };

  useEffect(() => {
    fetchTickets(pagination.current, pagination.pageSize);
  }, [id, pagination.current, pagination.pageSize]);


  const handlePageChange = (page, size) => {
    setPagination({
      ...pagination,
      current: page,
      pageSize: size,
    });
  };

  const columns = [
    {
      title: 'Sr No.',
      dataIndex: 'serial',
      key: 'serial',
      render: text => <a>{text}</a>,
      width: 70,
    },
    {
      title: 'Ticket ID',
      dataIndex: '_id',
      key: 'id',
    },
    {
      title: 'Total Collected Amount',
      dataIndex: 'totalCollectedAmount',
      key: 'totalCollectedAmount',
    },
    ...(role === 'supervisor'
      ? [
          {
            title: 'Total Collection',
            dataIndex: 'totalCollection',
            key: 'totalCollection',
          },
          {
            title: 'Total Fine',
            dataIndex: 'totalFine',
            key: 'totalFine',
          },
          {
            title: 'Total Reward',
            dataIndex: 'totalReward',
            key: 'totalReward',
          },
          {
            title: 'Is Settled',
            dataIndex: 'isSettled',
            key: 'isSettled',
            render: isSettled => (isSettled ? 'Yes' : 'No'),
          },
        ]
      : [
        {
          title: 'Supervisor Name',
          dataIndex: ['supervisor','name'],
          key: ['supervisor','name'],
        },
        {
          title: 'Supervisor Code',
          dataIndex: ['supervisor','code'],
          key: ['supervisor','name'],
        },
      ]),
  ];

  if (loading) return <Flex style={{height: "100vh"}} justify='center' align='center'> <Spin size="large" /></Flex>;
  if (error) return <Flex><Alert message="Error" description={error} type="error" showIcon /></Flex>;

  return (
    <Card title={`${name } Settled Tickets`}>
      <Table
        dataSource={tickets}
        columns={columns}
        pagination={false}
        rowKey="_id"
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
