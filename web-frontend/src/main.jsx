
import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Home from './pages/Home'
import AddCoupon from './pages/AddCoupon'
import CouponDetail from './pages/CouponDetail'

import './styles.css'

function App(){
  const token = localStorage.getItem('token')
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login/>} />
        <Route path="/" element={ token ? <Home/> : <Navigate to="/login" />} />
        <Route path="/add" element={ token ? <AddCoupon/> : <Navigate to="/login" />} />
        <Route path="/coupon/:id" element={ token ? <CouponDetail/> : <Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  )
}

createRoot(document.getElementById('root')).render(<App />)
