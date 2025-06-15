import Image from "next/image";
import { Github, Zap, User } from "lucide-react";

export function Header() {
  return (
    <header className="bg-black text-white flex justify-between items-center px-6 h-16 border-b border-gray-800">
      <div className="flex items-center gap-2">
        <Image
          src="/desenrola-white.png"
          alt="Logo Desenrola"
          width={40}
          height={40}
        />
        <span className="text-xl font-bold">Desenrola</span>
      </div>

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