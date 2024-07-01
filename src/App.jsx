import React, { useState } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
  UsergroupAddOutlined,
  UserSwitchOutlined,
  ProfileFilled,
  CarOutlined,
  TruckOutlined,
} from "@ant-design/icons";
import { Button, Drawer, Layout, Menu, notification, theme } from "antd";
import "./App.css";
import { Link, Outlet } from "react-router-dom";
import Logo from "../public/logo.png";
import { MESSAGE } from "./utils/helperConstant";
import userStore from "./store/userStore";
import CustomAvatar from "./components/common/avatar";

const { Header, Sider, Content } = Layout;

function App({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [visible, setVisible] = useState(false);
  const handleMenuCollapse = () => {
    if (window.innerWidth <= 768) {
      setVisible(!visible);
    } else {
      setCollapsed(!collapsed);
    }
  };

  const menuItems = [
    // {
    //   key: "/create-user",
    //   icon: <UsergroupAddOutlined />,
    //   label: "User",
    // },
    {
      key: "/create-user",
      icon: <ProfileFilled />,
      label: "Create User",
    },
    {
      key: "/list-user",
      icon: <UserSwitchOutlined />,
      label: "List User",
    },
    {
      key: "/create-vehicle",
      icon: <CarOutlined />,
      label: "Create Vehicle",
    },
    {
      key: "/vehicle-list",
      icon: <TruckOutlined />,
      label: "Vehicle List",
    },
  ].map((item) => ({
    ...item,
    label: <Link to={item.key}>{item.label}</Link>,
    children: item.children
      ? item.children
          .filter((child) => child.visible !== false)
          .map((child) => ({
            ...child,
            label: <Link to={child.key}>{child.label}</Link>,
          }))
      : undefined,
  }));

  const renderMenu = (
    <Menu
      theme="dark"
      mode="inline"
      defaultSelectedKeys={["1"]}
      items={menuItems.map((item) => ({
        ...item,
        label: <Link to={item.key}>{item.label}</Link>,
      }))}
    />
  );
  return (
    <Layout>
      <Sider
        collapsed={collapsed}
        onCollapse={setCollapsed}
        className="desktop-sider"
        style={{ overflowY: "scroll" }}
      >
        <div className="logo">
          <Link to="/">
            <img src={Logo} alt="Logo" />
          </Link>
        </div>
        {renderMenu}
      </Sider>
      <Drawer
        placement="left"
        onClose={() => {
          setVisible(false);
        }}
        visible={visible}
        bodyStyle={{ padding: 0 }}
        className="mobile-drawer custom-drawer"
        theme="dark"
      >
        <div style={{ flex: 1, overflow: "auto" }}>{renderMenu}</div>
      </Drawer>
      <Layout className="site-layout">
        <Header className="site-layout-header">
          <Button
            type="primary"
            onClick={handleMenuCollapse}
            className="menu-collapse-button"
          >
            {React.createElement(
              collapsed ? MenuUnfoldOutlined : MenuFoldOutlined
            )}
          </Button>
          <CustomAvatar />
        </Header>

        <Content
          // style={{ margin: "24px 16px" }}
          className="site-layout-content"
        >
          {children}
        </Content>
      </Layout>
      <Outlet />
    </Layout>
  );
}

export default App;
