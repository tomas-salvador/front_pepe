import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

const SummaryStatCard = ({ title, value, change, icon, color = 'primary' }) => {
  const isPositive = change && parseFloat(change) >= 0;
  const changeValue = change ? `${isPositive ? '+' : ''}${change}` : '';
  const changeColor = isPositive ? 'success.main' : 'error.main';

  return (
    <Card elevation={0} sx={{ borderRadius: 2, border: 1, borderColor: 'divider' }}> 
      <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2 }}>

        <Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {title}
          </Typography>
          <Typography variant="h5" component="div" fontWeight="bold" gutterBottom>
            {value}
          </Typography>
          {changeValue && (
            <Typography variant="caption" sx={{ color: changeColor, display: 'flex', alignItems: 'center' }}>
              {isPositive ? <ArrowUpwardIcon fontSize="inherit" sx={{ mr: 0.5 }} /> : <ArrowDownwardIcon fontSize="inherit" sx={{ mr: 0.5 }}/>}
              {changeValue}% from yesterday
            </Typography>
          )}
        </Box>
        {/* Icono */}
        <Avatar sx={{ bgcolor: `${color}.lighter`, color: `${color}.dark`, width: 48, height: 48 }}> 
           {icon}
        </Avatar>
      </CardContent>
    </Card>
  );
};


export default SummaryStatCard;