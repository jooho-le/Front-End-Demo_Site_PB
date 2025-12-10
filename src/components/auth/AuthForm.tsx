import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './auth-form.css';

type Mode = 'signin' | 'signup';

function AuthForm() {
  const navigate = useNavigate();
  const { mode, openModal, signin, signup } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [agree, setAgree] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');

  const isSignup = mode === 'signup';

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (isSignup) {
      const res = signup(email, password, passwordConfirm, agree);
      if (!res.ok) {
        setError(res.message || '회원가입에 실패했습니다.');
        return;
      }
      setError('');
      openModal('signin');
      navigate('/signin');
      return;
    }
    const res = signin(email, password, remember);
    if (!res.ok) {
      setError(res.message || '로그인에 실패했습니다.');
      return;
    }
    setError('');
    navigate('/');
  };

  return (
    <div className="nf-authform__wrapper">
      <div className={`nf-authform__panel ${isSignup ? 'is-signup' : 'is-signin'}`}>
        <div className="nf-authform__tabs">
          <button
            type="button"
            className={`nf-auth__tab ${!isSignup ? 'is-active' : ''}`}
            onClick={() => openModal('signin')}
          >
            로그인
          </button>
          <button
            type="button"
            className={`nf-auth__tab ${isSignup ? 'is-active' : ''}`}
            onClick={() => openModal('signup')}
          >
            회원가입
          </button>
        </div>

        <form className="nf-auth__form" onSubmit={handleSubmit}>
          <label className="nf-auth__field">
            <span>이메일</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="email@example.com"
            />
          </label>
          <label className="nf-auth__field">
            <span>비밀번호</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="TMDB API 키로도 저장됩니다."
            />
          </label>
          {isSignup && (
            <>
              <label className="nf-auth__field">
                <span>비밀번호 확인</span>
                <input
                  type="password"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  required
                />
              </label>
              <label className="nf-auth__checkbox">
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                  required
                />
                <span>약관에 동의합니다.</span>
              </label>
            </>
          )}
          {!isSignup && (
            <label className="nf-auth__checkbox">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              <span>Remember me (자동 로그인)</span>
            </label>
          )}
          {error && <p className="nf-auth__error">{error}</p>}
          <button type="submit" className="nf-auth__cta">
            {isSignup ? '회원가입' : '로그인'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AuthForm;
