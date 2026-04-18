import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// import App from './App.jsx'

import { CartProvider } from './context/CartContext'


import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from "./pages/Landing.jsx";
import Checkout from "./pages/Checkout.jsx";
import CartPage from './pages/CartPage.jsx';
import PrivacyPolicy from './pages/PrivacyPolicy.jsx';
import TermsConditions from './pages/TermsConditions.jsx';
import SalesPage from './pages/SalesPage.jsx';

// 
// import ReactPixel from 'react-facebook-pixel'
import { useEffect } from 'react';



// 🔹 Initialize Pixel (only once)
// ReactPixel.init('YOUR_META_PIXEL_ID')

// 🔹 Track page views on route change
// function PixelTracker() {
//   // const location = useLocation()

//   useEffect(() => {
//     ReactPixel.pageView()
//   }, [location])

//   return null
// }


createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <App /> */}

      <CartProvider>

        {/* <Checkout /> */}
    

        <BrowserRouter>



        {/* Pixel tracker */}
        {/* <PixelTracker /> */}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-conditions" element={<TermsConditions />} />
        <Route path="/product/:slug" element={<SalesPage />} />
      </Routes>
    </BrowserRouter>
        </CartProvider>

  </StrictMode>,

    // </CartProvider>

)
