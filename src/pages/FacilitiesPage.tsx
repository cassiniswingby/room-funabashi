import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Home, 
  Sofa, 
  Users, 
  ToyBrick, 
  Beef, 
  Beer,
  TentTree, 
  Waves, 
  Mountain, 
  CookingPot, 
  MonitorPlay, 
  TreePine, 
  Gamepad2, 
  UmbrellaOff, 
  Wifi, 
  Heater, 
  Dog, 
  Gift, 
  GlassWater,
  DollarSign, 
  Package,
  AlertCircle,
  ArrowLeft,
  Camera,
  Utensils,
  Trash2, 
  Blocks, 
  Dribbble, 
  Coffee
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';

// Import all images
import bgImg1 from '../assets/bg-image1.png';
import mainRoomImg from '../assets/main-room.png';
import kotatsuroomImg from '../assets/kotatsu-room.png';
import kidsRoomImg from '../assets/kids-room.png';
import terraceImg from '../assets/terrace.png';
import bbqImg from '../assets/bbq.png';
import gardenImg from '../assets/garden.png';
import tentImg from '../assets/tent.png';

const FacilitiesPage: React.FC = () => {
  useEffect(() => {
    document.title = 'room船橋｜施設案内';
  }, []);

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <div className="min-h-screen bg-sky-50">
      {/* ヘッダーセクション */}
      <section className="relative h-[50vh] flex items-center">
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ 
            backgroundImage: `url(${bgImg1})`,
            filter: "brightness(0.6)"
          }} 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-sky-950/50 to-sky-950/70" />
        <div className="container mx-auto px-6 md:px-4 relative z-10">
          <motion.div 
            className="text-center text-white"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-2xl md:text-3xl font-bold mb-6">施設案内</h1>
            <p className="text-base md:text-xl text-sky-100 max-w-lg md:max-w-3xl mx-auto leading-relaxed px-4">
              充実した設備とこだわりの空間で、<br className="sm:hidden" />特別なひとときを
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-6 md:px-4 py-12 md:py-16">
        {/* 室内空間セクション */}
        <motion.section className="mb-16 md:mb-20" {...fadeInUp}>
          <div className="text-center mb-12">
            <h2 className="text-xl md:text-2xl font-bold text-sky-900 mb-4 flex items-center justify-center">
              <Home className="mr-3" size={32} />
              室内空間
            </h2>
            <p className="text-gray-600 max-w-lg md:max-w-2xl mx-auto text-sm md:text-base leading-relaxed px-4">
              くつろぎと楽しさを両立した、<br className="sm:hidden" />こだわりの室内空間をご紹介します
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            {/* 一番広いお部屋 */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="relative">
                <img 
                  src={mainRoomImg} 
                  alt="一番広いお部屋" 
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 left-4 bg-sky-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  最大6名
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center mb-3">
                  <Sofa className="text-sky-600 mr-2" size={24} />
                  <h3 className="text-base md:text-xl font-semibold text-sky-800">一番広いお部屋</h3>
                </div>
                <p className="text-gray-600 mb-4 text-sm md:text-base leading-relaxed">
                  一番広いお部屋で、大型ソファーで最大6名が着席可能。<br className="sm:hidden" />キッズルームと併設されており、家族みんなでくつろげる空間です。
                </p>
                <div className="space-y-2 text-sm text-gray-500">
                  <div className="flex items-center">
                    <ToyBrick size={16} className="mr-2" />
                    <span>キッズルーム併設</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 掘りごたつのお部屋 */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="relative">
                <img 
                  src={kotatsuroomImg} 
                  alt="掘りごたつのお部屋" 
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 left-4 bg-sky-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  最大8名
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center mb-3">
                  <Users className="text-sky-600 mr-2" size={24} />
                  <h3 className="text-base md:text-xl font-semibold text-sky-800">掘りごたつのお部屋</h3>
                </div>
                <p className="text-gray-600 mb-4 text-sm md:text-base leading-relaxed">
                  最大8名着席可能（推奨6名）の掘りごたつ式のお部屋。<br className="sm:hidden" />足元ヒーター完備で、ガーデンテラスを望む窓からの美しい景色も楽しめます。
                </p>
                <div className="space-y-2 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Heater size={16} className="mr-2" />
                    <span>足元ヒーター完備</span>
                  </div>
                  <div className="flex items-center">
                    <TentTree size={16} className="mr-2" />
                    <span>ガーデンビュー</span>
                  </div>
                </div>
              </div>
            </div>

            {/* キッズスペース */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="relative">
                <img 
                  src={kidsRoomImg} 
                  alt="キッズスルーム" 
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 left-4 bg-sky-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  お子様用
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center mb-3">
                  <ToyBrick className="text-sky-600 mr-2" size={24} />
                  <h3 className="text-base md:text-xl font-semibold text-sky-800">キッズルーム</h3>
                </div>
                <p className="text-gray-600 mb-4 text-sm md:text-base leading-relaxed">
                  ボールプール、ジャングルジム、各種おもちゃを完備した子ども専用スペース。<br className="sm:hidden" />小さなお子様が安心して遊べます。
                </p>
                <div className="space-y-2 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Blocks size={16} className="mr-2" />
                    <span>ボールプール・ジャングルジム</span>
                  </div>
                  <div className="flex items-center">
                    <MonitorPlay size={16} className="mr-2" />
                    <span>大型テレビ（WiFi対応）</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* アウトドア空間セクション */}
        <motion.section className="mb-16 md:mb-20" {...fadeInUp}>
          <div className="text-center mb-12">
            <h2 className="text-xl md:text-2xl font-bold text-sky-900 mb-4 flex items-center justify-center">
              <TentTree className="mr-3" size={32} />
              アウトドア空間
            </h2>
            <p className="text-gray-600 max-w-lg md:max-w-2xl mx-auto text-sm md:text-base leading-relaxed px-4">
              自然を満喫できる多彩なアウトドア空間で、<br className="sm:hidden" />思い出に残る体験を
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            {/* BBQテラス */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="grid grid-cols-2 gap-1">
                <img 
                  src={terraceImg} 
                  alt="BBQテラス1" 
                  className="w-full h-48 object-cover"
                />
                <img 
                  src={bbqImg} 
                  alt="BBQテラス2" 
                  className="w-full h-48 object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center mb-3">
                  <Beef className="text-sky-600 mr-2" size={24} />
                  <h3 className="text-base md:text-xl font-semibold text-sky-800">BBQテラス</h3>
                </div>
                <p className="text-gray-600 mb-4 text-sm md:text-base leading-relaxed">
                  屋根付きテラスにソファーテーブル設置。<br className="sm:hidden" />雨天時でも安心してBBQを楽しめます。<br className="sm:hidden" />家族や友人との楽しいひとときを過ごせる特別な空間です。
                </p>
                <div className="space-y-2 text-sm text-gray-500">
                  <div className="flex items-center">
                    <UmbrellaOff size={16} className="mr-2" />
                    <span>屋根付きテラス</span>
                  </div>
                  <div className="flex items-center">
                    <Sofa size={16} className="mr-2" />
                    <span>ソファーテーブル</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ガーデン */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="grid grid-cols-2 gap-1">
                <img 
                  src={gardenImg} 
                  alt="ガーデン1" 
                  className="w-full h-48 object-cover"
                />
                <img 
                  src={tentImg} 
                  alt="ガーデン2" 
                  className="w-full h-48 object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center mb-3">
                  <TentTree className="text-sky-600 mr-2" size={24} />
                  <h3 className="text-base md:text-xl font-semibold text-sky-800">ガーデン</h3>
                </div>
                <p className="text-gray-600 mb-4 text-sm md:text-base leading-relaxed">
                  広々とした芝生スペースにトランポリン、バドミントン用具完備。<br className="sm:hidden" />テントも設営できるほどゆとりのある広さで、<br className="sm:hidden" />子どもも愛犬も全力で楽しめる開放的な空間です。
                </p>
                <div className="space-y-2 text-sm text-gray-500">
                  <div className="flex items-center">
                    <TreePine size={16} className="mr-2" />
                    <span>広々とした芝生スペース</span>
                  </div>
                  <div className="flex items-center">
                    <Dribbble size={16} className="mr-2" />
                    <span>トランポリン・バドミントン</span>
                  </div>
                  <div className="flex items-center">
                    <Dog size={16} className="mr-2" />
                    <span>ペット同伴可</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* オプションサービスセクション */}
        <motion.section className="mb-16 md:mb-20" {...fadeInUp}>
          <div className="text-center mb-12">
            <h2 className="text-xl md:text-2xl font-bold text-sky-900 mb-4 flex items-center justify-center">
              <Gift className="mr-3" size={32} />
              オプションサービス
            </h2>
            <p className="text-gray-600 max-w-lg md:max-w-2xl mx-auto text-sm md:text-base leading-relaxed px-4">
              より快適にお過ごしいただくための<br className="sm:hidden" />各種サービスをご用意
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            {/* 無料貸出 */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
              <div className="flex items-center mb-4">
                <Gift className="text-green-600 mr-3" size={28} />
                <h3 className="text-base md:text-xl font-semibold text-green-800">無料貸出</h3>
              </div>
              <ul className="space-y-3 text-gray-700 text-sm md:text-base leading-relaxed">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                  <span>BBQ台・基本用具</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                  <span>調理器具</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                  <span>エンターテイメント用品</span>
                </li>
              </ul>
            </div>

            {/* 有料オプション */}
            <div className="bg-gradient-to-br from-sky-50 to-sky-100 rounded-lg p-6 border border-sky-200">
              <div className="flex items-center mb-4">
                <DollarSign className="text-sky-600 mr-3" size={28} />
                <h3 className="text-base md:text-xl font-semibold text-sky-800">有料オプション</h3>
              </div>
              <ul className="space-y-3 text-gray-700 text-sm md:text-base leading-relaxed">
                <li className="flex justify-between items-center">
                  <span>焼き網</span>
                  <span className="font-medium">550円</span>
                </li>
                <li className="flex justify-between items-center">
                  <span>BBQ用薪</span>
                  <span className="font-medium">550円</span>
                </li>
                <li className="flex justify-between items-center">
                  <span>ゴミ処分</span>
                  <span className="font-medium text-xs md:text-sm">1,100円/袋</span>
                </li>
                <li className="flex justify-between items-center">
                  <span>寝袋</span>
                  <span className="font-medium">550円/個</span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="text-xs md:text-sm">アルコール持込料</span>
                  <span className="font-medium">550円/人</span>
                </li>
              </ul>
            </div>

            {/* 樽販売 */}
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-6 border border-amber-200">
              <div className="flex items-center mb-4">
                <Beer className="text-amber-600 mr-3" size={28} />
                <h3 className="text-base md:text-xl font-semibold text-amber-800">お酒販売</h3>
              </div>
              <ul className="space-y-4 text-gray-700 text-sm md:text-base leading-relaxed">
                <li className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="font-medium">黒ラベル10L樽</div>
                    <div className="text-xs md:text-sm text-gray-500">本格生ビール</div>
                  </div>
                  <span className="font-bold text-amber-700 ml-2">8,250円</span>
                </li>
                <li className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="font-medium text-sm md:text-base">サワープレーン10L樽</div>
                    <div className="text-xs md:text-sm text-gray-500">爽やかサワー</div>
                  </div>
                  <span className="font-bold text-amber-700 ml-2">6,600円</span>
                </li>
                <li className="text-xs md:text-sm text-gray-500 pt-2 border-t border-amber-200">
                  （10L=中ジョッキで約25杯分）
                </li>
              </ul>
            </div>
          </div>
        </motion.section>

        {/* 利用時の注意事項セクション */}
        <motion.section className="mb-12 md:mb-16" {...fadeInUp}>
          <div className="text-center mb-12">
            <h2 className="text-xl md:text-2xl font-bold text-sky-900 mb-4 flex items-center justify-center">
              <AlertCircle className="mr-3" size={32} />
              利用時の注意事項
            </h2>
            <p className="text-gray-600 max-w-lg md:max-w-2xl mx-auto text-sm md:text-base leading-relaxed px-4">
              快適にご利用いただくための<br className="sm:hidden" />重要な情報です
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              <div>
                <h3 className="font-semibold text-sky-800 mb-3 flex items-center text-sm md:text-base">
                  <Package className="mr-2" size={20} />
                  持参推奨品
                </h3>
                <ul className="space-y-2 text-gray-600 text-sm md:text-base leading-relaxed">
                  <li>• サンダル・スリッパ</li>
                  <li>• お着替え（砂場利用時）</li>
                  <li>• タオル類</li>
                  <li>• 日焼け止め（夏季）</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-sky-800 mb-3 flex items-center text-sm md:text-base">
                  <Trash2 className="mr-2" size={20} />
                  ゴミ分別について
                </h3>
                <ul className="space-y-2 text-gray-600 text-sm md:text-base leading-relaxed">
                  <li>• 燃えるゴミ</li>
                  <li>• プラスチック</li>
                  <li>• 缶・ビン</li>
                  <li>• 処分サービス（有料）も<br className="sm:hidden" />ご利用可能</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-sky-800 mb-3 flex items-center text-sm md:text-base">
                  <AlertCircle className="mr-2" size={20} />
                  その他のお願い
                </h3>
                <ul className="space-y-2 text-gray-600 text-sm md:text-base leading-relaxed">
                  <li>• 近隣への騒音配慮</li>
                  <li>• 施設の丁寧な利用</li>
                  <li>• 火の取り扱い注意</li>
                  <li>• ペット同伴時のマナー</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.section>

        {/* ナビゲーション */}
        <div className="text-center space-y-4">
          <Link to="/booking">
            <Button>
              予約する
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FacilitiesPage;