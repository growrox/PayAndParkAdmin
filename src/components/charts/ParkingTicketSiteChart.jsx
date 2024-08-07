import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Card } from 'antd';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ParkingTicketsChart = () => {
  const data = {
    labels: ['Site A', 'Site B', 'Site C', 'Site D', 'Site E'],
    datasets: [
      {
        label: '2 Wheeler',
        data: [30, 50, 70, 20, 90],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        label: '4 Wheeler',
        data: [40, 60, 80, 30, 100],
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
      {
        label: 'Light Vehicle',
        data: [20, 30, 50, 10, 60],
        backgroundColor: 'rgba(255, 206, 86, 0.2)',
        borderColor: 'rgba(255, 206, 86, 1)',
        borderWidth: 1,
      },
      {
        label: 'Heavy Vehicle',
        data: [10, 20, 30, 15, 40],
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      }
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <Card title="Number of Parking Tickets by Vehicle Type and Site">
      <Bar data={data} options={options} />
    </Card>
  );
};

export default ParkingTicketsChart;
