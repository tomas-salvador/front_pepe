import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import HeatmapPage from './pages/HeatmapPage';
import HeatmapAdvancedPage from './pages/HeatmapAdvancedPage';
import StationarityPage from './pages/StationarityPage';
import TransiencePage from './pages/TransiencePage';
import RoutesPage from './pages/RoutesPage';
import SectionCountPage from './pages/SectionCountPage';
import DemographicsPage from './pages/DemographicsPage';
import QueueAnalysisPage from './pages/QueueAnalysisPage';

import ProtectedRoute from './components/Auth/ProtectedRoute';
import authService from './services/authService';
import { ThemeContextProvider } from './contexts/ThemeContext';

function App() {
  return (
    <ThemeContextProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/analytics/heatmap" element={<HeatmapPage />} />
            <Route path="/analytics/heatmap-advanced" element={<HeatmapAdvancedPage />} />
            <Route path="/analytics/stationarity" element={<StationarityPage />} />
            <Route path="/analytics/transience" element={<TransiencePage />} />
            <Route path="/analytics/routes" element={<RoutesPage />} />
            <Route path="/analytics/section-count" element={<SectionCountPage />} />
			<Route path="/analytics/demographics" element={<DemographicsPage />} />
			<Route path="/analytics/queues" element={<QueueAnalysisPage />} />
          </Route>
          <Route
            path="*"
            element={
              authService.getCurrentToken() ? (
                <Navigate to="/" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Routes>
      </Router>
    </ThemeContextProvider>
  );
}

export default App;
