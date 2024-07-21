import React, { useState, useEffect } from "react";
import {
  Card,
  Table,
  Pagination,
  Button,
  Input,
  Select,
  Space,
  Tag,
} from "antd";
import { Outlet, useNavigate } from "react-router-dom";
import { EyeOutlined } from "@ant-design/icons";
import useApiRequest from "../components/common/useApiRequest";
import { ROUTES } from "../utils/routes";
import UpdateUserModal from "../components/userUpdate";

const { Search } = Input;
const { Option } = Select;

const GetUser = () => {
  const { sendRequest } = useApiRequest();
  const [isLoading, setIsLoading] = useState(false);
  const [userList, setUserList] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [user, setUser] = useState({});
  const [shifts, setShifts] = useState([]);
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate()
  const {
    USER: { GET_ALL },
    SHIFT: { GET },
  } = ROUTES;

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 50,
    total: 0,
  });

  const getUserList = async (
    page = 1,
    pageSize = 50,
    searchText = "",
    selectedRole = ""
  ) => {
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
          shift: user?.shiftId?.name,
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
  const getShiftList = async () => {
    try {
      setIsLoading(true);
      const response = await sendRequest({
        url: `${import.meta.env.VITE_BACKEND_URL}${GET}`,
        method: "GET",
        showNotification: false,
      });
      setShifts(response);
    } catch (error) {
      setShifts([]);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getUserList(
      pagination.current,
      pagination.pageSize,
      searchText,
      selectedRole
    );
  }, [pagination.current, pagination.pageSize, searchText, selectedRole]);
  useEffect(() => {
    getShiftList();
  }, []);

  const handlePageChange = (page, size) => {
    setPagination({
      ...pagination,
      current: page,
      pageSize: size,
    });
  };

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const handleRoleChange = (value) => {
    setSelectedRole(value);
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
      title: "Actions",
      key: "actions",
      render: (_) => (
        <Space>
          <EyeOutlined onClick={() => handleUserUpdateModal(_)} />
            <Button onClick={() => navigate(`/supervisor/${_.name}/${_.role}/${_._id}`)}>
             Settled Tickets
            </Button>
        </Space>
      ),
      width: 160,
    },
    {
      title: "Name",
      dataIndex: "name", // Check if this should be "name"
      key: "name", // Matching with the key in the data object
      width: 100,
    },
    {
      title: "Online/Offline",
      dataIndex: "isOnline", // Check if this should be "name"
      key: "isOnline", // Matching with the key in the data object
      width: 100,
      render: (isOnline, _) => (
        <Space>
          {_.role === "assistant" ? (
            <>
              {isOnline ? (
                <Tag color="green">Online</Tag>
              ) : (
                <Tag color="red">Offline</Tag>
              )}
            </>
          ) : (
            <></>
          )}
        </Space>
      ),
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
      title: "Supervisor Code",
      dataIndex: "supervisorCode", // Check if this should be "name"
      key: "supervisorCode", // Matching with the key in the data object
      width: 100,
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      width: 100,
    },
    {
      title: "Shit",
      dataIndex: "shift",
      key: "shift",
      width: 100,
    },
   
  ];
  const handleUserUpdateModal = (data) => {
    setUser(data);
    setVisible(true);
  };

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
        <UpdateUserModal
          visible={visible}
          onCancel={(e) => {
            setVisible(false);
          }}
          user={user}
          shifts={shifts}
          getUserList={getUserList}
        />
      </Card>
      <Outlet />
    </>
  );
};

export default GetUser;
