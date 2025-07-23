import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Layout from "./routes/Layout"
import DetailView from "./routes/DetailView"
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<App />} />
          <Route path="/fishDetails/:name" element={<DetailView />} />
        </Route>
    </Routes>
  </BrowserRouter>
)
