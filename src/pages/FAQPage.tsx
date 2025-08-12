import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Clock, 
  Car, 
  UtensilsCrossed, 
  Home, 
  Baby, 
  Dog, 
  Sparkles, 
  Wifi, 
  XCircle,
  ChevronRight,
  MapPin,
  CreditCard
} from 'lucide-react';

// Import background image
import bgImg2 from '../assets/bg-image2.png';

interface FAQItem {
  question: string;
  answer: React.ReactNode;
}

interface FAQSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  items: FAQItem[];
}

const FAQPage: React.FC = () => {
  useEffect(() => {
    document.title = 'room船橋｜よくある質問（FAQ）';
  }, []);

  const faqSections: FAQSection[] = [
    {
      id: 'checkin-checkout',
      title: 'チェックイン・チェックアウト',
      icon: <Clock size={24} />,
      items: [
        {
          question: 'チェックインやチェックアウトの時間は決まっていますか？',
          answer: (
            <p>
              当施設では「デイプラン」「ナイトプラン」など、<strong>時間帯別のご利用プランをご用意</strong>しております。ご利用時間はプランによって異なりますので、詳しくは
              <Link to="/pricing" className="text-sky-600 hover:underline mx-1">
                料金案内ページ
              </Link>
              をご確認ください。
            </p>
          )
        }
      ]
    },
    {
      id: 'access-parking',
      title: 'アクセス・駐車場',
      icon: <Car size={24} />,
      items: [
        {
          question: '駐車場はありますか？',
          answer: (
            <p>
              敷地内に<strong>無料駐車スペースを2台分</strong>ご用意しております。ご利用の際は、予約時に台数をお知らせいただけるとスムーズです。
            </p>
          )
        },
        {
          question: '最寄り駅からのアクセス方法を教えてください。',
          answer: (
            <p>
              京成バス「千葉ウエスト」路線にて、「市立体育館・市民プール入口」バス停で下車後、<strong>徒歩約5分</strong>でお越しいただけます。詳しくは
              <Link to="/#access" className="text-sky-600 hover:underline mx-1">
                アクセス情報
              </Link>
              をご覧ください。
            </p>
          )
        }
      ]
    },
    {
      id: 'food-kitchen',
      title: '食事・キッチン設備',
      icon: <UtensilsCrossed size={24} />,
      items: [
        {
          question: '食事の提供はありますか？',
          answer: (
            <div>
              <p className="mb-4">
                食事のご提供はございませんが、<strong>キッチン（冷蔵庫・コンロ・調理器具・食器など）を自由にご利用いただけます</strong>。
              </p>
              <div className="mb-4">
                <p className="font-medium text-gray-700 mb-2">近隣の店舗情報：</p>
                <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4">
                  <li>ミニストップ（徒歩約5分）</li>
                  <li>ヨークマート（車で約4分）</li>
                </ul>
              </div>
              <p>
                <strong>食材の持ち込みやテイクアウトのご利用をおすすめ</strong>しております。
              </p>
            </div>
          )
        },
        {
          question: 'バーベキューはできますか？',
          answer: (
            <p>
              はい、<strong>屋外スペースにてバーベキューをお楽しみいただけます（予約不要）</strong>。
              炭などの消耗品は追加料金にてご利用いただけますので、ご希望の方はお気軽にお申し付けください。
            </p>
          )
        }
      ]
    },
    {
      id: 'facilities-amenities',
      title: '設備・アメニティ',
      icon: <Home size={24} />,
      items: [
        {
          question: 'お風呂やシャワーはありますか？',
          answer: (
            <p>
              恐れ入りますが、<strong>当施設にはお風呂・シャワーの設備はございません</strong>。
            </p>
          )
        },
        {
          question: '冷暖房設備は整っていますか？',
          answer: (
            <p>
              はい、<strong>エアコンやストーブなどの冷暖房設備を完備</strong>しております。
              冬季は冷え込むこともありますので、<strong>暖かい服装やスリッパのご持参をおすすめ</strong>しております。
            </p>
          )
        }
      ]
    },
    {
      id: 'children-pets',
      title: '子ども連れ・ペット連れ',
      icon: <Baby size={24} />,
      items: [
        {
          question: '子ども連れでも利用できますか？',
          answer: (
            <p>
              はい、もちろんご利用いただけます。
              <strong>ボールプールやジャングルジム、おもちゃ類を備えたキッズルーム</strong>もございますので、小さなお子様も安心してお楽しみいただけます。詳しくは
              <Link to="/facilities" className="text-sky-600 hover:underline mx-1">
                施設案内ページ
              </Link>
              をご覧ください。
            </p>
          )
        },
        {
          question: 'ペットと一緒に滞在できますか？',
          answer: (
            <p>
              はい、<strong>ご予約時にオプション追加いただくことでペット同伴が可能</strong>です。
              <strong>小型犬は屋内外ともに滞在可、大型犬は屋外のみのご案内</strong>となります。
              詳しくは
              <Link to="/pricing" className="text-sky-600 hover:underline mx-1">
                料金案内ページ
              </Link>
              をご覧ください。
            </p>
          )
        }
      ]
    },
    {
      id: 'cleaning-hygiene',
      title: '清掃・衛生対策',
      icon: <Sparkles size={24} />,
      items: [
        {
          question: '衛生面の対策はどのようになっていますか？',
          answer: (
            <p>
              <strong>ご利用前後にはスタッフによる清掃を実施し、消毒や換気も徹底</strong>しております。
              <strong>清潔で安心してお過ごしいただける環境づくりに努めています</strong>。
            </p>
          )
        }
      ]
    },
    {
      id: 'wifi-internet',
      title: 'Wi-Fi・通信環境',
      icon: <Wifi size={24} />,
      items: [
        {
          question: 'Wi-Fiは利用できますか？',
          answer: (
            <p>
              はい、<strong>館内では無料Wi-Fiをご利用いただけます</strong>。パスワードは現地でご案内いたします。
            </p>
          )
        }
      ]
    },
    {
      id: 'cancellation-changes',
      title: 'キャンセル・ご変更について',
      icon: <XCircle size={24} />,
      items: [
        {
          question: 'キャンセルは可能ですか？',
          answer: (
            <div>
              <p className="mb-4">
                ご利用日の<strong>1週間前まで</strong>であればキャンセル料はかかりません。
                それ以降は以下の通りキャンセル料が発生いたします。
              </p>
              <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
                <li>ご利用日の7〜3日前：<strong>ご利用料金の50%</strong></li>
                <li>ご利用日の2日前〜当日：<strong>ご利用料金の100%</strong></li>
              </ul>
              <p>
                キャンセル手続きは
                <Link to="/reservation-management" className="text-sky-600 hover:underline mx-1">
                  予約の確認・キャンセルページ
                </Link>
                から行えます。
              </p>
            </div>
          )
        }
      ]
    }
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

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
            <h1 className="text-2xl md:text-3xl font-bold mb-6">よくある質問（FAQ）</h1>
            <p className="text-base md:text-xl text-sky-100 max-w-lg md:max-w-3xl mx-auto leading-relaxed px-4">
              room船橋のご利用に関する<br className="sm:hidden" />よくあるご質問にお答えします
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-6 md:px-4 py-12">
        {/* 目次 */}
        <motion.section 
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold text-sky-800 mb-6 text-center">目次</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {faqSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className="flex items-center p-4 bg-sky-50 rounded-lg hover:bg-sky-100 transition-colors text-left group"
                >
                  <div className="text-sky-600 mr-3 flex-shrink-0">
                    {section.icon}
                  </div>
                  <span className="text-sky-800 font-medium text-sm md:text-base flex-1">
                    {section.title}
                  </span>
                  <ChevronRight size={18} className="text-sky-400 group-hover:text-sky-600 transition-colors" />
                </button>
              ))}
            </div>
          </div>
        </motion.section>

        {/* FAQ セクション */}
        {faqSections.map((section, sectionIndex) => (
          <motion.section
            key={section.id}
            id={section.id}
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: sectionIndex * 0.1 }}
          >
            <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
              <div className="flex items-center mb-6">
                <div className="text-sky-600 mr-3">
                  {section.icon}
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-sky-800">
                  {section.title}
                </h2>
              </div>

              <div className="space-y-8">
                {section.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="border-b border-gray-100 last:border-b-0 pb-6 last:pb-0">
                    <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-4">
                      Q. {item.question}
                    </h3>
                    <div className="text-gray-700 text-sm md:text-base leading-relaxed pl-4">
                      A. {item.answer}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.section>
        ))}

        {/* お問い合わせセクション */}
        <motion.section
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div className="bg-sky-100 rounded-lg p-8">
            <h2 className="text-xl md:text-2xl font-bold text-sky-800 mb-4">
              その他のご質問がございましたら
            </h2>
            <p className="text-gray-700 mb-6 text-sm md:text-base leading-relaxed">
              上記以外でご不明な点がございましたら、<br className="sm:hidden" />お気軽にお問い合わせください
            </p>
            <div className="space-y-2 text-gray-700">
              <p className="flex items-center justify-center text-sm md:text-base">
                <span className="font-medium">電話：</span>
                <span className="ml-2">047-402-2332</span>
              </p>
              <p className="flex items-center justify-center text-sm md:text-base">
                <span className="font-medium">メール：</span>
                <span className="ml-2">info@room-funabashi.jp</span>
              </p>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default FAQPage;