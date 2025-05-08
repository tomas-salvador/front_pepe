// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import dataService from '../services/dataService';

import { Box, Typography, Container, Grid, Divider } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

import ModernSidebar from '../components/Dashboard/Sidebar';
import ModernHeader from '../components/Dashboard/Header';
import StatsCard from '../components/StatsCard';
import HourlyChart from '../components/HourlyChart';
import PieDemoChart from '../components/PieDemoChart';
import LoadingSpinner from '../components/Common/LoadingSpinner';

const drawerWidth = 240;

const Dashboard = () => {
  const [user, setUser] = useState(() => dataService.getCachedUserProfile());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError('');

    const tokenExists = authService.getCurrentToken();
    if (!tokenExists) {
      navigate('/login');
      setLoading(false);
      return;
    }

    dataService.getUserProfile()
      .then(userData => {
        if (isMounted) {
          setUser(userData);
          setError('');
        }
      })
      .catch(err => {
        const status = err.response?.status;
        if (isMounted) {
          if (status === 401 || status === 422) {
            setError('Session expired. Please login again.');
            handleLogout();
          } else if (!user) {
            setError('Failed to load user data.');
          } else {
            setError('Could not refresh user data.');
          }
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false };
  }, [navigate, handleLogout]);

  if (loading && !user) {
    return (
      <Box sx={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
        <LoadingSpinner />
      </Box>
    );
  }

  if (error && !user) {
    return (
      <Box sx={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  // Datos simulados para demo
  const todayStats = {
    visitors: 582,
    dwellTime: '10m 32s',
    topSector: 'Sección A',
    bounceRate: '12%'
  };

  const monthStats = {
    totalVisitors: 15234,
    avgDwellTime: '15m 02s',
    mostVisited: 'Sección B',
    comparedToLast: '+8.2%'
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <ModernSidebar
        drawerWidth={drawerWidth}
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
        isMdUp={isMdUp}
        user={user}
        handleLogout={handleLogout}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'background.default',
        }}
      >
        {!isMdUp && (
          <ModernHeader
            user={user}
            drawerWidth={drawerWidth}
            handleDrawerToggle={handleDrawerToggle}
            isMdUp={isMdUp}
            handleLogout={handleLogout}
          />
        )}

        <Box component="section" sx={{ flexGrow: 1, p: 3, mt: `64px`, overflowY: 'auto' }}>
          <Container maxWidth={false}>
            <Typography variant="h4" mb={3}>Resumen de Tienda</Typography>

            {/* Sección Hoy */}
            <Typography variant="h6" mb={1}>Hoy</Typography>
            <Grid container spacing={2} mb={3}>
              <StatsCard title="Visitantes" value={todayStats.visitors} />
              <StatsCard title="Tiempo medio" value={todayStats.dwellTime} />
              <StatsCard title="Sección más visitada" value={todayStats.topSector} />
              <StatsCard title="Bounce rate" value={todayStats.bounceRate} />
            </Grid>

            <Divider sx={{ my: 2 }} />

            {/* Sección Mes */}
            <Typography variant="h6" mb={1}>Este mes</Typography>
            <Grid container spacing={2} mb={3}>
              <StatsCard title="Total de visitantes" value={monthStats.totalVisitors} />
              <StatsCard title="Permanencia media" value={monthStats.avgDwellTime} />
              <StatsCard title="Zona más visitada" value={monthStats.mostVisited} />
              <StatsCard title="Comparado con el mes pasado" value={monthStats.comparedToLast} />
            </Grid>

            <Divider sx={{ my: 2 }} />

            {/* Gráficos */}
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <HourlyChart />
              </Grid>
              <Grid item xs={12} md={4}>
                <PieDemoChart />
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
