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
  Tooltip,
  Flex,
} from "antd";
import { Outlet, useNavigate } from "react-router-dom";
import {
  EditOutlined,
  ReconciliationOutlined,
  DatabaseOutlined,
} from "@ant-design/icons";
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
  const navigate = useNavigate();
  const {
    USER: { GET_ALL },
    SHIFT: { GET },
  } = ROUTES;

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0,
  });

  const getUserList = async (
    page = 1,
    pageSize = 20,
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
          shift: user?.shiftId?.name || "NA",
          site: user?.siteId?.name || "NA",
          ...user,
          code: user.code ? user.code : user.supervisorCode,
          // shift: user.shift ? user.shift : "No Shift Alloted"
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
      width: 50,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_) => (
        <Space>
          <Tooltip title="Edit User">
            <EditOutlined
              style={{ fontSize: "18px", color: "#f8a81a" }}
              onClick={() => handleUserUpdateModal(_)}
            />
          </Tooltip>
          {_.role === "accountant" || _.role === "supervisor" ? (
            <Tooltip title="Settled Tickets">
              <ReconciliationOutlined
                style={{ fontSize: "18px", color: "#10679b" }}
                onClick={() =>
                  navigate(`/supervisor/${_.name}/${_.role}/${_._id}`)
                }
              />
            </Tooltip>
          ) : (
            <></>
          )}
          {_.role === "assistant" ? (
            <Tooltip title="Attendance">
              <DatabaseOutlined
                style={{ fontSize: "18px", color: "#df3c59" }}
                onClick={() => navigate(`/attendance/${_._id}/${_.name}`)}
              />
            </Tooltip>
          ) : (
            <></>
          )}
        </Space>
      ),
      width: 70,
    },
    {
      title: "Name",
      dataIndex: "name", // Check if this should be "name"
      key: "name", // Matching with the key in the data object
      width: 100,
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      width: 100,
    },
    {
      title: "Code",
      dataIndex: "code", // Check if this should be "name"
      key: "code", // Matching with the key in the data object
      width: 100,
    },
    {
      title: "Online/Offline",
      dataIndex: "isOnline", // Check if this should be "name"
      key: "isOnline", // Matching with the key in the data object
      width: 150,
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
            <Tag color="yellow">No Attendance</Tag>
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
      title: "Shit",
      dataIndex: "shift",
      key: "shift",
      width: 150,
    },
    {
      title: "Site",
      dataIndex: "site",
      key: "site",
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
        <Flex>
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
        </Flex>
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
