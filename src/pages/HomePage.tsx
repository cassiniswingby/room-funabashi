import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Wifi, Home, ToyBrick, MonitorPlay, Beef, CookingPot, TentTree, ArrowRight} from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';

// Import all images
import terraceImg from '../assets/terrace.png';
import logoImg from '../assets/logo_upscaled.png';
import nightImg from '../assets/night.png';
import gardenImg from '../assets/garden.png';

const HomePage: React.FC = () => {
  useEffect(() => {
    document.title = 'room船橋｜ホーム';
  }, []);

  return (
    <>
      {/* ヒーローセクション */}
      <section className="relative h-[100vh]">
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ 
            backgroundImage: `url(${terraceImg})`,
            filter: "brightness(0.7)"
          }} 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-sky-950/40 to-sky-950/60" />
        <div className="container mx-auto px-6 md:px-4 h-full flex items-center justify-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, delay: 0.4 }}
            className="flex justify-center"
          >
            <img 
              src={logoImg} 
              alt="Room Funabashi" 
              className="max-h-[50vh] w-auto mx-auto opacity-90" 
            />
          </motion.div>
        </div>
      </section>

      {/* コンセプトセクション */}
      <section id="about" className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-6 md:px-4">
          <div className="space-y-16 md:space-y-20">
            {/* セクション1: 想い */}
            <div className="flex flex-col md:flex-row gap-8 md:gap-10 items-center">
              <div className="w-full md:w-1/2 px-2 md:px-8 order-1 md:order-1">
                <h2 className="text-xl md:text-2xl font-bold text-sky-900 mb-6">想い</h2>
                <div className="text-gray-700 space-y-4 md:space-y-6 text-sm md:text-base leading-relaxed max-w-md md:max-w-none mx-auto">
                  <p>多忙な日々から解放されゆったり過ごしたい・・・</p>
                  <p>そう思うこと、ありませんか？</p>
                  <p>room船橋は休息を求める全ての人たちに捧ぐ<br className="sm:hidden" />癒しの空間です</p>
                  <p>大人も子供もみんなが楽しく、くつろげる</p>
                  <p>私たちが作るのはそんな場所です</p>
                </div>
              </div>
              <div className="w-full md:w-1/2 order-2 md:order-2">
                <img
                  src={nightImg}
                  alt="古民家の外観"
                  className="w-full aspect-video object-cover shadow-xl rounded-lg"
                />
              </div>
            </div>
        
            {/* セクション2: 空間 */}
            <div className="flex flex-col md:flex-row-reverse gap-8 md:gap-10 items-center">
              <div className="w-full md:w-1/2 px-2 md:px-8 order-1 md:order-1">
                <h2 className="text-xl md:text-2xl font-bold text-sky-900 mb-6">空間</h2>
                <div className="text-gray-700 text-sm md:text-base leading-relaxed space-y-4 md:space-y-6 max-w-md md:max-w-none mx-auto">
                  <p>こだわりの空間についてご案内</p>
                  <p>とにかく「くつろいでほしい」</p>
                  <p>そんな想いを込めて作り上げた室内とお庭です</p>
                  <p>広々と遊び回れて、みんなが同じ空間で過ごせる<br className="sm:hidden" />工夫をしています</p>
                  <p>他にもBBQにタコパに卓球にと飽きずに<br className="sm:hidden" />お楽しみいただけます</p>
                </div>
              </div>
              <div className="w-full md:w-1/2 md:-mr-4 order-2 md:order-2">
                <img
                  src={gardenImg}
                  alt="広々としたお庭"
                  className="w-full aspect-video object-cover shadow-xl rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 施設案内セクション */}
      <section id="facilities" className="py-16 md:py-20 bg-sky-50">
        <div className="container mx-auto px-6 md:px-4">
          <h2 className="text-xl md:text-2xl font-bold text-sky-900 mb-4 text-center">施設案内</h2>
          <p className="text-gray-600 text-center mb-12 max-w-lg md:max-w-4xl mx-auto text-sm md:text-base leading-relaxed px-4">
            充実した設備とこだわりの空間で、<br className="sm:hidden" />特別なひとときを
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12">
            {[
              { 
                icon: <Wifi size={24} className="text-sky-700" />, 
                title: '無料Wi-Fi', 
                description: '館内全体で快適なインターネットを\nご利用いただけます' 
              },
              { 
                icon: <ToyBrick size={24} className="text-sky-700" />, 
                title: 'キッズスペース', 
                description: '小さなお子様が安心して遊べる\n屋内スペースをご用意' 
              },
              { 
                icon: <MonitorPlay size={24} className="text-sky-700" />, 
                title: '大型テレビ', 
                description: 'Wi-Fi対応のテレビで、\n各種動画配信サービスをご利用いただけます' 
              },
              { 
                icon: <Beef size={24} className="text-sky-700" />, 
                title: 'BBQテラス', 
                description: 'ソファーテーブル設置のテラスで、\nご家族やご友人とBBQを楽しめます' 
              },
              { 
                icon: <CookingPot size={24} className="text-sky-700" />, 
                title: 'キッチン設備', 
                description: '調理器具・食器が揃った\n広々キッチンを完備しています' 
              },
              { 
                icon: <TentTree size={24} className="text-sky-700" />, 
                title: 'ガーデン', 
                description: '広々とした庭スペースで\n子どもも愛犬も全力で楽しめます' 
              }
            ].map((feature, index) => (
              <div 
                key={index} 
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-base md:text-xl font-semibold text-sky-800 mb-3">{feature.title}</h3>
                <p className="text-gray-600 text-sm md:text-base leading-relaxed whitespace-pre-line">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* 詳細ページへのボタン */}
          <div className="text-center">
            <Link to="/facilities">
              <Button>
                施設の詳細を見る
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* アクセスセクション */}
      <section id="access" className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-6 md:px-4">
          <h2 className="text-xl md:text-2xl font-bold text-sky-900 mb-4 text-center">アクセス</h2>
          <p className="text-gray-600 text-center mb-12 max-w-lg md:max-w-3xl mx-auto text-sm md:text-base leading-relaxed px-4">
            船橋の閑静な住宅街に位置しています
          </p>
          
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 items-stretch">
            <div className="w-full lg:w-1/2">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3238.9506215019615!2d139.99678279999998!3d35.7274329!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6018815e02800add%3A0x1dfc6d144d5889cd!2zcm9vbeiIueapiw!5e0!3m2!1sja!2sjp!4v1746778259162!5m2!1sja!2sjp"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '400px' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded-lg shadow-lg h-full"
              />
            </div>
            
            <div className="w-full lg:w-1/2 flex flex-col justify-between">
              <div className="space-y-6 flex-grow">
                <div className="bg-sky-50 p-6 rounded-lg">
                  <h3 className="text-base md:text-xl font-semibold text-sky-800 mb-4">交通案内</h3>
                  
                  <div className="mb-6">
                    <h4 className="font-medium text-sky-700 mb-3 text-sm md:text-base">電車・バスでお越しの場合</h4>
                    <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                      京成バス千葉ウエストで<br className="sm:hidden" />「市立体育館・市民プール入口」下車徒歩5分
                    </p>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-medium text-sky-700 mb-3 text-sm md:text-base">お車でお越しの場合</h4>
                    <div className="space-y-2">
                      <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                        船橋駅から15分（駐車場2台完備）
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-sky-700 mb-3 text-sm md:text-base">所在地</h4>
                    <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                      〒273-0866<br className="sm:hidden" />
                      千葉県船橋市夏見台6-15−15
                    </p>
                  </div>
                </div>
                
                <div className="bg-sky-50 p-6 rounded-lg">
                  <h3 className="text-base md:text-xl font-semibold text-sky-800 mb-4">周辺施設</h3>
                  <ul className="space-y-3 text-gray-700 text-sm md:text-base leading-relaxed">
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-sky-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>船橋運動公園：徒歩で約1分</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-sky-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>ミニストップ（コンビニ）：徒歩で約5分</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-sky-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>ヨークマート（スーパー）：車で約4分</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTAセクション */}
      <section className="py-16 bg-sky-700 text-white">
        <div className="container mx-auto px-6 md:px-4 text-center">
          <h2 className="text-xl md:text-2xl font-bold mb-6">room船橋で特別な思い出を</h2>
          <p className="text-sky-100 max-w-lg md:max-w-2xl mx-auto mb-8 text-sm md:text-base leading-relaxed px-4">
            大切な人との時間を、<br className="sm:hidden" />船橋の古民家で過ごしてみませんか？<br />
            心温まるおもてなしと、<br className="sm:hidden" />くつろぎの空間が皆様をお待ちしています
          </p>
          <Link to="/booking">
            <Button variant="secondary">
              予約する
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
};

export default HomePage;