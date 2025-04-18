import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Route, Routes } from "react-router";
import Layout from './components/layout';
import Docker from './app/docker';
import Login from './app/login';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Layout />}>
        <Route path="/docker" element={<Docker />} index />
      </Route>
    </Routes>
    </BrowserRouter>
  </StrictMode>,
)
