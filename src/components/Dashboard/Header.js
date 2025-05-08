import React from 'react';
import { useColorMode } from '../../contexts/ThemeContext'; 

// MUI Imports
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon'; 
import Divider from '@mui/material/Divider'; // Para el separador de menús
import ButtonBase from '@mui/material/ButtonBase';

// Icons
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import MenuIcon from '@mui/icons-material/Menu'; // Hamburger icon
import LogoutIcon from '@mui/icons-material/Logout'; // Icono para cerrar sesión



const ModernHeader = ({ user, drawerWidth, handleDrawerToggle, isMdUp, handleLogout }) => {
  const { mode, toggleColorMode } = useColorMode(); 
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const onLogoutClick = () => {
      handleCloseUserMenu(); // Cierra el menú primero
      handleLogout(); // Luego llama al manejador de cierre de sesión
  }

  // Define los elementos del menú excluyendo el cierre de sesión
  const menuItems = ['Profile', 'Account', 'Dashboard'];
  
  // --- Construir URL completa para el icono de usuario ---
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'http://193.70.74.126:8070';
  // Construye la URL completa solo si tenemos una URL relativa en user.company_logo_url
  const avatarSrc = user?.company_logo_url ? `${apiBaseUrl}${user.company_logo_url}` : null;
  console.log("Constructed Avatar URL:", avatarSrc);
  // Si no hay URL, Avatar mostrará las iniciales o un icono por defecto si se configura


  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        width: { md: `calc(100% - ${drawerWidth}px)` }, // Full width en pantallas pequeñas
        ml: { md: `${drawerWidth}px` }, // Solo margen en pantallas grandes
        backgroundColor: 'background.paper',
        color: 'text.primary',
        borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
      }}
    >
      <Toolbar>
        {/* Hamburger Icon (visible solo en pantallas pequeñas) */}
        {!isMdUp && (
            <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2 }} 
            >
                <MenuIcon />
            </IconButton>
        )}

        {/* Título */}
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Dashboard
        </Typography>

        {/* Botón de alternancia de modo oscuro/claro */}
        <Tooltip title={`Toggle ${mode === 'dark' ? 'light' : 'dark'} mode`}>
            <IconButton sx={{ mr: 1.5 }} onClick={toggleColorMode} color="inherit">
            {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
        </Tooltip>

        {/* --- Sección del Nombre e Icono del Usuario --- */}
        {/* Muestra algo incluso si el usuario aún no se ha cargado */}
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 0 }}>
            <Tooltip title={user ? "Open settings" : "Loading user..."}>
                {/* --- Envolver Avatar y Nombre en ButtonBase --- */}
                <ButtonBase
                     onClick={user ? handleOpenUserMenu : undefined} // Abrir menú al hacer clic
                     disabled={!user} // Deshabilitar si no hay usuario
                     aria-label="account of current user"
                     aria-controls={Boolean(anchorElUser) ? 'menu-appbar' : undefined}
                     aria-haspopup="true"
                     sx={{
                         p: 0.5, 
                         borderRadius: 25, 
                         '&:hover': {
                            backgroundColor: 'action.hover'
                         }
                     }}
                >
                    {/* icono del usuario */}
                    <Avatar
                        alt={user?.name || ''}
                        src={avatarSrc}
                        sx={{ width: 36, height: 36 }}
                    >
                       {!avatarSrc && user?.name ? user.name.charAt(0).toUpperCase() : null}
                    </Avatar>
                    {/* Nombre (a la derecha) del icono */}
                    {user && (
                        <Typography variant="subtitle1" sx={{ ml: 1, mr: 1, display: { xs: 'none', sm: 'block' } }} noWrap>
                           {user.name}
                        </Typography>
                    )}
                </ButtonBase>
                {/* --- Fin del ButtonBase --- */}
            </Tooltip>

            {/* Menú del Usuario (solo se abre si user existe y se hizo click) */}
            {user && (
                 <Menu
                    sx={{ mt: '45px' }}
                    id="menu-appbar"
                    anchorEl={anchorElUser}
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                    keepMounted
                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                    PaperProps={{ /* ... estilos del Paper del Menu ... */ elevation: 0, sx: { overflow: 'visible', filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))', mt: 1.5, '& .MuiAvatar-root': { width: 32, height: 32, ml: -0.5, mr: 1, }, '&:before': { content: '""', display: 'block', position: 'absolute', top: 0, right: 14, width: 10, height: 10, bgcolor: 'background.paper', transform: 'translateY(-50%) rotate(45deg)', zIndex: 0, }, }, }}
                 >
					{/*
                    <Box sx={{px: 2, py: 1, borderBottom: 1, borderColor: 'divider', mb: 1}}>
                        <Typography variant="subtitle1" fontWeight="bold">{user.name}</Typography>
                        
                        {user.role && <Typography variant="body2" color="text.secondary">{user.role}</Typography>}
                    </Box>
					
                    {menuItems.map((item) => (
                        <MenuItem key={item} onClick={handleCloseUserMenu}><Typography textAlign="left">{item}</Typography></MenuItem>
                    ))}
                    <Divider sx={{ my: 0.5 }}/>*/}
                    <MenuItem onClick={onLogoutClick}>
                        <ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>
                        Cerrar Sesión
                    </MenuItem>
                 </Menu>
            )}
        </Box> {/* Fin de la Sección del Nombre e Icono del Usuario */}

      </Toolbar>
    </AppBar>
  );
};

export default ModernHeader;