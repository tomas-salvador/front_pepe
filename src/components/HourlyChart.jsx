// src/components/HourlyChart.jsx
import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
} from 'chart.js';
import { Card, CardContent, Typography } from '@mui/material';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const HourlyChart = () => {
  const data = {
    labels: [...Array(12)].map((_, i) => `${i + 8}:00`),
    datasets: [
      {
        label: 'Visitantes por hora',
        data: [5, 12, 20, 32, 40, 55, 49, 35, 25, 20, 14, 7],
        borderColor: '#1976d2',
        backgroundColor: 'rgba(25, 118, 210, 0.1)',
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: true },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  return (
    <Card elevation={3} sx={{ borderRadius: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Afluencia por hora (hoy)
        </Typography>
        <Line data={data} options={options} />
      </CardContent>
    </Card>
  );
};

export default HourlyChart;
