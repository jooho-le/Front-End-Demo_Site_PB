import { ReactElement, useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import * as FaIcons from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import './header.css';

type NavLinkItem = { to: string; label: string; icon: ReactElement };

const navLinks: NavLinkItem[] = [
  { to: '/', label: 'Home', icon: <FaIcons.FaHome /> },
  { to: '/popular', label: 'Popular', icon: <FaIcons.FaFire /> },
  { to: '/search', label: 'Search', icon: <FaIcons.FaSearch /> },
  { to: '/wishlist', label: 'Wishlist', icon: <FaIcons.FaHeart /> },
];

function Header() {
  const [scrolled, setScrolled] = useState(false);
  const { isLoggedIn, user, signout, openModal } = useAuth();

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
            <span className="nf-header__icon">{link.icon}</span>
            {link.label}
          </NavLink>
        ))}
      </nav>
      <div className="nf-header__actions">
        {isLoggedIn ? (
          <>
            <span className="nf-header__user">Hi, {user?.id}</span>
            <button className="nf-pill" onClick={signout}>
              <FaIcons.FaSignOutAlt /> 로그아웃
            </button>
          </>
        ) : (
          <>
            <button className="nf-pill" onClick={() => openModal('signin')}>
              <FaIcons.FaUser /> 로그인
            </button>
            <button className="nf-pill nf-pill--ghost" onClick={() => openModal('signup')}>
              회원가입
            </button>
          </>
        )}
      </div>
    </header>
  );
}

export default Header;
