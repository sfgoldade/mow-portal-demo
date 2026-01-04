import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Overview from './pages/Overview';
import FleetAssets from './pages/FleetAssets';
import AssetDetail from './pages/AssetDetail';
import Analytics from './pages/Analytics';
import EventReview from './pages/EventReview';
import ServiceSafety from './pages/ServiceSafety';
import OrdersShipments from './pages/OrdersShipments';
import Documents from './pages/Documents';
import Login from './pages/Login';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Overview />} />
      <Route path="/fleet" element={<FleetAssets />} />
      <Route path="/asset/:assetId" element={<AssetDetail />} />
      <Route path="/analytics" element={<Analytics />} />
      <Route path="/safety" element={<ServiceSafety />} />
      <Route path="/event/:eventId" element={<EventReview />} />
      <Route path="/service" element={<ServiceSafety />} />
      <Route path="/orders" element={<OrdersShipments />} />
      <Route path="/documents" element={<Documents />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
