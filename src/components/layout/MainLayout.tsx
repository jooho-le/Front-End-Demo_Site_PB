import { PropsWithChildren } from 'react';
import Header from './Header';
import Footer from './Footer';
import './layout.css';

function MainLayout({ children }: PropsWithChildren) {
  return (
    <div className="nf-shell">
      <div className="nf-backdrop" />
      <Header />
      <main className="nf-main">{children}</main>
      <Footer />
    </div>
  );
}

export default MainLayout;
