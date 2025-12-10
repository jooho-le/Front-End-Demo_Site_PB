import { FormEvent, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './auth.css';

function AuthModal() {
  const { mode, open, closeModal, signin, signup, openModal } = useAuth();
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [error, setError] = useState('');

  if (!open) return null;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = mode === 'signin' ? signin(id, pw) : signup(id, pw);
    if (!result.ok) {
      setError(result.message || '다시 시도해주세요.');
      return;
    }
    setError('');
    setId('');
    setPw('');
  };

  return (
    <div className="nf-auth__backdrop" onClick={closeModal}>
      <div className="nf-auth__card" onClick={(e) => e.stopPropagation()}>
        <div className="nf-auth__tabs">
          <button
            type="button"
            className={`nf-auth__tab ${mode === 'signin' ? 'is-active' : ''}`}
            onClick={() => openModal('signin')}
          >
            로그인
          </button>
          <button
            type="button"
            className={`nf-auth__tab ${mode === 'signup' ? 'is-active' : ''}`}
            onClick={() => openModal('signup')}
          >
            회원가입
          </button>
        </div>
        <form className="nf-auth__form" onSubmit={handleSubmit}>
          <label className="nf-auth__field">
            <span>아이디</span>
            <input
              value={id}
              onChange={(e) => setId(e.target.value)}
              autoFocus
              placeholder="이메일 또는 닉네임"
            />
          </label>
          <label className="nf-auth__field">
            <span>비밀번호</span>
            <input
              type="password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              placeholder="비밀번호"
            />
          </label>
          {error && <p className="nf-auth__error">{error}</p>}
          <button type="submit" className="nf-auth__cta">
            {mode === 'signin' ? '로그인' : '회원가입'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AuthModal;
