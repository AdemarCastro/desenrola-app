import { Suspense } from 'react';
import SignUpForm from './SignUpForm';

function SignUpPageLoading() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <p className="text-zinc-500">Carregando...</p>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <Suspense fallback={<SignUpPageLoading />}>
      <SignUpForm />
    </Suspense>
  );
}