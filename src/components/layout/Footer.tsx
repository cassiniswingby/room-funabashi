import React from 'react';
import { Phone, Mail, Instagram, Facebook, MapPin, Clock } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

// Import X logo image
import xLogoImg from '../../assets/X-logo-white.png';

const Footer: React.FC = () => {
  const location = useLocation();

  return (
    <footer className="bg-sky-900 text-white py-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-base md:text-xl font-semibold mb-4">room船橋</h3>
            <p className="mb-4 text-sky-100 text-sm md:text-base leading-relaxed">
              家族や友人と心温まる時間を過ごせる古民家です
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.instagram.com/roomfunabashi/"
                aria-label="Instagram"
                className="text-white hover:text-sky-300 transition duration-200"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram size={20} />
              </a>
            
              <a
                href="https://www.facebook.com/roomFunabashi/"
                aria-label="Facebook"
                className="text-white hover:text-sky-300 transition duration-200"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Facebook size={20} />
              </a>
            
              <a
                href="https://x.com/roomfunabashi"
                aria-label="X"
                className="text-white hover:text-sky-300 transition duration-200"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={xLogoImg}
                  alt="X"
                  className="w-[1.125rem] h-[1.125rem]"
                />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-base md:text-xl font-semibold mb-4">運営情報</h3>
            <div className="space-y-2">
              <p className="flex items-center space-x-2 text-sm md:text-base leading-relaxed">
                <Phone size={16} />
                <span>047-402-2332</span>
              </p>
              <p className="flex items-center space-x-2 text-sm md:text-base leading-relaxed">
                <Mail size={16} />
                <span>info@room-funabashi.jp</span>
              </p>
              <p className="flex items-start space-x-2 text-sm md:text-base leading-relaxed">
                <MapPin size={16} className="mt-1 flex-shrink-0" />
                <span>〒273-0866 千葉県船橋市夏見台6-15−15</span>
              </p>
              <p className="flex items-start space-x-2 text-sm md:text-base leading-relaxed">
                <Clock size={16} className="mt-1 flex-shrink-0" />
                <span>年中無休（時間はプランにより異なります）</span>
              </p>
            </div>
          </div>
        
          <div>
            <h3 className="text-base md:text-xl font-semibold mb-4">サポート</h3>
            <div className="space-y-2 text-sky-100 text-sm md:text-base leading-relaxed">
              <Link 
                to="/reservation-management" 
                className={`block mt-4 hover:text-white transition-colors duration-200 border-l-2 border-transparent hover:border-sky-300 pl-3 py-1 rounded-r ${
                  location.pathname === '/reservation-management' 
                    ? 'text-white border-sky-300 bg-sky-800/30' 
                    : 'hover:bg-sky-800/20'
                }`}
              >
                予約の確認・キャンセル
              </Link>
              <Link 
                to="/terms-policy" 
                className={`block mt-4 hover:text-white transition-colors duration-200 border-l-2 border-transparent hover:border-sky-300 pl-3 py-1 rounded-r ${
                  location.pathname === '/terms-policy' 
                    ? 'text-white border-sky-300 bg-sky-800/30' 
                    : 'hover:bg-sky-800/20'
                }`}
              >
                キャンセルポリシー・利用規約
              </Link>
            </div>
          </div>
        </div>
        
        <div className="border-t border-sky-800 mt-8 pt-8 text-center text-sky-200">
          <p className="text-sm md:text-base">&copy; {new Date().getFullYear()} Room Funabashi. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;