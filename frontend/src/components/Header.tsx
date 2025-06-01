import Image from "next/image";

export default function Header() {
  return (
    <header className="bg-black text-white flex justify-end items-center px-6 h-16">
      <div className="flex items-center gap-4">
        <button>
          <Image src="/notion-icon.png" alt="Notion" width={24} height={24} />
        </button>
        <button>
          <Image src="/github-icon.png" alt="GitHub" width={24} height={24} />
        </button>
        <button>
          <Image
            src="/avatar.png"
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
