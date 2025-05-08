// src/pages/HeatmapPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import dataService from '../services/dataService';

import {
  Box, Container, Typography, useMediaQuery, Toolbar
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

import ModernSidebar from '../components/Dashboard/Sidebar';
import ModernHeader from '../components/Dashboard/Header';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import HeatmapOverlay from '../components/Dashboard/HeatmapOverlay';

const drawerWidth = 240;

function HeatmapPage() {
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
            <Typography variant="h5" fontWeight="medium" sx={{ mb: 2 }}>
              Mapa de Calor de visitantes
            </Typography>
            <HeatmapOverlay />
          </Container>
        </Box>
      </Box>
    </Box>
  );
}

export default HeatmapPage;