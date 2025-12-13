import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FaHome, FaFire, FaSearch, FaHeart, FaUser, FaSignOutAlt } from 'react-icons/fa';
import type { ComponentType } from 'react';
import type { IconBaseProps } from 'react-icons';
import { useAuth } from '../../context/AuthContext';
import './header.css';

type NavLinkItem = { to: string; label: string; Icon: ComponentType<IconBaseProps> };

const IconHome = FaHome as ComponentType<IconBaseProps>;
const IconFire = FaFire as ComponentType<IconBaseProps>;
const IconSearch = FaSearch as ComponentType<IconBaseProps>;
const IconHeart = FaHeart as ComponentType<IconBaseProps>;
const IconUser = FaUser as ComponentType<IconBaseProps>;
const IconSignOut = FaSignOutAlt as ComponentType<IconBaseProps>;

const navLinks: NavLinkItem[] = [
  { to: '/', label: 'Home', Icon: IconHome },
  { to: '/popular', label: 'Popular', Icon: IconFire },
  { to: '/search', label: 'Search', Icon: IconSearch },
  { to: '/wishlist', label: 'Wishlist', Icon: IconHeart },
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
            <span className="nf-header__icon">
              <link.Icon aria-hidden="true" />
            </span>
            {link.label}
          </NavLink>
        ))}
      </nav>
      <div className="nf-header__actions">
        {isLoggedIn ? (
          <>
            <span className="nf-header__user">Hi, {user?.id}</span>
            <button className="nf-pill" onClick={signout}>
              <IconSignOut aria-hidden="true" /> 로그아웃
            </button>
          </>
        ) : (
          <>
            <button className="nf-pill" onClick={() => openModal('signin')}>
              <IconUser aria-hidden="true" /> 로그인
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
