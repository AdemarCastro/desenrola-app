// import { ArrowRight } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative container mx-auto text-center py-20 md:py-32 px-4">
      {/* Opcional: Círculo tracejado no fundo */}
      <div className="absolute inset-0 flex items-center justify-center -z-10">
        <div className="w-[500px] h-[500px] md:w-[700px] md:h-[700px] border-2 border-dashed border-zinc-200 rounded-full" />
      </div>

      <h1 className="text-4xl md:text-6xl font-bold max-w-4xl mx-auto leading-tight">
        Desenrola tudo com sua equipe: organize, acompanhe e entregue
      </h1>
      <p className="mt-6 text-lg text-zinc-600 max-w-2xl mx-auto">
        Domine sua rotina com uma plataforma que transforma trabalho em progresso real.
      </p>
      <div className="mt-10 flex justify-center gap-4">
        <button className="bg-zinc-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-zinc-700 transition-colors">
          Começar agora
        </button>
        <button className="bg-white border border-zinc-300 text-zinc-800 px-6 py-3 rounded-lg font-semibold hover:bg-zinc-100 transition-colors">
          Ver planos
        </button>
      </div>
    </section>
  );
}