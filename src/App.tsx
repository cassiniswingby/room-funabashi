import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ScrollToTop from './components/ScrollToTop';
import HomePage from './pages/HomePage';
import BookingPage from './pages/BookingPage';
import AdminPage from './pages/AdminPage';
import PricingGuidePage from './pages/PricingGuidePage';
import FacilitiesPage from './pages/FacilitiesPage';
import ReservationManagementPage from './pages/ReservationManagementPage';
import FAQPage from './pages/FAQPage';
import TermsPolicyPage from './pages/TermsPolicyPage';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <ScrollToTop />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/booking" element={<BookingPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/pricing" element={<PricingGuidePage />} />
            <Route path="/facilities" element={<FacilitiesPage />} />
            <Route path="/reservation-management" element={<ReservationManagementPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/terms-policy" element={<TermsPolicyPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;