import { Headset, Clock, Computer } from 'lucide-react';

const featureData = [
  {
    icon: <Headset size={32} className="text-zinc-500" />,
    title: "Support",
    description: "Suporte dedicado para garantir que sua equipe nunca pare.",
  },
  {
    icon: <Clock size={32} className="text-zinc-500" />,
    title: "24/7",
    description: "Acesso a qualquer hora, em qualquer lugar, em todos os seus dispositivos.",
  },
  {
    icon: <Computer size={32} className="text-zinc-500" />,
    title: "Interface",
    description: "Design intuitivo que facilita a adoção por toda a equipe.",
  },
];

export function Features() {
  return (
    <section className="container mx-auto py-16 px-4">
      <div className="text-center max-w-3xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-semibold">
          Transforme a forma como sua equipe se organiza, se comunica e entrega projetos
        </h2>
      </div>
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        {featureData.map((feature) => (
          <div key={feature.title} className="flex flex-col items-center p-4">
            {feature.icon}
            <h3 className="mt-4 font-bold text-lg">{feature.title}</h3>
            <p className="mt-2 text-sm text-zinc-600">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}