import Image from "next/image";
import Link from "next/link";
import { Github, Zap, User } from "lucide-react";

export function Header() {
  return (
    <header className="bg-black text-white flex justify-between items-center px-6 h-16 border-b border-gray-800">
      <Link href="/" className="cursor-pointer">
        <div className="flex items-center gap-2">
          <Image
            src="/logo_horizontal_o_novelo_de_la_white.png"
            alt="Logo Desenrola - Voltar para a página inicial"
            width={160}
            height={160}
            priority
          />
          <span className="text-xl font-bold"></span>
        </div>
      </Link>

      <div className="flex items-center gap-4">
        <button className="text-gray-300 hover:text-white transition-colors">
          <Zap />
        </button>
        <button className="text-gray-300 hover:text-white transition-colors">
          <Github />
        </button>
        <button className="text-gray-300 hover:text-white transition-colors">
          <User />
        </button>
      </div>
    </header>
  );
}