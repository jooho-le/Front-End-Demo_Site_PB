import { PropsWithChildren } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import './layout.css';

function MainLayout({ children }: PropsWithChildren) {
  const location = useLocation();

  return (
    <div className="nf-shell">
      <div className="nf-backdrop" />
      <Header />
      <main className="nf-main">
        <div key={location.pathname} className="nf-main__page nf-main__page--animate">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default MainLayout;
