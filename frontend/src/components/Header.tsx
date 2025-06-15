import { Github, Zap, Square } from "lucide-react"

export function Header() {
  return (
    <header className="relative w-full h-[75px] bg-black flex items-center justify-between px-4">
      {/* Logo Section */}
      <div className="absolute left-[9px] top-0 w-[284px] h-[78px] flex items-center">
        <img src="/images/desenrola-logo.png" alt="Desenrola" className="h-10 w-auto object-contain" />
      </div>

      {/* Right Icons Section */}
      <div className="absolute right-4 top-[13px] flex items-center gap-4">
        {/* Git Icon */}
                <div className="w-[37px] h-[37px] flex items-center justify-center">
            <Zap className="text-gray-300" />
        </div>

        {/* GitHub Icon */}
        <div className="w-[37px] h-[37px] flex items-center justify-center">
          <Github className="w-6 h-6 text-[#E6E6E6]" />
        </div>

        {/* Notion Icon */}
        <div className="w-[37px] h-[37px] flex items-center justify-center">
            <Square className="text-gray-300" />
        </div>


        {/* User Profile */}
        <div className="w-[54px] h-[48px] flex items-center justify-center">
          <div className="w-[54px] h-[54px] rounded-full border border-[#221C1D] overflow-hidden bg-gray-600">
            <img src="/images/placeholder-user.png" alt="Profile" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </header>
  )
}
