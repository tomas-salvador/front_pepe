// src/pages/RoutesPage.jsx
import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Container, useMediaQuery, Slider, FormControlLabel, Checkbox, Tooltip
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ModernSidebar from '../components/Dashboard/Sidebar';
import ModernHeader from '../components/Dashboard/Header';
import authService from '../services/authService';
import dataService from '../services/dataService';
import { useNavigate } from 'react-router-dom';

const drawerWidth = 240;
const imageWidth = 2252;
const imageHeight = 1233;

const mockRoutes = [
  { path: [{x:200,y:300},{x:600,y:700}], people: 85 },
  { path: [{x:150,y:100},{x:600,y:400}], people: 43 },
  { path: [{x:1000,y:200},{x:1200,y:600}], people: 65 },
  { path: [{x:800,y:1000},{x:1200,y:850}], people: 28 },
];

function RoutesPage() {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [minSteps, setMinSteps] = useState(2);
  const [showPoints, setShowPoints] = useState(true);
  const [user, setUser] = useState(() => dataService.getCachedUserProfile());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
            <Typography variant="h5" fontWeight="medium" sx={{ mb: 2 }}>
              Rutas frecuentes de los visitantes
            </Typography>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2">Número mínimo de pasos por ruta: {minSteps}</Typography>
              <Slider
                min={2}
                max={10}
                value={minSteps}
                onChange={(e, val) => setMinSteps(val)}
                sx={{ width: 200 }}
              />
              <FormControlLabel
                control={<Checkbox checked={showPoints} onChange={() => setShowPoints(!showPoints)} />}
                label="Mostrar puntos de paso"
              />
            </Box>

            <Box
              sx={{
                position: 'relative',
                width: `${imageWidth}px`,
                height: `${imageHeight}px`,
                border: '1px solid #ccc',
                backgroundImage: 'url(/plano_nuevo.png)',
                backgroundSize: '100% 100%',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                mx: 'auto'
              }}
            >
              <svg
                width={imageWidth}
                height={imageHeight}
                style={{ position: 'absolute', top: 0, left: 0 }}
              >
                {mockRoutes
                  .filter(r => r.path.length >= minSteps)
                  .map((route, idx) => (
                    <g key={idx}>
                      <defs>
                        <marker id={`arrow-${idx}`} markerWidth="10" markerHeight="10" refX="6" refY="3" orient="auto" markerUnits="strokeWidth">
                          <path d="M0,0 L0,6 L9,3 z" fill="#1976d2" />
                        </marker>
                      </defs>
                      <Tooltip title={`Personas: ${route.people}`} arrow>
                        <line
                          x1={route.path[0].x}
                          y1={route.path[0].y}
                          x2={route.path[1].x}
                          y2={route.path[1].y}
                          stroke="#1976d2"
                          strokeWidth={4}
                          markerEnd={`url(#arrow-${idx})`}
                          opacity={0.8}
                        />
                      </Tooltip>
                      {showPoints && route.path.map((p, i) => (
                        <circle key={i} cx={p.x} cy={p.y} r={6} fill="white" stroke="black" strokeWidth={1} />
                      ))}
                    </g>
                ))}
              </svg>
            </Box>
          </Container>
        </Box>
      </Box>
    </Box>
  );
}

export default RoutesPage;
