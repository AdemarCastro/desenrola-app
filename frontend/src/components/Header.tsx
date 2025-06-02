import Image from "next/image";

export default function Header() {
  return (
    <header className="bg-black text-white flex justify-end items-center px-6 h-16">
      <div className="flex items-center gap-4">
        <button>
          <Image src="/notion.png" alt="Notion" width={30} height={30} />
        </button>
        <button>
          <Image src="/github.png" alt="GitHub" width={30} height={30} />
        </button>
        <button>
          <Image
            src="/icone-usuario.png"
            alt="Avatar"
            width={32}
            height={32}
            className="rounded-full"
          />
        </button>
      </div>
    </header>
  );
}
