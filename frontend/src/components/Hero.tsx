import Link from 'next/link';
import { buttonVariants } from "@/components/ui/button";
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Hero() {
  return (
    <section className="relative container mx-auto text-center py-20 md:py-32 px-4">
      <h1 className="text-4xl md:text-6xl font-bold max-w-4xl mx-auto leading-tight">
        Desenrola tudo com sua equipe: organize, acompanhe e entregue
      </h1>
      <p className="mt-6 text-lg text-zinc-600 max-w-2xl mx-auto">
        Domine sua rotina com uma plataforma que transforma trabalho em progresso real.
      </p>

      <div className="mt-10 flex justify-center gap-4">

        <Link
          href="/login"
          className={cn(buttonVariants({ variant: 'default', size: 'lg' }))}
        >
          Começar agora
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>

        <Link
          href="/inscreva-se"
          className={cn(buttonVariants({ variant: 'white', size: 'lg' }))}
        >
          Ver planos
        </Link>

      </div>
    </section>
  );
}