import Image from 'next/image';
import Link from 'next/link';
import { Mail, MapPin, Twitter, Github, Linkedin } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Dados para os links do rodapé
const footerLinks = {
  produto: [
    { name: "Visão Geral", href: "#" },
    { name: "Funcionalidades", href: "#services" },
    { name: "Preços", href: "#" },
    { name: "Feedback", href: "#feedback" },
  ],
  empresa: [
    { name: "Sobre Nós", href: "#" },
    { name: "Carreiras", href: "#" },
    { name: "Imprensa", href: "#" },
  ],
  recursos: [
    { name: "Blog", href: "#" },
    { name: "Suporte", href: "#" },
    { name: "Central de Ajuda", href: "#" },
  ],
};

// Dados para as redes sociais
const socialLinks = [
  { name: "Twitter", href: "#", icon: Twitter },
  { name: "GitHub", href: "#", icon: Github },
  { name: "LinkedIn", href: "#", icon: Linkedin },
];

export function Footer() {
  return (
    <footer id="contact" className="bg-zinc-900 text-zinc-300">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
          
          {/* Coluna da Logo e Descrição */}
          <div className="md:col-span-12 lg:col-span-4">
            <Link href="/" className="inline-block mb-4">
              <Image
                src="/logo_horizontal_o_novelo_de_la_white.png"
                alt="Logo Desenrola"
                width={150}
                height={40}
              />
            </Link>
            <p className="text-sm max-w-sm">
              Desenrola é a plataforma definitiva para equipes que buscam clareza, organização e resultados.
            </p>
            <div className="mt-6 space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Mail size={16} />
                <span>contato@desenrola.com.br</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={16} />
                <span>Manaus, AM, Brasil</span>
              </div>
            </div>
          </div>
          
          {/* Colunas de Links de Navegação */}
          <div className="md:col-span-7 lg:col-span-5 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold text-white mb-4">Produto</h3>
              <ul className="space-y-3">
                {footerLinks.produto.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="hover:text-white transition-colors text-sm">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Empresa</h3>
              <ul className="space-y-3">
                {footerLinks.empresa.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="hover:text-white transition-colors text-sm">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Recursos</h3>
              <ul className="space-y-3">
                {footerLinks.recursos.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="hover:text-white transition-colors text-sm">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Coluna da Newsletter */}
          <div className="md:col-span-5 lg:col-span-3">
             <h3 className="font-semibold text-white mb-4">Fique por dentro</h3>
             <p className="text-sm mb-4">Receba dicas de produtividade e novidades do produto diretamente no seu e-mail.</p>
             <form className="flex flex-col sm:flex-row gap-2">
                <input 
                  type="email" 
                  placeholder="Seu melhor e-mail" 
                  className="w-full px-4 py-2 rounded-md bg-zinc-800 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-white text-sm"
                />
                <button type="submit" className={cn(buttonVariants({ variant: 'default' }), 'px-4 py-2')}>
                  Inscrever
                </button>
             </form>
          </div>
        </div>

        {/* Linha de Copyright e Redes Sociais */}
        <div className="mt-16 pt-8 border-t border-zinc-800 flex flex-col sm:flex-row justify-between items-center text-sm">
          <p>&copy; {new Date().getFullYear()} Desenrola. Todos os direitos reservados.</p>
          <div className="flex items-center gap-4 mt-4 sm:mt-0">
            {socialLinks.map((social) => (
              <Link key={social.name} href={social.href} className="hover:text-white transition-colors" aria-label={social.name}>
                <social.icon size={20} />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
