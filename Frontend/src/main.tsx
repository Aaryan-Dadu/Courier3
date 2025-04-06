// main.tsx (Vite) or index.tsx (CRA)
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider } from './context/ThemeContext';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter> {/* <== MUST WRAP APP */}
      <ThemeProvider> {/* <== Can be here */}
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
