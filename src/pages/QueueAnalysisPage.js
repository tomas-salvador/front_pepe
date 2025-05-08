// src/pages/QueueAnalysisPage.jsx
import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Container, Grid, Paper
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useNavigate } from 'react-router-dom';
import ModernSidebar from '../components/Dashboard/Sidebar';
import ModernHeader from '../components/Dashboard/Header';
import authService from '../services/authService';
import dataService from '../services/dataService';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine
} from 'recharts';

const drawerWidth = 240;

const demoData = [
  { name: 'Pantalones', colaPromedio: 4, maxCola: 8 },
  { name: 'Camisetas', colaPromedio: 3, maxCola: 6 },
  { name: 'Vestidos', colaPromedio: 2, maxCola: 5 },
  { name: 'Probadores', colaPromedio: 5, maxCola: 10 },
  { name: 'Cajas', colaPromedio: 6, maxCola: 12 },
];

const QueueAnalysisPage = () => {
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
              Análisis de colas por sección
            </Typography>

            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Paper elevation={3} sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Tamaño medio de colas por sección
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={demoData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <ReferenceLine y={7} stroke="red" label="Límite" />
                      <Bar dataKey="colaPromedio" fill="#1976d2" name="Cola promedio" />
                    </BarChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>

              <Grid item xs={12} md={6}>
                <Paper elevation={3} sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Tamaño máximo de colas por sección
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={demoData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <ReferenceLine y={10} stroke="orange" label="Límite recomendado" />
                      <Bar dataKey="maxCola" fill="#ef6c00" name="Máximo observado" />
                    </BarChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Box>
    </Box>
  );
};

export default QueueAnalysisPage;
