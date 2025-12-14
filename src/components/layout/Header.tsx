import { ElementType, useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FaHome, FaFire, FaSearch, FaHeart, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { usePreferences } from '../../context/PreferencesContext';
import './header.css';

type NavLinkItem = { to: string; label: string; Icon: ElementType };

const IconHome = FaHome as unknown as ElementType;
const IconFire = FaFire as unknown as ElementType;
const IconSearch = FaSearch as unknown as ElementType;
const IconHeart = FaHeart as unknown as ElementType;
const IconUser = FaUser as unknown as ElementType;
const IconSignOut = FaSignOutAlt as unknown as ElementType;

const navLinks: NavLinkItem[] = [
  { to: '/', label: 'Home', Icon: IconHome },
  { to: '/popular', label: 'Popular', Icon: IconFire },
  { to: '/search', label: 'Search', Icon: IconSearch },
  { to: '/wishlist', label: 'Wishlist', Icon: IconHeart },
];

function Header() {
  const [scrolled, setScrolled] = useState(false);
  const { isLoggedIn, user, signout, openModal } = useAuth();
  const { toggleTheme, theme, language, setLanguage } = usePreferences();
  const t = {
    home: language === 'en' ? 'Home' : '홈',
    popular: language === 'en' ? 'Popular' : '대세',
    search: language === 'en' ? 'Search' : '검색',
    wishlist: language === 'en' ? 'Wishlist' : '위시리스트',
    login: language === 'en' ? 'Sign In' : '로그인',
    signup: language === 'en' ? 'Sign Up' : '회원가입',
    logout: language === 'en' ? 'Logout' : '로그아웃',
    themeLabel: theme === 'neon' ? '네온' : '다크',
  };

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
            <span className="nf-header__icon">
              <link.Icon aria-hidden="true" />
            </span>
            {(() => {
              if (link.to === '/') return t.home;
              if (link.to === '/popular') return t.popular;
              if (link.to === '/search') return t.search;
              if (link.to === '/wishlist') return t.wishlist;
              return link.label;
            })()}
          </NavLink>
        ))}
      </nav>
      <div className="nf-header__actions">
        <button className="nf-pill nf-pill--ghost" onClick={toggleTheme}>
          테마: {t.themeLabel}
        </button>
        <select
          className="nf-pill nf-pill--ghost nf-header__lang"
          value={language}
          onChange={(e) => setLanguage(e.target.value as any)}
        >
          <option value="ko">KO</option>
          <option value="en">EN</option>
        </select>
        {isLoggedIn ? (
          <>
            <span className="nf-header__user">Hi, {user?.id}</span>
            <button className="nf-pill" onClick={signout}>
              <IconSignOut aria-hidden="true" /> {t.logout}
            </button>
          </>
        ) : (
          <>
            <button className="nf-pill" onClick={() => openModal('signin')}>
              <IconUser aria-hidden="true" /> {t.login}
            </button>
            <button className="nf-pill nf-pill--ghost" onClick={() => openModal('signup')}>
              {t.signup}
            </button>
          </>
        )}
      </div>
    </header>
  );
}

export default Header;
