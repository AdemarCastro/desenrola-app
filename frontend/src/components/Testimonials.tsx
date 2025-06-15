import { Star } from 'lucide-react';

const testimonialsData = [
  { name: "Courtney Henry", feedback: "O Desenrola mudou completamente o fluxo de trabalho da nossa equipe. A organização ficou muito mais clara e a produtividade aumentou!" },
  { name: "Darrell Steward", feedback: "A melhor plataforma para gestão de projetos que já usei. A interface é limpa e as funcionalidades são poderosas. Recomendo a todos." },
  { name: "Cody Fisher", feedback: "Finalmente encontramos uma ferramenta que centraliza tudo. Comunicação, tarefas e arquivos em um só lugar. Fantástico!" },
  { name: "Bessie Cooper", feedback: "O suporte é incrível e a plataforma é super estável. Conseguimos reduzir o tempo de entrega dos nossos projetos em 30%." },
];

const Rating = ({ rating = 5 }) => (
  <div className="flex gap-1">
    {Array.from({ length: rating }).map((_, i) => (
      <Star key={i} size={16} className="text-yellow-500 fill-yellow-500" />
    ))}
  </div>
);

export function Testimonials() {
  return (
    <section id="feedback" className="py-20 px-4">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Feedback</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonialsData.map((testimonial) => (
            <div key={testimonial.name} className="bg-white p-6 rounded-2xl border border-zinc-200">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-zinc-200 rounded-full">
                  {/* Placeholder para Avatar */}
                </div>
                <div>
                  <h3 className="font-semibold">{testimonial.name}</h3>
                   <Rating />
                </div>
              </div>
              <p className="text-zinc-600 leading-relaxed">{testimonial.feedback}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}