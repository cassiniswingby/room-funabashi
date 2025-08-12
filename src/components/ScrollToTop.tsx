import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    // 複数の手法を組み合わせてより確実にスクロールをリセット
    const scrollToTop = () => {
      // 1. 即座にスクロール位置をリセット
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      
      // 2. requestAnimationFrame を使用してレンダリング後にもう一度実行
      requestAnimationFrame(() => {
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      });
      
      // 3. setTimeout を使用してさらに確実にする（モバイル対応）
      setTimeout(() => {
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      }, 0);
      
      // 4. 少し遅延させてもう一度実行（iOS Safari対応）
      setTimeout(() => {
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      }, 100);
    };

    // スクロール位置をリセット
    scrollToTop();

    // ページの履歴状態もリセット（ブラウザの戻る/進むボタン対応）
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }

  }, [location.pathname, location.key]); // location.keyを追加してページ内状態変化も検知

  return null;
};

export default ScrollToTop;