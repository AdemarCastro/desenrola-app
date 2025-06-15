import { Suspense } from 'react';
import LoginForm from './LoginForm';

/**
 * Um componente de fallback simples para ser exibido enquanto o LoginForm carrega.
 * Você pode personalizar isso com um spinner ou um skeleton loader.
 */
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