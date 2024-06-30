import React from "react";
import { Avatar, Dropdown, Menu, Button, notification } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import userStore from "../../store/userStore";
import { MESSAGE } from "../../utils/helperConstant";
import { useNavigate } from "react-router-dom";

const CustomAvatar = () => {
  const { logout, user } = userStore();
  const navigate = useNavigate()
  const handleLogout = () => {
    logout();
    notification.success({ message: MESSAGE.successMessages.LoggedOut });
      navigate("/login")
    // window.location.href = "/"; // Use window.location.href for a full page refresh which is more reliable for logging out
  };
  const menu = (
    <Menu>
      <Menu.Item key="Name" disabled>
        <span> {user?.name}</span>
      </Menu.Item>

      <Menu.Item key="logout" onClick={handleLogout}>
        <Button icon={<LogoutOutlined />} type="primary">
          <span>Logout</span>
        </Button>
      </Menu.Item>
    </Menu>
  );
  return (
    <Dropdown overlay={menu} trigger={["click"]}>
      <Avatar
        style={{ cursor: "pointer", background: "#fff", color: "#1677ff" }}
        icon={<UserOutlined />}
        size="medium"
      ></Avatar>
    </Dropdown>
  );
};

export default CustomAvatar;
