import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  AlertTriangle, 
  XCircle, 
  FileText, 
  Info,
  ChevronRight,
  Phone,
  CreditCard
} from 'lucide-react';

// Import background image
import bgImg2 from '../assets/bg-image2.png';

interface PolicySection {
  id: string;
  title: string;
  icon: React.ReactNode;
}

const TermsPolicyPage: React.FC = () => {
  useEffect(() => {
    document.title = 'room船橋｜キャンセルポリシー・利用規約';
  }, []);

  const policySections: PolicySection[] = [
    {
      id: 'cancellation-policy',
      title: 'キャンセルポリシー',
      icon: <Calendar size={24} />
    },
    {
      id: 'usage-hours',
      title: 'ご利用時間について',
      icon: <Clock size={24} />
    },
    {
      id: 'reservation-acceptance',
      title: 'ご予約受付について',
      icon: <FileText size={24} />
    },
    {
      id: 'liability-disclaimer',
      title: '損害賠償・免責事項',
      icon: <AlertTriangle size={24} />
    },
    {
      id: 'prohibited-activities',
      title: 'ご利用禁止・制限行為',
      icon: <XCircle size={24} />
    },
    {
      id: 'other-notices',
      title: 'その他ご注意事項',
      icon: <Info size={24} />
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
            <h1 className="text-2xl md:text-3xl font-bold mb-6">キャンセルポリシー・利用規約</h1>
            <p className="text-base md:text-xl text-sky-100 max-w-lg md:max-w-3xl mx-auto leading-relaxed px-4">
              ご利用前に必ずお読みください
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
              {policySections.map((section) => (
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

        {/* キャンセルポリシー */}
        <motion.section
          id="cancellation-policy"
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
            <div className="flex items-center mb-6">
              <Calendar className="text-sky-600 mr-3" size={28} />
              <h2 className="text-xl md:text-2xl font-bold text-sky-800">キャンセルポリシー</h2>
            </div>

            <div className="space-y-8">
              <div>
                <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-4">ご予約自体をキャンセルされる場合</h3>
                <p className="text-gray-700 mb-4 text-sm md:text-base leading-relaxed">
                  ご予約のキャンセルは、<strong>ご利用日の1週間前まで</strong>は無料で承っております。
                </p>
                <p className="text-gray-700 mb-4 text-sm md:text-base leading-relaxed">
                  それ以降は以下のキャンセル料が発生いたします：
                </p>
                <ul className="list-disc list-inside space-y-2 mb-4 ml-4 text-gray-700 text-sm md:text-base leading-relaxed">
                  <li>ご利用日の <strong>7〜3日前</strong>：ご利用料金の <strong>50%</strong></li>
                  <li>ご利用日の <strong>2日前〜当日</strong>：ご利用料金の <strong>100%</strong></li>
                </ul>
              </div>

              <div>
                <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-4">ご予約人数のみ減る場合</h3>
                <p className="text-gray-700 mb-4 text-sm md:text-base leading-relaxed">
                  ご利用日の <strong>2日前以降の人数変更</strong>については、<strong>減少人数分の100%のキャンセル料</strong>をいただきます。
                </p>
                <div className="bg-sky-50 p-4 rounded-lg border-l-4 border-sky-300">
                  <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                    <strong>例）ご利用日：4月12日の場合</strong><br />
                    ・4月4日まで：キャンセル料不要<br />
                    ・4月5日〜4月9日：50%<br />
                    ・4月10日〜当日（4月12日）：100%
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                  キャンセル手続きは
                  <Link to="/reservation-management" className="text-sky-600 hover:underline mx-1">
                    予約の確認・キャンセルページ
                  </Link>
                  から行えます。
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* ご利用時間について */}
        <motion.section
          id="usage-hours"
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
            <div className="flex items-center mb-6">
              <Clock className="text-sky-600 mr-3" size={28} />
              <h2 className="text-xl md:text-2xl font-bold text-sky-800">ご利用時間について</h2>
            </div>

            <div className="space-y-6">
              <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                ご予約時間には、<strong>準備・片付けの時間も含まれます</strong>。<br />
                プランに応じた基本利用時間は
                <Link to="/pricing" className="text-sky-600 hover:underline mx-1">
                  料金案内ページ
                </Link>
                をご確認ください。
              </p>

              <ul className="list-disc list-inside space-y-2 ml-4 text-gray-700 text-sm md:text-base leading-relaxed">
                <li>基本時間以外のご利用をご希望の場合は、<strong>事前にご相談ください</strong>。</li>
                <li>当日の延長は、<strong>他の予約状況によってお受けできない場合</strong>がございます。</li>
              </ul>
            </div>
          </div>
        </motion.section>

        {/* ご予約受付について */}
        <motion.section
          id="reservation-acceptance"
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
            <div className="flex items-center mb-6">
              <FileText className="text-sky-600 mr-3" size={28} />
              <h2 className="text-xl md:text-2xl font-bold text-sky-800">ご予約受付について</h2>
            </div>

            <div className="space-y-4">
              <ul className="list-disc list-inside space-y-3 ml-4 text-gray-700 text-sm md:text-base leading-relaxed">
                <li>ご予約は <strong>ご利用月の2ヶ月前から受付可能</strong> です。</li>
                <li>一部、<strong>前金をお願いする場合</strong>がございます（※予約カレンダーにてご案内）。</li>
                <li><strong>ご利用日の2日前以降のご予約はお電話にて承ります</strong>。</li>
              </ul>

              <div className="bg-sky-50 p-4 rounded-lg">
                <p className="text-gray-700 text-sm md:text-base leading-relaxed flex items-center">
                  <Phone size={16} className="mr-2 text-sky-600" />
                  お電話でのご予約：<strong>047-402-2332</strong>
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* 損害賠償・免責事項 */}
        <motion.section
          id="liability-disclaimer"
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
            <div className="flex items-center mb-6">
              <AlertTriangle className="text-sky-600 mr-3" size={28} />
              <h2 className="text-xl md:text-2xl font-bold text-sky-800">損害賠償・免責事項</h2>
            </div>

            <div className="space-y-4">
              <ul className="list-disc list-inside space-y-3 ml-4 text-gray-700 text-sm md:text-base leading-relaxed">
                <li><strong>施設や備品の破損があった場合、修理費・損害賠償費をご負担いただきます</strong>。</li>
                <li>ご利用中の <strong>事故・盗難について、当施設は責任を負いかねます</strong>。</li>
                <li>ご利用者様には、器具・設備の安全なご使用をお願いしております。</li>
              </ul>

              <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-300">
                <p className="text-red-700 text-sm md:text-base leading-relaxed">
                  <strong>重要：</strong>貴重品の管理はお客様ご自身でお願いいたします。
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* ご利用禁止・制限行為 */}
        <motion.section
          id="prohibited-activities"
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
            <div className="flex items-center mb-6">
              <XCircle className="text-sky-600 mr-3" size={28} />
              <h2 className="text-xl md:text-2xl font-bold text-sky-800">ご利用禁止・制限行為</h2>
            </div>

            <div className="space-y-6">
              <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                以下の行為は禁止です。違反があった場合、<strong>利用中止・以後の利用をお断りする</strong>場合がございます。
              </p>

              <ul className="list-disc list-inside space-y-3 ml-4 text-gray-700 text-sm md:text-base leading-relaxed">
                <li><strong>施設内での喫煙（全面禁煙）</strong></li>
                <li>使用目的と異なる用途での利用</li>
                <li>大音量・悪臭を発する物の持ち込み</li>
                <li>コンパニオン・接待等の連れ込み行為</li>
                <li>施設・備品の破損に繋がる重量物の持ち込み</li>
                <li>建物・設備へのテープ貼りや釘打ちなどの加工</li>
              </ul>

              <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-300">
                <p className="text-yellow-800 text-sm md:text-base leading-relaxed">
                  <strong>注意：</strong>近隣住民の方々への配慮をお願いいたします。
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* その他ご注意事項 */}
        <motion.section
          id="other-notices"
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
            <div className="flex items-center mb-6">
              <Info className="text-sky-600 mr-3" size={28} />
              <h2 className="text-xl md:text-2xl font-bold text-sky-800">その他ご注意事項</h2>
            </div>

            <div className="space-y-6">
              <ul className="list-disc list-inside space-y-3 ml-4 text-gray-700 text-sm md:text-base leading-relaxed">
                <li><strong>ゴミは原則お持ち帰りください</strong>。（※1袋1,100円で引き取り可能）</li>
                <li><strong>代表者様は常時会場に常駐</strong>してください（事故・盗難の防止含む）。</li>
                <li>使用した備品は <strong>元の場所へ戻してください</strong>。</li>
                <li>小さなお子様のご利用もございます。<strong>破損・危険がある場合は必ずご申告ください</strong>。</li>
              </ul>

              <div className="bg-gray-100 p-6 rounded-lg">
                <p className="text-gray-700 text-sm md:text-base leading-relaxed mb-4">
                  ご利用状況によっては、<strong>違約金や法的手続き</strong>を行う場合がございます。
                </p>
                <p className="text-gray-700 text-sm md:text-base leading-relaxed font-medium">
                  <strong>利用規約をよくお読みの上、安心・安全なご利用をお願いいたします。</strong>
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* お問い合わせセクション */}
        <motion.section
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <div className="bg-sky-100 rounded-lg p-8">
            <h2 className="text-xl md:text-2xl font-bold text-sky-800 mb-4">
              ご不明な点がございましたら
            </h2>
            <p className="text-gray-700 mb-6 text-sm md:text-base leading-relaxed">
              利用規約に関するご質問は、<br className="sm:hidden" />お気軽にお問い合わせください
            </p>
            <div className="space-y-2 text-gray-700">
              <p className="flex items-center justify-center text-sm md:text-base">
                <Phone size={16} className="mr-2" />
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

export default TermsPolicyPage;