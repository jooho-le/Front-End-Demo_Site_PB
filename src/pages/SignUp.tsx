import AuthForm from '../components/auth/AuthForm';
import '../components/auth/auth.css';
import '../components/auth/auth-form.css';

function SignUp() {
  return (
    <section className="nf-section">
      <div className="nf-section__badge">Sign Up</div>
      <h1 className="nf-section__title">Create your neon ID</h1>
      <p className="nf-section__body">회원가입 후 로그인 페이지로 이동합니다.</p>
      <AuthForm />
    </section>
  );
}

export default SignUp;
