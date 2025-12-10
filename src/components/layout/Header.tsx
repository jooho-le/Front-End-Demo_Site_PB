import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import './header.css';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/popular', label: 'Popular' },
  { to: '/search', label: 'Search' },
  { to: '/wishlist', label: 'Wishlist' }
];

function Header() {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`nf-header ${scrolled ? 'nf-header--solid' : ''}`}>
      <div className="nf-header__logo">
        <Link to="/">NeonFlix</Link>
      </div>
      <nav className="nf-header__nav">
        {navLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `nf-header__link ${isActive ? 'is-active' : ''}`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
      <div className="nf-header__actions">
        {/* 로그인 상태/버튼 자리 - 추후 상태 연동 */}
        <Link
          to={location.pathname === '/signin' ? '/signup' : '/signin'}
          className="nf-pill"
        >
          {location.pathname === '/signin' ? 'Sign Up' : 'Sign In'}
        </Link>
      </div>
    </header>
  );
}

export default Header;
