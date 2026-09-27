import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { TripDataProvider } from './data/TripDataProvider';
import { StaticTripRepository } from './data/tripRepository';
import './index.css';

const tripRepository = new StaticTripRepository();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    void navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`, {
      scope: import.meta.env.BASE_URL,
    });
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TripDataProvider repository={tripRepository}>
      <App />
    </TripDataProvider>
  </StrictMode>,
);
