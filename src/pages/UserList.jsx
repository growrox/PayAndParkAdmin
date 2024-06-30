import React, { useState, useEffect } from "react";
import { Card, Table, Pagination, Button, Input, Select } from "antd";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { EyeOutlined } from "@ant-design/icons";
import useApiRequest from "../components/common/useApiRequest";
import { ROUTES } from "../utils/routes";

const { Search } = Input;
const { Option } = Select;

const GetUser = () => {
  const { sendRequest } = useApiRequest();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [userList, setUserList] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedRole, setSelectedRole] = useState("");

  const {
    USER: { GET_ALL },
  } = ROUTES;

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 50,
    total: 0,
  });

  const getUserList = async (page = 1, pageSize = 50) => {
    try {
      setIsLoading(true);
      const {
        pagination: { totalCount },
        users,
      } = await sendRequest({
        url: `${
          import.meta.env.VITE_BACKEND_URL
        }${GET_ALL}?page=${page}&pageSize=${pageSize}&filter=${searchText}&role=${selectedRole}`,
        method: "GET",
        showNotification: false,
      });
      const userList = users.map((user, index) => {
        return {
          serial: (page - 1) * pageSize + index + 1,
          ...user,
        };
      });
      setUserList(userList);
      setPagination({
        ...pagination,
        total: totalCount,
      });
      setIsLoading(false);
    } catch (error) {
      setUserList([]);
      setPagination({
        ...pagination,
      });
      console.error(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getUserList(pagination.current, pagination.pageSize);
  }, [pagination.current, pagination.pageSize, searchText, selectedRole]);

  const handlePageChange = (page, size) => {
    setPagination({
      ...pagination,
      current: page,
      pageSize: size,
    });
  };

  const handleSearch = (value) => {
    setSearchText(value);
    getUserList(1, pagination.pageSize);
  };

  const handleRoleChange = (value) => {
    setSelectedRole(value);
    getUserList(1, pagination.pageSize);
  };

  const columns = [
    {
      title: "Sr No.",
      dataIndex: "serial",
      key: "serial",
      render: (text) => <a>{text}</a>,
      width: 70,
    },
    {
      title: "Name",
      dataIndex: "name", // Check if this should be "name"
      key: "name", // Matching with the key in the data object
      width: 100,
    },
    {
      title: "Contact No",
      dataIndex: "phone", // Check if this should be "name"
      key: "phone", // Matching with the key in the data object
      width: 100,
    },
    {
      title: "Code",
      dataIndex: "code", // Check if this should be "name"
      key: "code", // Matching with the key in the data object
      width: 100,
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      width: 100,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Link to={`/user/sales/${record._id}`}>
          <EyeOutlined />
        </Link>
      ),
      width: 60,
    },
  ];

  return (
    <>
      <Card title="User List">
        <Search
          placeholder="Search by name"
          onSearch={handleSearch}
          style={{ width: 200, marginBottom: 16 }}
        />
        <Select
          placeholder="Select a role"
          onChange={handleRoleChange}
          style={{ width: 200, marginBottom: 16, marginLeft: 16 }}
        >
          <Option value="">All</Option>
          <Option value="superadmin">Super Admin</Option>
          <Option value="supervisor">Supervisor</Option>
          <Option value="accountant">Accountant</Option>
          <Option value="assistant">Assistant</Option>
        </Select>
        <Table
          columns={columns}
          dataSource={userList}
          size="small"
          loading={isLoading}
          scroll={{ x: 350, y: 800 }}
          pagination={false}
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
      <Outlet />
    </>
  );
};

export default GetUser;
