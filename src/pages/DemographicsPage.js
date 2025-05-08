// src/pages/DemographicsPage.jsx
import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Container, useMediaQuery, Grid, Paper
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ModernSidebar from '../components/Dashboard/Sidebar';
import ModernHeader from '../components/Dashboard/Header';
import authService from '../services/authService';
import dataService from '../services/dataService';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, Legend, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

const drawerWidth = 240;
const COLORS = ['#0088FE', '#FF8042', '#00C49F', '#FFBB28', '#8884d8'];

const genderData = [
  { name: 'Hombres', value: 55 },
  { name: 'Mujeres', value: 45 }
];

const ageData = [
  { name: '18-24', value: 15 },
  { name: '25-34', value: 30 },
  { name: '35-44', value: 25 },
  { name: '45-54', value: 20 },
  { name: '55+', value: 10 }
];

const DemographicsPage = () => {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState(() => dataService.getCachedUserProfile());
  const [loading, setLoading] = useState(true);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  useEffect(() => {
    let isMounted = true;
    const tokenExists = authService.getCurrentToken();
    if (!tokenExists) {
      navigate('/login');
      return;
    }

    dataService.getUserProfile()
      .then(userData => {
        if (isMounted) setUser(userData);
      })
      .catch(() => {
        if (isMounted) handleLogout();
      })
      .finally(() => { if (isMounted) setLoading(false); });

    return () => { isMounted = false; };
  }, [navigate]);

  if (loading && !user) {
    return <Box sx={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>Cargando...</Box>;
  }

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
            <Typography variant="h5" fontWeight="medium" sx={{ mb: 3 }}>
              Demografía de visitantes
            </Typography>

            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Paper elevation={3} sx={{ p: 3, height: 420 }}>
                  <Typography variant="h6" gutterBottom>
                    Distribución por género
                  </Typography>
                  <Box sx={{ height: 320 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={genderData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                          {genderData.map((entry, index) => (
                            <Cell key={`gender-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Legend />
                        <RechartsTooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                </Paper>
              </Grid>

              <Grid item xs={12} md={6}>
                <Paper elevation={3} sx={{ p: 3, height: 420 }}>
                  <Typography variant="h6" gutterBottom>
                    Distribución por rango de edad
                  </Typography>
                  <Box sx={{ height: 320 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={ageData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                          {ageData.map((entry, index) => (
                            <Cell key={`age-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Legend />
                        <RechartsTooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                </Paper>
              </Grid>
            </Grid>

          </Container>
        </Box>
      </Box>
    </Box>
  );
};

export default DemographicsPage;
