import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import { useColorMode } from '../contexts/ThemeContext'; // Importamos el hook para usar el contexto

// Importaciones de Material UI
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Brightness4Icon from '@mui/icons-material/Brightness4'; // Icono luna (oscuro)
import Brightness7Icon from '@mui/icons-material/Brightness7'; // Icono sol (claro)
import Fade from '@mui/material/Fade';
import { useTheme } from '@mui/material/styles'; // Hook para acceder al tema completo si es necesario

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // --- Consumir el contexto del tema ---
  const theme = useTheme(); // Obtiene el objeto theme actual (útil para estilos específicos)
  const { mode, toggleColorMode } = useColorMode(); // Obtiene el modo ('light'/'dark') y la función para cambiarlo

  // --- Lógica del Submit ---
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      await authService.login(username, password);
      navigate('/'); // Redirige al dashboard si el login es exitoso
    } catch (err) {
      const errorMessage = err?.error || err?.message || 'Error al iniciar sesión. Verifica tu usuario y contraseña.';
      setError(errorMessage);
      console.error("Login failed:", err);
    } finally {
      setLoading(false);
    }
  };

  // --- Renderizado del Componente ---
  return (
  
    <Box
      sx={{
        position: 'relative', // Para posicionar el botón de modo
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        // El color de fondo lo gestiona CssBaseline del tema
      }}
    >
      {/* --- Botón para Cambiar Modo --- */}
      <Box
        sx={{
          position: 'absolute',
          top: { xs: 8, sm: 16 }, // Menos espacio en pantallas pequeñas
          right: { xs: 8, sm: 16 },
        }}
      >
        {/* Llama a toggleColorMode del contexto al hacer click */}
        <IconButton onClick={toggleColorMode} color="inherit" aria-label="toggle light/dark mode">
          {/* Muestra el icono correspondiente al modo actual */}
          {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
      </Box>

      {/* --- Contenedor Principal del Formulario --- */}
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            padding: { xs: 2, sm: 4 }, 
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: 'background.paper', 
            borderRadius: 2, 
            boxShadow: theme.shadows[5], 
            mt: 8, 
          }}
        >
          {/* --- Icono y Título --- */}
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Iniciar Sesión
          </Typography>

          {/* --- Formulario --- */}
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Usuario"
              name="username"
              autoComplete="username"
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              error={!!error} // Resalta si hay error
              helperText={error ? ' ' : null} // Ocupa espacio para evitar salto si aparece error 
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Contraseña"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              error={!!error} // Resalta si hay error
              helperText={error ? ' ' : null} // Ocupa espacio para evitar salto si aparece error (opcional)
            />

            {/* --- Alerta de Error Animada --- */}
            {error && (
				<Fade in={true} timeout={300}>
					<Alert severity="error" sx={{ width: '100%', mb: 2}}>
					  {error}
					</Alert>
				</Fade>
			)}

            {/* --- Botón de Envío con Indicador de Carga --- */}
            <Box sx={{ position: 'relative', mt: 3, mb: 2 }}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{ py: 1.5, fontSize: '1rem' }}
              >
                {/* Texto condicional */}
                {loading ? 'Ingresando...' : 'Ingresar'}
              </Button>
              {/* Indicador de carga (spinner) */}
              {loading && (
                <CircularProgress
                  size={24}
                  sx={{
                    color: theme.palette.mode === 'light' ? theme.palette.primary.contrastText : theme.palette.grey[500], // Color adaptable
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    marginTop: '-12px', // Centrado vertical
                    marginLeft: '-12px', // Centrado horizontal
                  }}
                />
              )}
            </Box>
			
          </Box> {/* Fin del Box del Formulario */}
        </Box> {/* Fin del Box contenedor del formulario */}

        {/* --- Copyright Footer --- */}
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 5, mb: 4 }}>
          {'Copyright © '}
          <Link color="inherit" href="https://smartvcom.ai/"> {/* Cambia esto */}
          SmartVCom{/* Cambia esto */}
          </Link>{' '}
          {new Date().getFullYear()}
          {'.'}
        </Typography>
      </Container> {/* Fin del Container principal */}
    </Box> // Fin del Box raíz
  );
}

export default LoginPage;