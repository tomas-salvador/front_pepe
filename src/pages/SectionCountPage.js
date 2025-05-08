import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Container, useMediaQuery, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ModernSidebar from '../components/Dashboard/Sidebar';
import ModernHeader from '../components/Dashboard/Header';
import authService from '../services/authService';
import dataService from '../services/dataService';
import { useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip as ChartTooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';

const drawerWidth = 240;

const mockSectionData = [
  { section: 'A', people: 532, avgTime: '4m 22s' },
  { section: 'B', people: 412, avgTime: '3m 58s' },
  { section: 'C', people: 621, avgTime: '5m 15s' },
  { section: 'D', people: 289, avgTime: '2m 49s' },
  { section: 'E', people: 334, avgTime: '3m 37s' }
];

function SectionCountPage() {
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
              Conteo de personas por sección
            </Typography>

            <TableContainer component={Paper} sx={{ mb: 4 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell><b>Sección</b></TableCell>
                    <TableCell><b>Visitantes</b></TableCell>
                    <TableCell><b>Tiempo medio</b></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {mockSectionData.map((row) => (
                    <TableRow key={row.section}>
                      <TableCell>{row.section}</TableCell>
                      <TableCell>{row.people}</TableCell>
                      <TableCell>{row.avgTime}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Typography variant="subtitle1" sx={{ mb: 2 }}>Comparativa visual:</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockSectionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="section" />
                <YAxis />
                <ChartTooltip />
                <Bar dataKey="people" fill="#1976d2" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>

          </Container>
        </Box>
      </Box>
    </Box>
  );
}

export default SectionCountPage;
