import React, { createContext, useState, useMemo, useEffect, useContext } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// 1. Crear el Context
const ColorModeContext = createContext({
  toggleColorMode: () => {}, // Función dummy inicial
  mode: 'light', // Valor inicial
});

// 2. Crear el Proveedor del Contexto
export const ThemeContextProvider = ({ children }) => {
  // Estado para el modo
  const [mode, setMode] = useState(() => {
    try { 
      const savedMode = localStorage.getItem('themeMode');
      return savedMode === 'dark' ? 'dark' : 'light';
    } catch (error) {
      console.error("Error reading localStorage:", error);
      return 'light';
    }
  });

  // Guardar preferencia
  useEffect(() => {
     try {
        localStorage.setItem('themeMode', mode);
     } catch (error) {
        console.error("Error writing to localStorage:", error);
     }
  }, [mode]);

  // Función para cambiar el modo (ahora parte del contexto)
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
      mode, // Exporta el modo actual
    }),
    [mode], // Recalcula solo si mode cambia
  );

  // Crear el tema dinámicamente
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          // ...otras personalizaciones de tema...
        },
      }),
    [mode],
  );

  return (
    // 3. Proveer el valor del modo y la función para cambiarlo
    <ColorModeContext.Provider value={colorMode}>
      {/* 4. Aplicar el tema MUI y CssBaseline */}
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children} {/* Renderiza los componentes hijos envueltos */}
      </MuiThemeProvider>
    </ColorModeContext.Provider>
  );
};

// 5. Hook personalizado para usar el contexto fácilmente
export const useColorMode = () => useContext(ColorModeContext);