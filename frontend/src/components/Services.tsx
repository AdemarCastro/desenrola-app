"use client";

import * as React from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const servicesData = [
  { 
    title: "Gerenciamento de Tarefas", 
    description: "Crie, atribua e monitore tarefas com painéis visuais e intuitivos.",
    imageUrl: "/services/kanban.png"
  },
  { 
    title: "Gestão de equipes", 
    description: "Organize seus times, defina permissões e facilite a colaboração.",
    imageUrl: "/services/gerenciamento_de_usuario.png"
  },
  { 
    title: "Organização de projetos", 
    description: "Planeje seus projetos do início ao fim com cronogramas e metas claras.",
    imageUrl: "/services/projetos.png"
  },
  { 
    title: "Relatórios e Análises", 
    description: "Obtenha insights sobre a produtividade da equipe com relatórios detalhados.",
    imageUrl: "/services/relatorio.png"
  },
  { 
    title: "Dashboard", 
    description: "Centralize informações dos projetos para facilitar a tomada de decisões estratégicas.",
    imageUrl: "/services/dashboard.png"
  },
];

type Service = typeof servicesData[0];

export function Services() {
  const [selectedService, setSelectedService] = React.useState<Service | null>(null);

  React.useEffect(() => {
    if (selectedService) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [selectedService]);

  return (
    <section id="services" className="py-20 px-4">
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold">Tudo que você precisa, em um só lugar</h2>
            <p className="mt-4 text-lg text-zinc-600">
                Desde o planejamento até a entrega, o Desenrola oferece as ferramentas certas para o sucesso do seu projeto.
            </p>
        </div>
        
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full max-w-6xl mx-auto"
        >
          <CarouselContent>
            {servicesData.map((service, index) => (
              <CarouselItem key={index} className="md:basis-1/2">
                {/* Adicionamos o onClick para abrir o modal */}
                <div className="p-4 cursor-pointer" onClick={() => setSelectedService(service)}>
                  <div className="relative aspect-[4/3] overflow-hidden rounded-2xl group border-2 border-zinc-100">
                    <Image
                      src={service.imageUrl}
                      alt={`Ilustração para ${service.title}`}
                      fill
                      className="object-cover w-full h-full transition-transform duration-300 ease-in-out group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/0" />
                    <div className="absolute bottom-0 left-0 p-6">
                      <h3 className="text-2xl font-bold text-white">{service.title}</h3>
                      <p className="text-base text-zinc-200 mt-2">{service.description}</p>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious 
            variant="default" 
            className="absolute left-[-80px] top-1/2 -translate-y-1/2 h-16 w-16 hidden md:inline-flex" 
          />
          <CarouselNext 
            variant="default" 
            className="absolute right-[-80px] top-1/2 -translate-y-1/2 h-16 w-16 hidden md:inline-flex" 
          />
        </Carousel>
      </div>

      {/* Modal/Lightbox com novo layout imersivo */}
      {selectedService && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => setSelectedService(null)}
        >
          <div
            className="relative rounded-xl w-full max-w-5xl h-[85vh] m-4 overflow-hidden animate-in fade-in-0 zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Imagem de fundo cobrindo todo o modal */}
            <Image
              src={selectedService.imageUrl}
              alt={`Imagem ampliada de ${selectedService.title}`}
              fill
              className="object-cover"
            />
            {/* Gradiente para garantir a legibilidade do texto */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            
            {/* Conteúdo de texto sobreposto */}
            <div className="absolute bottom-0 left-0 p-8 md:p-12 text-white">
              <h3 className="text-3xl md:text-5xl font-bold">{selectedService.title}</h3>
              <p className="text-lg md:text-xl text-zinc-200 mt-4 max-w-3xl">{selectedService.description}</p>
            </div>

            {/* Botão de fechar estilizado */}
            <button
              onClick={() => setSelectedService(null)}
              className="absolute top-5 right-5 z-10 rounded-full p-2 bg-black/40 text-white hover:bg-white hover:text-black transition-all duration-200 cursor-pointer hover:scale-110"
              aria-label="Fechar"
            >
              <X size={28} />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
