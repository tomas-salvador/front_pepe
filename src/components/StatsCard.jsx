// src/components/StatsCard.jsx
import React from 'react';
import { Card, CardContent, Typography, Grid } from '@mui/material';

const StatsCard = ({ title, value }) => {
  return (
    <Grid item xs={12} sm={6} md={6} lg={3}>
      <Card elevation={3} sx={{ borderRadius: 2 }}>
        <CardContent>
          <Typography variant="subtitle2" color="textSecondary">
            {title}
          </Typography>
          <Typography variant="h5">
            {value}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default StatsCard;