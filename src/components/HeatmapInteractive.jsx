// src/components/HeatmapInteractive.jsx
import React, { useEffect, useRef, useState } from 'react';
import heatmap from 'heatmap.js';
import {
  Box,
  Typography,
  CircularProgress
} from '@mui/material';

const imageWidth = 2252;
const imageHeight = 1233;
const HIGHLIGHT_THRESHOLD = 20; // personas

function HeatmapInteractive({ filters }) {
  const heatmapContainerRef = useRef(null);
  const [heatmapInstance, setHeatmapInstance] = useState(null);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [gridWidth, setGridWidth] = useState(0);
  const [gridHeight, setGridHeight] = useState(0);
  const [inspectData, setInspectData] = useState([]);
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, content: '' });

  useEffect(() => {
    setIsLoading(true);
    fetch('/salida_normalizada_mapas_calor.json')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(json => {
        const sublotes = json.sublotes_normalizados;
        setData(sublotes);
        if (sublotes && sublotes.length > 0 && Array.isArray(sublotes[0]) && Array.isArray(sublotes[0][0])) {
          setGridHeight(sublotes[0].length);
          setGridWidth(sublotes[0][0].length);
        }
      })
      .catch(err => {
        console.error("Error cargando JSON:", err);
        setData([]);
        setGridWidth(0);
        setGridHeight(0);
      })
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (!heatmapContainerRef.current || !imageLoaded || gridWidth === 0 || gridHeight === 0) return;

    if (!heatmapInstance) {
      const scaleX = imageWidth / gridWidth;
      const scaleY = imageHeight / gridHeight;
      const radius = Math.max(20, Math.min(60, Math.min(scaleX, scaleY) * 0.7));

      const instance = heatmap.create({
        container: heatmapContainerRef.current,
        radius,
        maxOpacity: 0.65,
        minOpacity: 0.1,
        blur: 0.85,
        gradient: { '0.1': 'blue', '0.3': 'cyan', '0.5': 'lime', '0.7': 'yellow', '0.95': 'red' }
      });
      setHeatmapInstance(instance);
    }
  }, [imageLoaded, gridWidth, gridHeight, heatmapInstance]);

  useEffect(() => {
    if (!heatmapInstance || isLoading || data.length === 0 || gridWidth === 0 || gridHeight === 0) return;

    const selectedGrid = data[data.length - 1];
    const heatmapData = [];
    const visualPoints = [];
    const scaleX = imageWidth / gridWidth;
    const scaleY = imageHeight / gridHeight;

    for (let y = 0; y < gridHeight; y++) {
      for (let x = 0; x < gridWidth; x++) {
        const value = selectedGrid[y]?.[x] ?? 0;
        if (value > 0) {
          const realPeople = Math.round(value * 100);
          if (realPeople >= filters.minPeople && realPeople <= filters.maxPeople) {
            const point = {
              x: Math.round((x + 0.5) * scaleX),
              y: Math.round((y + 0.5) * scaleY),
              value,
              realPeople
            };
            heatmapData.push(point);
            visualPoints.push(point);
          }
        }
      }
    }

    setInspectData(visualPoints);
    heatmapInstance.setData({ max: 1, data: heatmapData });
  }, [heatmapInstance, data, filters, gridWidth, gridHeight, isLoading]);

  const handleMouseMove = (e) => {
    const rect = heatmapContainerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const threshold = 10;
    const hovered = inspectData.find(
      p => Math.abs(p.x - mouseX) < threshold && Math.abs(p.y - mouseY) < threshold
    );

    if (hovered) {
      setTooltip({ visible: true, x: hovered.x, y: hovered.y, content: `Personas: ${hovered.realPeople}` });
    } else {
      setTooltip(prev => ({ ...prev, visible: false }));
    }
  };

  return (
    <Box sx={{ position: 'relative', width: `${imageWidth}px`, height: `${imageHeight}px`, border: '1px solid #ccc', mx: 'auto' }}>
      <Box
        ref={heatmapContainerRef}
        onMouseMove={handleMouseMove}
        sx={{
          width: `${imageWidth}px`,
          height: `${imageHeight}px`,
          position: 'relative',
          backgroundImage: 'url(/plano_nuevo.png)',
          backgroundSize: '100% 100%',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
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

        {inspectData.map((point, i) => (
          point.realPeople >= HIGHLIGHT_THRESHOLD && (
            <Box
              key={i}
              sx={{
                position: 'absolute',
                top: point.y - 14,
                left: point.x - 14,
                width: 28,
                height: 28,
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 0, 0, 0.7)',
                border: '2px solid white',
                boxShadow: '0 0 10px 4px rgba(255, 0, 0, 0.5)',
                animation: 'pulse 1.5s infinite',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '0.75rem',
                fontWeight: 'bold'
              }}
            >
              {point.realPeople}
            </Box>
          )
        ))}

        {tooltip.visible && (
          <Box
            sx={{
              position: 'absolute',
              top: tooltip.y - 30,
              left: tooltip.x + 10,
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              color: 'white',
              px: 1,
              py: 0.5,
              borderRadius: 1,
              pointerEvents: 'none',
              fontSize: '0.75rem'
            }}
          >
            {tooltip.content}
          </Box>
        )}

        <img
          src="/plano_nuevo.png"
          alt="Plano base"
          style={{ display: 'none' }}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageLoaded(true)}
        />
      </Box>

      <Box sx={{ position: 'absolute', bottom: 10, right: 10, backgroundColor: 'rgba(0,0,0,0.5)', color: 'white', px: 2, py: 0.5, borderRadius: 1 }}>
        <Typography variant="caption">
          Filtros: {filters?.minPeople}–{filters?.maxPeople} personas, {filters?.hourRange?.[0]}–{filters?.hourRange?.[1]}h
        </Typography>
      </Box>

      {/* Leyenda de colores */}
      <Box sx={{
        position: 'absolute', bottom: 10, left: 10,
        background: 'linear-gradient(to right, blue, cyan, lime, yellow, red)',
        height: 12, width: 200, borderRadius: 2, border: '1px solid #ccc',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 1
      }}>
        <Typography variant="caption" color="white">0</Typography>
        <Typography variant="caption" color="white">50</Typography>
        <Typography variant="caption" color="white">100</Typography>
      </Box>

      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.8; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </Box>
  );
}

export default HeatmapInteractive;
