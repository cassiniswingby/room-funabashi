import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../components/Button';

// Import background image
import bgImg2 from '../assets/bg-image2.png';

type SeasonTab = 'regular' | 'high' | 'special';

const PRICING_PLANS = [
  {
    name: 'デイプラン',
    time: '10:00〜16:00',
    description: '日中のBBQやパーティーに最適なプラン',
    prices: {
      regular: {
        small: '11,000円',
        basic: '2,200円/人'
      },
      high: {
        small: '12,500円',
        basic: '2,500円/人'
      },
      special: {
        small: '16,500円',
        basic: '3,300円/人'
      }
    }
  },
  {
    name: 'ナイトプラン',
    time: '17:00〜24:00',
    description: '夜のBBQや宴会に最適なプラン',
    prices: {
      regular: {
        small: '11,000円',
        basic: '2,200円/人'
      },
      high: {
        small: '12,500円',
        basic: '2,500円/人'
      },
      special: {
        small: '16,500円',
        basic: '3,300円/人'
      }
    }
  },
  {
    name: 'ワンデイプラン',
    time: '10:00〜24:00',
    description: '朝から夜まで思う存分楽しめるプラン',
    prices: {
      regular: {
        small: '22,000円',
        basic: '4,400円/人'
      },
      high: {
        small: '22,500円',
        basic: '4,500円/人'
      },
      special: {
        small: '26,500円',
        basic: '5,300円/人'
      }
    }
  },
  {
    name: 'オールナイトプラン（ナイトプラン＋ミッドナイトプラン）',
    time: '17:00〜翌9:00',
    description: '夜通し利用できるプラン',
    prices: {
      regular: {
        small: '18,000円',
        basic: '3,600円/人'
      },
      high: {
        small: '19,500円',
        basic: '3,900円/人'
      },
      special: {
        small: '23,500円',
        basic: '4,700円/人'
      }
    }
  },
  {
    name: 'ワンデイオールナイトプラン（ワンデイプラン＋ミッドナイトプラン）',
    time: '10:00〜翌9:00',
    description: '朝から翌朝まで贅沢に過ごせるプラン',
    prices: {
      regular: {
        small: '29,000円',
        basic: '5,800円/人'
      },
      high: {
        small: '29,500円',
        basic: '5,900円/人'
      },
      special: {
        small: '33,500円',
        basic: '6,700円/人'
      }
    }
  }
];

const CHILD_PRICING = [
  {
    category: '未就園児',
    price: {
      day: 0,
      night: 0,
      oneday: 0
    }
  },
  {
    category: '未就学児',
    price: {
      day: 330,
      night: 330,
      oneday: 660
    }
  },
  {
    category: '小学生',
    price: {
      day: 550,
      night: 550,
      oneday: 1100
    }
  },
  {
    category: '中学生以上',
    price: {
      day: '大人料金',
      night: '大人料金',
      oneday: '大人料金'
    }
  }
];

const PricingGuidePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SeasonTab>('regular');

  useEffect(() => {
    document.title = 'room船橋｜料金案内';
  }, []);

  return (
    <div className="min-h-screen bg-sky-50">
      {/* ヘッダーセクション */}
      <section className="relative h-[50vh] flex items-center">
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ 
            backgroundImage: `url(${bgImg2})`,
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
            <h1 className="text-2xl md:text-3xl font-bold mb-6">料金ガイド</h1>
            <p className="text-base md:text-xl text-sky-100 max-w-lg md:max-w-3xl mx-auto leading-relaxed px-4">
              ご利用時間に合わせて最適なプランを<br className="sm:hidden" />お選びください
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-6 md:px-4 py-12">
        {/* 利用プラン */}
        <section className="mb-12">
          <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl md:text-2xl font-semibold text-sky-800 mb-6 text-left">利用プラン</h2>
            
            {/* シーズン切り替えタブ */}
            <div className="flex justify-center mb-8">
              <div className="bg-gray-50 rounded-lg shadow-sm inline-flex flex-wrap">
                <button
                  className={`py-2 px-3 md:px-6 rounded-l-lg font-medium transition-colors text-xs md:text-base ${
                    activeTab === 'regular'
                      ? 'bg-sky-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  onClick={() => setActiveTab('regular')}
                >
                  レギュラー<br className="sm:hidden" />シーズン
                </button>
                <button
                  className={`py-2 px-3 md:px-6 font-medium transition-colors text-xs md:text-base ${
                    activeTab === 'high'
                      ? 'bg-sky-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  onClick={() => setActiveTab('high')}
                >
                  ハイ<br className="sm:hidden" />シーズン
                </button>
                <button
                  className={`py-2 px-3 md:px-6 rounded-r-lg font-medium transition-colors text-xs md:text-base ${
                    activeTab === 'special'
                      ? 'bg-sky-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  onClick={() => setActiveTab('special')}
                >
                  スペシャル<br className="sm:hidden" />シーズン
                </button>
              </div>
            </div>

            {/* プランカード */}
            <div className="space-y-6">
              {PRICING_PLANS.map((plan) => (
                <div key={plan.name} className="bg-gray-50 rounded-lg p-4 md:p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex-1 md:pr-8 mb-4 md:mb-0">
                      <h3 className="text-base md:text-xl font-semibold text-sky-800 mb-2">{plan.name}</h3>
                      <div className="flex items-center text-gray-600 mb-2">
                        <Clock size={16} className="mr-2 flex-shrink-0" />
                        <span className="text-sm md:text-base">{plan.time}</span>
                      </div>
                      <p className="text-gray-600 text-sm md:text-base leading-relaxed">{plan.description}</p>
                    </div>

                    <div className="md:w-2/5 flex flex-col justify-center">
                      <div className="w-full space-y-3 md:space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 text-sm md:text-base">5名様以下：</span>
                          <span className="text-sky-600 font-medium text-base md:text-lg">
                            {plan.prices[activeTab].small}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 text-sm md:text-base">6名様以上：</span>
                          <span className="text-sky-600 font-medium text-base md:text-lg">
                            {plan.prices[activeTab].basic}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* シーズン区分 */}
        <section className="max-w-5xl mx-auto bg-white rounded-lg shadow-md p-6 md:p-8 mb-12">
          <h2 className="text-xl md:text-2xl font-semibold text-sky-800 mb-6">シーズン区分</h2>
          <div className="grid gap-6">
            <div className="border-l-4 border-sky-100 pl-4">
              <h3 className="font-medium text-gray-800 text-sm md:text-base">レギュラーシーズン</h3>
              <p className="text-gray-600 mt-1 text-sm md:text-base leading-relaxed">下記以外の平日</p>
            </div>
            
            <div className="border-l-4 border-sky-300 pl-4">
              <h3 className="font-medium text-gray-800 text-sm md:text-base">ハイシーズン</h3>
              <div className="mt-2 space-y-2">
                <p className="text-gray-600 text-sm md:text-base leading-relaxed">土日、連休、祝日</p>
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="font-medium text-gray-700 mb-2 text-sm md:text-base">2025年</p>
                  <ul className="space-y-1 text-gray-600 text-sm md:text-base leading-relaxed">
                    <li>春休み：3/18(火)〜4/6(日)</li>
                    <li>夏休み：7/19(土)〜8/31(日)</li>
                    <li>冬休み：12/24(水)〜26(金)</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="border-l-4 border-sky-600 pl-4">
              <h3 className="font-medium text-gray-800 text-sm md:text-base">スペシャルシーズン</h3>
              <div className="mt-2">
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="font-medium text-gray-700 mb-2 text-sm md:text-base">2025年</p>
                  <ul className="space-y-1 text-gray-600 text-sm md:text-base leading-relaxed">
                    <li>お盆：8/9(土)〜17(日)</li>
                    <li>年末年始：12/27(土)〜1/4(日)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 設備費 */}
        <section className="max-w-5xl mx-auto bg-white rounded-lg shadow-md p-6 mb-12">
          <h2 className="text-base md:text-xl font-semibold text-sky-800 mb-4">設備費（共通）</h2>
          <div className="flex items-center text-gray-700">
            <Info size={18} className="mr-2 text-sky-600 flex-shrink-0" />
            <span className="text-sm md:text-base leading-relaxed">1予約あたり設備費：2,000円</span>
          </div>
        </section>

        {/* 子ども料金 */}
        <section className="max-w-5xl mx-auto bg-white rounded-lg shadow-md p-6 mb-12">
          <h2 className="text-base md:text-xl font-semibold text-sky-800 mb-4">子ども料金</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-2 md:px-4 font-medium text-gray-700 text-xs md:text-base">年齢区分</th>
                  <th className="text-left py-3 px-2 md:px-4 font-medium text-gray-700 text-xs md:text-base">デイ／ナイト</th>
                  <th className="text-left py-3 px-2 md:px-4 font-medium text-gray-700 text-xs md:text-base">ワンデイ以上</th>
                </tr>
              </thead>
              <tbody>
                {CHILD_PRICING.map((row) => (
                  <tr key={row.category} className="border-b border-gray-100">
                    <td className="py-3 px-2 md:px-4 text-gray-800 text-xs md:text-base">{row.category}</td>
                    <td className="py-3 px-2 md:px-4 text-gray-800 text-xs md:text-base">{typeof row.price.night === 'number' ? `${row.price.night.toLocaleString()}円` : row.price.night}</td>
                    <td className="py-3 px-2 md:px-4 text-gray-800 text-xs md:text-base">{typeof row.price.oneday === 'number' ? `${row.price.oneday.toLocaleString()}円` : row.price.oneday}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 愛犬同伴料金 */}
        <section className="max-w-5xl mx-auto bg-white rounded-lg shadow-md p-6 mb-12">
          <h2 className="text-base md:text-xl font-semibold text-sky-800 mb-4">愛犬同伴料金</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-medium text-gray-800 mb-2 text-sm md:text-base">大型犬</h3>
              <p className="text-gray-700 text-sm md:text-base leading-relaxed">屋外のみ 1,100円／頭</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-800 mb-2 text-sm md:text-base">小型犬</h3>
              <div className="space-y-2">
                <p className="text-gray-700 text-sm md:text-base leading-relaxed">屋外のみ：550円／頭</p>
                <p className="text-gray-700 text-sm md:text-base leading-relaxed">室内利用：+1,100円（清掃費）<br className="sm:hidden" />※室内不可の場合あり</p>
              </div>
            </div>
            <div className="bg-gray-50 p-2 rounded-lg">
              <p className="text-sm text-gray-600 leading-relaxed">
                ※小型犬の室内利用は、アレルギー対策として別途清掃費が必要です。ご了承ください。
              </p>
            </div>
          </div>
        </section>

        {/* 予約ボタン */}
        <div className="text-center">
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

export default PricingGuidePage;