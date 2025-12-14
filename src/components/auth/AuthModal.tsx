import { FormEvent, useEffect, useRef, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../common/ToastProvider';
import './auth.css';

function AuthModal() {
  // 모든 훅은 조건 없이 항상 같은 순서로 호출
  const { mode, open, closeModal, signin, signup, openModal } = useAuth();
  const { addToast } = useToast();
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [pwConfirm, setPwConfirm] = useState('');
  const [remember, setRemember] = useState(false);
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState('');
  const idRef = useRef<HTMLInputElement | null>(null);

  // 포커스 처리도 조건 없이 실행
  useEffect(() => {
    if (open && idRef.current) {
      idRef.current.focus();
    }
  }, [open, mode]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (mode === 'signup' && pw !== pwConfirm) {
      setError('비밀번호 확인이 일치하지 않습니다.');
      return;
    }
    const result =
      mode === 'signin' ? signin(id, pw, remember) : signup(id, pw, pwConfirm, agree);
    if (!result.ok) {
      setError(result.message || '다시 시도해주세요.');
      addToast(result.message || '오류가 발생했습니다.', 'error');
      return;
    }
    setError('');
    setId('');
    setPw('');
    setPwConfirm('');
    setRemember(false);
    setAgree(false);
    addToast(
      mode === 'signin'
        ? '로그인 완료! TMDB 키가 설정되었습니다.'
        : '회원가입 완료! TMDB 키가 설정되었습니다. 로그인하세요.',
      'success',
    );
    closeModal();
  };

  if (!open) return null;

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
              ref={idRef}
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
          {mode === 'signup' && (
            <label className="nf-auth__field">
              <span>비밀번호 확인</span>
              <input
                type="password"
                value={pwConfirm}
                onChange={(e) => setPwConfirm(e.target.value)}
                placeholder="비밀번호 확인"
              />
            </label>
          )}
          {mode === 'signin' && (
            <label className="nf-auth__checkbox">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              <span>자동 로그인 (Remember me)</span>
            </label>
          )}
          {mode === 'signup' && (
            <label className="nf-auth__checkbox">
              <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
              <span>약관에 동의합니다.</span>
            </label>
          )}
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
