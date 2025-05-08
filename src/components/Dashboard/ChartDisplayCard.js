import React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton'; 

const ChartDisplayCard = ({ title, children, loading }) => {
  return (
    <Card elevation={0} sx={{ borderRadius: 2, border: 1, borderColor: 'divider', height: '100%' }}>
       <CardHeader title={title} sx={{ pb: 0 }} titleTypographyProps={{variant: 'h6', fontWeight: 'medium'}}/>
      <CardContent>
        {loading ? (
            // Si se está cargando, muestra un esqueleto de carga en forma de un rectángulo
             <Skeleton variant="rectangular" width="100%" height={250} />
        ) : children ? (
            // Si no se está cargando y hay contenido (children), renderiza ese contenido
            children
        ) : (
             // Si no hay contenido y no se está cargando, muestra un mensaje de marcador de posición
             <Box sx={{ height: 250, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'text.disabled'}}>
                 <Typography>Chart Area</Typography>
             </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default ChartDisplayCard;