import React from 'react';
import { createRoot } from 'react-dom/client';
import ROICalculator from './roi_calculator';
import './index.css';

const root = document.getElementById('root');
if (root) {
  createRoot(root).render(
    <React.StrictMode>
      <ROICalculator />
    </React.StrictMode>
  );
}
