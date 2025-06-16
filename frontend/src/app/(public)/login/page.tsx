import { Suspense } from 'react';
import LoginForm from './LoginForm';

function LoginPageLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <p className="text-black">Carregando...</p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginPageLoading />}>
      <LoginForm />
    </Suspense>
  );
}