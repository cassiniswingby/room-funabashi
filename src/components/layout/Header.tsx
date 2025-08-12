import React, { useState } from 'react';
import { Menu, X, Home, Calendar, MapPin, Info, CreditCard } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Import logo image
import logoImg from '../../assets/logo_upscaled.png';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const menuItems = [
    { name: 'ホーム', path: '/', icon: <Home size={18} /> },
    { name: '施設案内', path: '/facilities', icon: <Info size={18} /> },
    { name: '料金案内', path: '/pricing', icon: <CreditCard size={18} /> },
    { name: 'よくある質問', path: '/faq', icon: <Info size={18} /> },
    { name: 'ご予約', path: '/booking', icon: <Calendar size={18} /> },
  ];

  return (
    <header className="w-full bg-sky-400/95 backdrop-blur-sm shadow-md z-[9999] sticky top-0 transition-all duration-200">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <img
            src={logoImg}
            alt="Room Funabashi"
            className="h-8 scale-150 object-contain"
            style={{ transformOrigin: 'left center' }}
          />
        </Link>

        {/* デスクトップメニュー */}
        <nav className="hidden md:flex space-x-8">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`text-sm font-medium text-white hover:text-white transition duration-200 flex items-center space-x-1 relative pb-1 group ${
                location.pathname === item.path ? 'text-white' : 'text-white'
              }`}
            >
              {item.icon}
              <span>{item.name}</span>
              {/* ホバー時の下線アニメーション */}
              <span className="absolute left-0 bottom-0 w-full h-0.5 bg-sky-200 transform scale-x-0 origin-right transition-transform duration-500 ease-out group-hover:scale-x-100 group-hover:origin-left"></span>
            </Link>
          ))}
        </nav>

        {/* モバイルメニューボタン */}
        <button
          className="md:hidden text-white hover:text-white transition duration-200"
          onClick={toggleMenu}
          aria-label={isMenuOpen ? 'メニューを閉じる' : 'メニューを開く'}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* モバイルメニュー */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-sky-300/95 backdrop-blur-sm"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-base font-medium text-white hover:text-white transition duration-200 flex items-center space-x-2 ${
                    location.pathname === item.path ? 'text-white' : 'text-white'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;