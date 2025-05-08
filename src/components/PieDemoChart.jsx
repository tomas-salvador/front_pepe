// src/components/PieDemoChart.jsx
import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { Card, CardContent, Typography } from '@mui/material';

ChartJS.register(ArcElement, Tooltip, Legend);

const PieDemoChart = () => {
  const data = {
    labels: ['Hombres', 'Mujeres', 'Otros'],
    datasets: [
      {
        label: 'Visitantes',
        data: [55, 40, 5],
        backgroundColor: ['#42a5f5', '#ef5350', '#ffca28'],
        borderWidth: 1,
      },
    ],
  };

  return (
    <Card elevation={3} sx={{ borderRadius: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Reparto por género (demo)
        </Typography>
        <Pie data={data} />
      </CardContent>
    </Card>
  );
};

export default PieDemoChart;
