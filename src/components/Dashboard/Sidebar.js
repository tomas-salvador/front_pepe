import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useColorMode } from '../../contexts/ThemeContext';

import {
  Box, Drawer, List, ListItem, ListItemButton, ListItemIcon,
  ListItemText, Divider, Typography, Collapse, Avatar,
  IconButton, Tooltip
} from '@mui/material';

import AnalyticsIcon from '@mui/icons-material/Analytics';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import IsoIcon from '@mui/icons-material/Iso';
import DonutSmallIcon from '@mui/icons-material/DonutSmall';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import LogoutIcon from '@mui/icons-material/Logout';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import HubIcon from '@mui/icons-material/Hub';
import LayersIcon from '@mui/icons-material/Layers';
import TableChartIcon from '@mui/icons-material/TableChart';
import RouteIcon from '@mui/icons-material/Route';
import PeopleIcon from '@mui/icons-material/People';
import LinearScaleIcon from '@mui/icons-material/LinearScale';

const ModernSidebar = ({ drawerWidth, mobileOpen, handleDrawerToggle, isMdUp, user, handleLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { mode, toggleColorMode } = useColorMode();

  const [openSections, setOpenSections] = useState({
    analytics: true,
  });

  const handleSectionClick = (section) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const menuStructure = [
    { text: 'Inicio', icon: <DashboardIcon />, path: '/' },
    {
      text: 'Analítica',
      icon: <AnalyticsIcon />,
      sectionKey: 'analytics',
      children: [
        { text: 'Mapa de Calor Simple', icon: <WhatshotIcon sx={{ fontSize: '1.3rem' }} />, path: '/analytics/heatmap' },
        { text: 'Mapa de Calor Avanzado', icon: <LayersIcon sx={{ fontSize: '1.3rem' }} />, path: '/analytics/heatmap-advanced' },
        { text: 'Estacionaridad', icon: <DonutSmallIcon sx={{ fontSize: '1.3rem' }} />, path: '/analytics/stationarity' },
        { text: 'Transitoriedad', icon: <IsoIcon sx={{ fontSize: '1.3rem' }} />, path: '/analytics/transience' },
        { text: 'Rutas frecuentes', icon: <RouteIcon sx={{ fontSize: '1.3rem' }} />, path: '/analytics/routes' },
        { text: 'Conteo por sección', icon: <TableChartIcon sx={{ fontSize: '1.3rem' }} />, path: '/analytics/section-count' },
        { text: 'Demografía', icon: <PeopleIcon sx={{ fontSize: '1.3rem' }} />, path: '/analytics/demographics' },
		{ text: 'Análisis de Colas', icon: <LinearScaleIcon sx={{ fontSize: '1.3rem' }} />, path: '/analytics/queues' },
      ]
    }
  ];

  const renderListItem = (item, isNested = false) => (
    <ListItem key={item.text} disablePadding sx={{ display: 'block', pl: isNested ? 3.5 : 1.5, pr: 1.5 }}>
      <ListItemButton
        onClick={() => {
          navigate(item.path);
          if (!isMdUp) handleDrawerToggle();
        }}
        selected={location.pathname === item.path}
        sx={{
          minHeight: 48,
          justifyContent: 'initial',
          borderRadius: 1.5,
          mb: 0.5,
          '&.Mui-selected': { backgroundColor: 'action.selected' },
          '&:hover': { backgroundColor: 'action.hover' }
        }}
      >
        <ListItemIcon sx={{ minWidth: 0, mr: isNested ? 1.5 : 2, justifyContent: 'center' }}>
          {item.icon}
        </ListItemIcon>
        <ListItemText primary={item.text} primaryTypographyProps={{ fontSize: isNested ? '0.9rem' : 'inherit' }} />
      </ListItemButton>
    </ListItem>
  );

  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'http://193.70.74.126:8070';
  const avatarSrc = user?.company_logo_url ? `${apiBaseUrl}${user.company_logo_url}` : null;

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', height: 64 }}>
        <HubIcon color="primary" sx={{ mr: 1, fontSize: '2rem' }} />
        <Typography variant="h6" noWrap sx={{ fontWeight: 'bold' }}>
          SMARTVCOM
        </Typography>
      </Box>
      <Divider />
      <List sx={{ flexGrow: 1, pt: 1, overflowY: 'auto' }}>
        {menuStructure.map((item) => (
          <React.Fragment key={item.text}>
            <ListItem disablePadding sx={{ display: 'block', px: 1.5 }}>
              <ListItemButton
                onClick={() => item.children ? handleSectionClick(item.sectionKey) : navigate(item.path)}
                selected={
                  location.pathname === item.path ||
                  (item.children && item.children.some(child => location.pathname === child.path))
                }
                sx={{
                  minHeight: 48,
                  justifyContent: 'initial',
                  borderRadius: 1.5,
                  mb: 0.5,
                  '&.Mui-selected': { backgroundColor: 'action.selected' },
                  '&:hover': { backgroundColor: 'action.hover' }
                }}
              >
                <ListItemIcon sx={{ minWidth: 0, mr: 2, justifyContent: 'center' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
                {item.children && (openSections[item.sectionKey] ? <ExpandLess /> : <ExpandMore />)}
              </ListItemButton>
            </ListItem>
            {item.children && (
              <Collapse in={openSections[item.sectionKey]} timeout="auto" unmountOnExit>
                <List component="div" disablePadding sx={{ pt: 0.5 }}>
                  {item.children.map(child => renderListItem(child, true))}
                </List>
              </Collapse>
            )}
          </React.Fragment>
        ))}
      </List>
      {isMdUp && user && (
        <Box sx={{ p: 1.5, mt: 'auto', flexShrink: 0 }}>
          <Divider sx={{ mb: 1.5 }} />
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', overflow: 'hidden', mr: 1 }}>
              <Avatar
                alt={user.name}
                src={avatarSrc}
                sx={{ width: 32, height: 32, mr: 1.5 }}
              >
                {!avatarSrc && user.name ? user.name.charAt(0).toUpperCase() : null}
              </Avatar>
              <Typography variant="body1" noWrap title={user.name}>
                {user.name}
              </Typography>
            </Box>
            <Box>
              <Tooltip title="Cambiar Tema">
                <IconButton onClick={toggleColorMode} size="small">
                  {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                </IconButton>
              </Tooltip>
              <Tooltip title="Cerrar Sesión">
                <IconButton onClick={handleLogout} size="small">
                  <LogoutIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );

  return (
    <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }} aria-label="main navigation">
      {!isMdUp && (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{ display: { xs: 'block', md: 'none' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth } }}
        >
          {drawerContent}
        </Drawer>
      )}
      <Drawer
        variant="permanent"
        open
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            borderRight: (theme) => `1px solid ${theme.palette.divider}`,
            backgroundColor: 'background.paper'
          }
        }}
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
};

export default ModernSidebar;
