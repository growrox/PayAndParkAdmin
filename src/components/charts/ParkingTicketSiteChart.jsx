import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { Card, Spin, Select, message, DatePicker, Row, Col } from "antd";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import useApiRequest from "../common/useApiRequest";
import { ROUTES } from "../../utils/routes";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const { Option } = Select;
const { RangePicker } = DatePicker;

const ParkingTicketsChart = () => {
  const [supervisors, setSupervisors] = useState([]);
  const [selectedSupervisor, setSelectedSupervisor] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const { sendRequest } = useApiRequest();
  const {
    USER: { GET_SUPERVISOR_WITH_ASSISTANT },
    SITE: { GET_PARKING_TICKET_BY_SITE_AND_SUPERVISOR },
  } = ROUTES;

  // Fetch supervisors
  useEffect(() => {
    const fetchSupervisors = async () => {
      try {
        const response = await sendRequest({
          url: `${
            import.meta.env.VITE_BACKEND_URL
          }${GET_SUPERVISOR_WITH_ASSISTANT}`,
          method: "GET",
          showNotification: false,
        });

        setSupervisors(response);
      } catch (error) {
        message.error("Failed to fetch supervisors.");
      }
    };

    fetchSupervisors();
  }, []);

  // Fetch chart data based on supervisor and date range
  useEffect(() => {
    if (selectedSupervisor && startDate && endDate) {
      const fetchData = async () => {
        setLoading(true);
        try {
          const response = await sendRequest({
            url: `${
              import.meta.env.VITE_BACKEND_URL
            }${GET_PARKING_TICKET_BY_SITE_AND_SUPERVISOR}/${selectedSupervisor}?startDate=${startDate.format(
              "YYYY-MM-DD"
            )}&endDate=${endDate.format("YYYY-MM-DD")}`,
            method: "GET",
            showNotification: false,
          });

          const sites = [];
          const dataByVehicleType = {};

          response.forEach((ticket) => {
            const { site, vehicleTypeCounts } = ticket;

            // Add site name if not already added
            if (!sites.includes(site.name)) {
              sites.push(site.name);
            }

            vehicleTypeCounts.forEach(({ vehicleType, count }) => {
              // Initialize vehicle type data array if not already initialized
              if (!dataByVehicleType[vehicleType]) {
                dataByVehicleType[vehicleType] = new Array(sites.length).fill(
                  0
                );
              }

              // Ensure all vehicle types have an entry for this site, even if it's 0
              Object.keys(dataByVehicleType).forEach((type) => {
                if (dataByVehicleType[type].length < sites.length) {
                  dataByVehicleType[type].push(0);
                }
              });

              // Add the count to the correct site index and vehicle type
              dataByVehicleType[vehicleType][sites.indexOf(site.name)] = count;
            });
          });

          // Convert dataByVehicleType to datasets format required by Chart.js
          const datasets = Object.keys(dataByVehicleType).map(
            (type, index) => ({
              label: type,
              data: dataByVehicleType[type],
              backgroundColor: getFixedLightColor(index),
              borderColor: getFixedLightColor(index),
              borderWidth: 1,
            })
          );

          setChartData({
            labels: sites,
            datasets,
          });
        } catch (error) {
          message.error("Failed to fetch data for the selected supervisor.");
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [selectedSupervisor, startDate, endDate]);

  const handleSupervisorChange = (value) => {
    setSelectedSupervisor(value);
  };

  const handleDateChange = (dates) => {
    if (dates) {
      setStartDate(dates[0]);
      setEndDate(dates[1]);
    }
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const lightColors = [
    "rgba(173, 216, 230, 0.6)", // Light Blue
    "rgba(144, 238, 144, 0.6)", // Light Green
    "rgba(255, 182, 193, 0.6)", // Light Pink
    "rgba(255, 255, 224, 0.6)", // Light Yellow
  ];

  const getFixedLightColor = (index) => {
    return lightColors[index % lightColors.length];
  };

  return (
    <Card title="Number of Parking Tickets by Vehicle Type and Site">
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Select
            placeholder="Select Supervisor"
            style={{ width: "100%" }}
            onChange={handleSupervisorChange}
          >
            {supervisors.map((supervisor) => (
              <Option key={supervisor._id} value={supervisor._id}>
                {supervisor.name}
              </Option>
            ))}
          </Select>
        </Col>
        <Col span={16}>
          <RangePicker
            style={{ width: "100%" }}
            onChange={handleDateChange}
            disabled={!selectedSupervisor} // Disable date selection until supervisor is selected
            format="YYYY-MM-DD"
          />
        </Col>
      </Row>

      {loading ? (
        <Spin />
      ) : chartData ? (
        <Bar data={chartData} options={options} />
      ) : (
        <p>Please select a supervisor and date range to view the data.</p>
      )}
    </Card>
  );
};

export default ParkingTicketsChart;
