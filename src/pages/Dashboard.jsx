import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import userStore from "../store/userStore";
import { Card, Col, DatePicker, Layout, Row, Statistic } from "antd";
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import { Content, Footer, Header } from "antd/es/layout/layout";
import ParkingTicketsChart from "../components/charts/ParkingTicketChart";
import ParkingTicketSiteChart from "../components/charts/ParkingTicketSiteChart";
import moment from "moment";
import useApiRequest from "../components/common/useApiRequest";
import { ROUTES } from "../utils/routes";
const { RangePicker } = DatePicker;

const Dashboard = () => {
  const { isLoggedIn } = userStore();
  const navigate = useNavigate();
  const { sendRequest } = useApiRequest();
  const {
    TICKET: { GET_PARKING_TICKETS_IN_DATE_RANGE },
  } = ROUTES;
  useEffect(() => {
    console.log({ isLoggedIn });
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, []);

  const [dateRange, setDateRange] = useState([
    moment().subtract(7, "days"),
    moment(),
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({});
  const [totalCollection, setTotalCollection] = useState(0);
  const [totalNoOfOnlineUsers, setTotalNoOfOnlineUsers] = useState(0);

  const handleDateChange = (dates) => {
    if (dates && dates.length === 2) {
      setDateRange([
        dates[0].startOf("day"), // Ensure the start date is at the beginning of the day
        dates[1].endOf("day"), // Ensure the end date is at the end of the day
      ]);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [startDate, endDate] = dateRange;
        const response = await sendRequest({
          url: `${
            import.meta.env.VITE_BACKEND_URL
          }${GET_PARKING_TICKETS_IN_DATE_RANGE}?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`,
          method: "GET",
          showNotification: false,
        });
        console.log({ response });

        setTotalCollection(response?.totals?.totalAmount);
        setTotalNoOfOnlineUsers(response?.onlineUsers.length);

        setData(response);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [dateRange]);
  return (
    <div>
      <div>
        <Layout>
          {/* <Header style={{ color: "white", textAlign: "center" }}>
            Parking Tickets Dashboard
          </Header> */}
          <Content style={{ padding: "30px" }}>
            <Card
              loading={isLoading}
              extra={
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <label
                    style={{
                      fontSize: "16px",
                      marginRight: "1rem",
                    }}
                  >
                    Select Date Range:
                  </label>

                  <RangePicker
                    // value={dateRange}
                    onChange={handleDateChange}
                    format="YYYY-MM-DD"
                    allowClear={false} // Prevent clearing of date range to ensure consistency
                  />
                </div>
              }
            >
              <Row gutter={16} style={{ marginBottom: "1rem" }}>
                <Col span={12}>
                  <Card bordered={false}>
                    <Statistic
                      title="Total Tickets Collection"
                      value={totalCollection}
                      precision={2}
                      valueStyle={{ color: "#3f8600" }}
                    />
                  </Card>
                </Col>
                <Col span={12}>
                  <Card bordered={false}>
                    <Statistic
                      title="Online Users"
                      value={totalNoOfOnlineUsers}
                      valueStyle={{ color: "#3f8600" }}
                    />
                  </Card>
                </Col>
              </Row>
              <div
                className="site-layout-content"
                style={{ marginBottom: "1rem" }}
              >
                <ParkingTicketsChart data={data} />
              </div>
              <div className="site-layout-content">
                <ParkingTicketSiteChart />
              </div>
            </Card>
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
