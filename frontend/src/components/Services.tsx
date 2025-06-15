const servicesData = [
  { title: "Gerenciamento de Tarefas", description: "Crie, atribua e monitore tarefas com painéis visuais e intuitivos." },
  { title: "Gestão de equipes", description: "Organize seus times, defina permissões e facilite a colaboração." },
  { title: "Organização de projetos", description: "Planeje seus projetos do início ao fim com cronogramas e metas claras." },
  { title: "Relatórios e Análises", description: "Obtenha insights sobre a produtividade da equipe com relatórios detalhados." },
  { title: "Comunicação Integrada", description: "Centralize a comunicação com chats e comentários diretamente nas tarefas." },
];

export function Services() {
  return (
    <section id="services" className="bg-zinc-50 py-20 px-4">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Serviços</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {servicesData.map((service) => (
            <div key={service.title} className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg transition-shadow border border-zinc-200">
              <div className="w-full h-32 bg-zinc-200 rounded-lg mb-4">
                {/* Placeholder para imagem ou ícone */}
              </div>
              <h3 className="font-bold mb-2">{service.title}</h3>
              <p className="text-sm text-zinc-600">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}