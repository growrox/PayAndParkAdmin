import React, { useState } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { Button, Drawer, Layout, Menu, theme } from "antd";
import "./App.css";
import { Link } from "react-router-dom";
import Logo from "../public/logo.png";

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

  const renderMenu = (
    <Menu
      theme="dark"
      mode="inline"
      defaultSelectedKeys={["1"]}
      items={[
        {
          key: "1",
          icon: <UserOutlined />,
          label: "nav 1",
        },
        {
          key: "2",
          icon: <VideoCameraOutlined />,
          label: "nav 2",
        },
        {
          key: "3",
          icon: <UploadOutlined />,
          label: "nav 3",
        },
      ]}
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
        </Header>

        <Content
          // style={{ margin: "24px 16px" }}
          className="site-layout-content"
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}

export default App;
