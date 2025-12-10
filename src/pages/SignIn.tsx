import AuthForm from '../components/auth/AuthForm';
import '../components/auth/auth.css';
import '../components/auth/auth-form.css';

function SignIn() {
  return (
    <section className="nf-section">
      <div className="nf-section__badge">Sign In</div>
      <h1 className="nf-section__title">Welcome back, explorer</h1>
      <p className="nf-section__body">로그인 후 홈으로 이동합니다.</p>
      <AuthForm />
    </section>
  );
}

export default SignIn;
