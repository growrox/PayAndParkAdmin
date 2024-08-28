import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Card } from "antd";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ParkingTicketsChart = ({ data }) => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const generateChartData = async () => {
      try {
        if (Object.keys(data).length > 0) {
          const labels = data.chartData.map((entry) => entry.date);
          const dailyCollections = data.chartData.map(
            (entry) =>
              entry.cashTotal +
              entry.onlineTotal +
              entry.passTotal +
              entry.freeTotal
          );

          setChartData({
            labels: labels,
            datasets: [
              {
                label: "Daily Collection (Rs)",
                data: dailyCollections,
                fill: false,
                backgroundColor: "rgba(75,192,192,0.2)",
                borderColor: "rgba(75,192,192,1)",
              },
            ],
          });
        }
      } catch (error) {
        console.error("Error fetching parking ticket data:", error);
      }
    };

    generateChartData();
  }, [data]);

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <Card title="Total Parking Tickets Daily Collection">
      <div
        style={{
          width: "100%",
          height: "500px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {chartData ? (
          <Line data={chartData} options={options} />
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </Card>
  );
};

export default ParkingTicketsChart;
