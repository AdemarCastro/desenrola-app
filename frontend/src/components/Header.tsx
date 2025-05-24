export default function Header() {
  return (
    <header className="bg-black text-white flex justify-end items-center px-6 h-16">
      <div className="flex items-center gap-4">
        <button>
          <img src="/notion-icon.png" alt="Notion" className="w-6 h-6" />
        </button>
        <button>
          <img src="/github-icon.png" alt="GitHub" className="w-6 h-6" />
        </button>
        <button>
          <img
            src="/avatar.png"
            alt="Avatar"
            className="w-8 h-8 rounded-full"
          />
        </button>
      </div>
    </header>
  );
}
