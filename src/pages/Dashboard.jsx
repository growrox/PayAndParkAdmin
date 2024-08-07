import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import userStore from "../store/userStore";
import { Card, Col, Layout, Row, Statistic } from "antd";
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import { Content, Footer, Header } from "antd/es/layout/layout";
import ParkingTicketsChart from "../components/charts/ParkingTicketChart";
import ParkingTicketSiteChart from "../components/charts/ParkingTicketSiteChart";

const Dashboard = () => {
  const { isLoggedIn } = userStore();
  const navigate = useNavigate();
  useEffect(() => {
    console.log({ isLoggedIn });
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, []);

  return (
    <div>
      <div>
        <Layout>
          {/* <Header style={{ color: "white", textAlign: "center" }}>
            Parking Tickets Dashboard
          </Header> */}
          <Content style={{ padding: "50px" }}>
            <Row gutter={16} style={{ marginBottom: "1rem" }}>
              <Col span={12}>
                <Card bordered={false}>
                  <Statistic
                    title="Total Tickets Collection"
                    value={221233}
                    precision={2}
                    valueStyle={{ color: "#3f8600" }}
                  />
                </Card>
              </Col>
              <Col span={12}>
                <Card bordered={false}>
                  <Statistic
                    title="Online Users"
                    value={6}
                    valueStyle={{ color: "#3f8600" }}
                  />
                </Card>
              </Col>
            </Row>
            <div className="site-layout-content" style={{marginBottom: "1rem"}}>
              <ParkingTicketsChart />
            </div>
            <div className="site-layout-content">
              <ParkingTicketSiteChart />
            </div>
          </Content>
          <Footer style={{ textAlign: "center" }}>
            ©2024 Pay & Park Parking Tickets System
          </Footer>
        </Layout>
      </div>
    </div>
  );
};

export default Dashboard;
