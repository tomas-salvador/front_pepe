// src/pages/HeatmapAdvancedPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import dataService from '../services/dataService';

import {
  Box,
  Container,
  Typography,
  Grid,
  Slider,
  TextField,
  Divider
} from '@mui/material';

import { DateRangePicker } from '@mui/x-date-pickers-pro';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

import ModernSidebar from '../components/Dashboard/Sidebar';
import ModernHeader from '../components/Dashboard/Header';
import HeatmapInteractive from '../components/HeatmapInteractive';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const drawerWidth = 240;

function HeatmapAdvancedPage() {
  const [user, setUser] = useState(() => dataService.getCachedUserProfile());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const [dateRange, setDateRange] = useState([null, null]);
  const [minPeople, setMinPeople] = useState(0);
  const [maxPeople, setMaxPeople] = useState(50);
  const [hourRange, setHourRange] = useState([8, 20]);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const handleLogout = useCallback(() => {
    authService.logout();
    navigate('/login');
  }, [navigate]);

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
  }, [navigate, handleLogout, user]);

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
              Mapa de Calor Avanzado
            </Typography>

            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Grid container spacing={2} alignItems="center" mb={2}>
                <Grid item xs={12} md={4}>
                  <DateRangePicker
                    startText="Desde"
                    endText="Hasta"
                    value={dateRange}
                    onChange={(newRange) => setDateRange(newRange)}
                    renderInput={(startProps, endProps) => (
                      <>
                        <TextField {...startProps} fullWidth margin="dense" />
                        <Box sx={{ mx: 1 }}> a </Box>
                        <TextField {...endProps} fullWidth margin="dense" />
                      </>
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography>Rango horario: {hourRange[0]}h - {hourRange[1]}h</Typography>
                  <Slider
                    value={hourRange}
                    onChange={(_, val) => setHourRange(val)}
                    min={0}
                    max={23}
                    valueLabelDisplay="auto"
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography>Número de personas</Typography>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <TextField
                      label="Mínimo"
                      type="number"
                      value={minPeople}
                      onChange={e => setMinPeople(Number(e.target.value))}
                      fullWidth
                    />
                    <TextField
                      label="Máximo"
                      type="number"
                      value={maxPeople}
                      onChange={e => setMaxPeople(Number(e.target.value))}
                      fullWidth
                    />
                  </Box>
                </Grid>
              </Grid>
            </LocalizationProvider>

            <Divider sx={{ my: 3 }} />

            <HeatmapInteractive
              filters={{ dateRange, hourRange, minPeople, maxPeople }}
            />
          </Container>
        </Box>
      </Box>
    </Box>
  );
}

export default HeatmapAdvancedPage;
