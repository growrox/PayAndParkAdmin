import "./App.css";

import React, { useState } from "react";

import { Button, Drawer, Layout, Menu, theme } from "antd";
import { Link, Outlet } from "react-router-dom";

import {
  CarOutlined,
  ExceptionOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  NodeExpandOutlined,
  ProfileFilled,
  TruckOutlined,
  UserSwitchOutlined,
  SisternodeOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";

import Logo from "../public/logo.png";
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
    {
      key: "/",
      icon: <ProfileFilled />,
      label: "Dashboard",
    },

    {
      icon: <UsergroupAddOutlined />,
      label: "User",
      children: [
        {
          key: "/create-user",
          icon: <ProfileFilled />,
          label: "Create User",
        },
        {
          key: "/list-user",
          icon: <UserSwitchOutlined />,
          label: "List Users",
        },
      ],
    },
    {
      icon: <UsergroupAddOutlined />,
      label: "Vehicle",
      children: [
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
      ],
    },

    {
      key: "/tickets-list",
      icon: <ExceptionOutlined />,
      label: "Ticket Lists",
    },
    {
      key: "/site-lists",
      icon: <SisternodeOutlined />,
      label: "Site List",
    },
  ].map((item) => ({
    ...item,
    label: (
      <Link style={{ color: "inherit" }} to={item.key}>
        {item.label}
      </Link>
    ),
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
      defaultSelectedKeys={["/"]}
      onClick={() => {
        setVisible(false);
      }}
      items={menuItems.map((item) => ({
        ...item,
        label: (
          <Link style={{ color: "inherit" }} to={item.key}>
            {item.label}
          </Link>
        ),
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
