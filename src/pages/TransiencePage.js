import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import dataService from '../services/dataService';

// MUI Imports
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography'; 
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';

// Dashboard Components
import ModernSidebar from '../components/Dashboard/Sidebar';
import ModernHeader from '../components/Dashboard/Header';
import SummaryStatCard from '../components/Dashboard/SummaryStatCard';
import ChartDisplayCard from '../components/Dashboard/ChartDisplayCard';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import TransienceOverlay from '../components/Dashboard/TransienceOverlay'; 

// Íconos
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import InventoryIcon from '@mui/icons-material/Inventory';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';

// Datos simulados
const mockSummaryData = [
    { title: 'Total Sales', value: '$1k', change: '+8', icon: <PointOfSaleIcon />, color: 'error' },
    { title: 'Total Order', value: '300', change: '+5', icon: <ReceiptLongIcon />, color: 'warning' },
    { title: 'Product Sold', value: '5', change: '+1.2', icon: <InventoryIcon />, color: 'success' },
    { title: 'New Customers', value: '8', change: '+0.5', icon: <PeopleAltIcon />, color: 'info' },
];

// Mock Charts
const MockVisitorChart = () => <Box sx={{height: 250, bgcolor: 'grey.200', display: 'flex', alignItems:'center', justifyContent:'center', borderRadius: 1}}>Visitor Insights Chart</Box>;
const MockRevenueChart = () => <Box sx={{height: 250, bgcolor: 'grey.200', display: 'flex', alignItems:'center', justifyContent:'center', borderRadius: 1}}>Total Revenue Chart</Box>;
const MockSatisfactionChart = () => <Box sx={{height: 250, bgcolor: 'grey.200', display: 'flex', alignItems:'center', justifyContent:'center', borderRadius: 1}}>Customer Satisfaction Chart</Box>;
const MockTargetChart = () => <Box sx={{height: 250, bgcolor: 'grey.200', display: 'flex', alignItems:'center', justifyContent:'center', borderRadius: 1}}>Target vs. Reality Chart</Box>;

const drawerWidth = 240;

function DashboardPage() {
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
  }, [navigate]);

  const handleFetchError = (err) => {
    const status = err.response?.status;
    if (status === 401 || status === 422) {
      setError('Session expired. Please login again.');
      authService.logout();
      navigate('/login');
    } else {
      setError(err.message || 'Failed to load dashboard data.');
    }
  };

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
          <Container maxWidth={false} sx={{ mt: 0, mb: 4 }}>
            

            {/* 🔥 Mapa de Calor sobre plano */}
            <Box sx={{ mt: 5 }}>
              <Typography variant="h5" fontWeight="medium" sx={{ mb: 2 }}>
                Mapa de Transitoriedad
              </Typography>
              <TransienceOverlay />
            </Box>

          </Container>
        </Box>
      </Box>
    </Box>
  );
}

export default DashboardPage;
