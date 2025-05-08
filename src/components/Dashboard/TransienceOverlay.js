import React, { useEffect, useRef, useState, useCallback } from 'react';
import heatmap from 'heatmap.js';
import {
  Box,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress
} from '@mui/material';

function TransienceOverlay() {
  const heatmapContainerRef = useRef(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [heatmapInstance, setHeatmapInstance] = useState(null);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [gridWidth, setGridWidth] = useState(0);
  const [gridHeight, setGridHeight] = useState(0);

  // Asegúrate que estas dimensiones coinciden EXACTAMENTE con con la imagen de fondo
  const imageWidth = 2252;
  const imageHeight = 1233;

  useEffect(() => {
    setIsLoading(true);
    fetch('/transitoriedad.json')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(json => {
        const sublotes = json.sublotes_normalizados;
        setData(sublotes);
        if (sublotes && sublotes.length > 0 && Array.isArray(sublotes[0]) && sublotes[0].length > 0 && Array.isArray(sublotes[0][0])) {
          setGridHeight(sublotes[0].length);
          setGridWidth(sublotes[0][0].length);
        } else {
          console.warn("Estructura de datos 'sublotes_normalizados' no esperada o vacía.");
          setGridHeight(0); setGridWidth(0);
        }
      })
      .catch(err => {
        console.error("Error cargando JSON:", err);
        setData([]); setGridWidth(0); setGridHeight(0);
      })
      .finally(() => setIsLoading(false));
  }, []);


   useEffect(() => {
    if (!heatmapContainerRef.current || !imageLoaded || gridWidth === 0 || gridHeight === 0) {
        if (heatmapInstance) {
            try { heatmapInstance.setData({ max: 1, data: [] }); }
            catch (e) {
                console.warn("No se pudo limpiar instancia heatmap:", e);
                const canvas = heatmapContainerRef.current?.querySelector('canvas');
                if(canvas) canvas.remove();
                setHeatmapInstance(null);
            }
        }
       return;
    }

    if (!heatmapInstance) {
        const scaleX = imageWidth / gridWidth;
        const scaleY = imageHeight / gridHeight;
        const baseRadius = Math.min(scaleX, scaleY) * 0.7;
        const dynamicRadius = Math.max(20, Math.min(60, baseRadius)); // Ajusta el 60 si es necesario

        console.log(`Heatmap - Grid: ${gridWidth}x${gridHeight}, Scale: (${scaleX.toFixed(2)}, ${scaleY.toFixed(2)}), Calculated Radius: ${dynamicRadius}`);

        const instance = heatmap.create({
          container: heatmapContainerRef.current,
          radius: dynamicRadius,
          maxOpacity: 0.65, minOpacity: 0.1, blur: 0.85,
          gradient: { '0.1': 'blue', '0.3': 'cyan', '0.5': 'lime', '0.7': 'yellow', '0.95': 'red' }
        });
        setHeatmapInstance(instance);
    }
  }, [imageLoaded, gridWidth, gridHeight, heatmapInstance, imageWidth, imageHeight]);

  const updateHeatmapData = useCallback(() => {
    if (!heatmapInstance || isLoading || data.length === 0 || !data[selectedIndex] || gridWidth === 0 || gridHeight === 0) {
        if (heatmapInstance) { heatmapInstance.setData({ max: 1, data: [] }); }
        return;
    }

    const selectedGrid = data[selectedIndex];
    const heatmapData = [];
    const scaleX = imageWidth / gridWidth;
    const scaleY = imageHeight / gridHeight;

    for (let y = 0; y < gridHeight; y++) {
      for (let x = 0; x < gridWidth; x++) {
        const value = selectedGrid[y]?.[x] ?? 0;
        if (value > 0) {
          heatmapData.push({
            x: Math.round((x + 0.5) * scaleX), y: Math.round((y + 0.5) * scaleY),
            value: value
          });
        }
      }
    }
    heatmapInstance.setData({ max: 1, data: heatmapData });
  }, [selectedIndex, heatmapInstance, data, gridWidth, gridHeight, isLoading, imageWidth, imageHeight]);

  useEffect(() => { updateHeatmapData(); }, [updateHeatmapData]);


  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom> Mapa de calor por sublote </Typography>

      <FormControl sx={{ mb: 3, minWidth: 200 }} disabled={isLoading || data.length === 0}>
        <InputLabel>Periodo</InputLabel>
        <Select value={selectedIndex} label="Periodo" onChange={(e) => setSelectedIndex(Number(e.target.value))} >
          {data.map((_, idx) => ( <MenuItem value={idx} key={idx}> Periodo #{idx + 1} </MenuItem> ))}
        </Select>
      </FormControl>

      <Box sx={{ width: '100%', overflowX: 'auto', display: 'flex', justifyContent: 'center', }}>
        <Box
          ref={heatmapContainerRef}
          sx={{
            width: `${imageWidth}px`,
            height: `${imageHeight}px`,
            position: 'relative',
            border: '1px solid #ccc',
            backgroundImage: `url(/plano_nuevo.png)`,
            // --- CAMBIO PRINCIPAL AQUÍ ---
            backgroundSize: '100% 100%', // Fuerza a llenar el contenedor exacto
            // backgroundSize: 'cover',    // Alternativa: Llena pero puede recortar
            // backgroundSize: 'contain', // Causa bordes si el ratio no coincide EXACTO
            // ---------------------------
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            marginBottom: 2,
          }}
        >
		
          {(isLoading || !imageLoaded) && (
            <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'primary.main', textAlign: 'center' }}>
              <CircularProgress color="inherit" />
              <Typography sx={{ color: 'text.secondary', mt: 1 }}>
                {isLoading ? 'Cargando datos...' : 'Cargando imagen...'}
              </Typography>
            </Box>
          )}
          <img src="/plano.png" alt="Plano de fondo - Carga" style={{ display: 'none' }}
            onLoad={() => setImageLoaded(true)}
            onError={() => { console.error("Error al cargar la imagen de fondo /plano.png"); setImageLoaded(true); }}
          />
        </Box>
      </Box>
    </Box>
  );
}

export default TransienceOverlay;