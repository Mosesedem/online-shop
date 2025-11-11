"use client";

export default function Header() {
  return (
    <header className="relative z-20 flex items-center justify-between p-6">
      {/* Logo */}
      <div className="flex items-center">
        <div className="w-8 h-8 bg-deep-oxblood rounded-full mr-2" />
        <span className="bg-deep-oxblood rounded-full p-4 font-bold text-4xl">
          🍆{" "}
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex items-center space-x-2">
        <a
          href="#"
          className="text-deep-oxblood/80 hover:text-deep-oxblood text-xs font-light px-3 py-2 rounded-full hover:bg-baby-pink-lighter transition-all duration-200"
        >
          Features
        </a>
        <a
          href="#"
          className="text-deep-oxblood/80 hover:text-deep-oxblood text-xs font-light px-3 py-2 rounded-full hover:bg-baby-pink-lighter transition-all duration-200"
        >
          Pricing
        </a>
        <a
          href="#"
          className="text-deep-oxblood/80 hover:text-deep-oxblood text-xs font-light px-3 py-2 rounded-full hover:bg-baby-pink-lighter transition-all duration-200"
        >
          Docs
        </a>
      </nav>

      {/* Login Button Group with Arrow */}
      <div
        id="gooey-btn"
        className="relative flex items-center group"
        style={{ filter: "url(#gooey-filter)" }}
      >
        <button className="absolute right-0 px-2.5 py-2 rounded-full bg-deep-oxblood text-white font-normal text-xs transition-all duration-300 hover:bg-oxblood-mid cursor-pointer h-8 flex items-center justify-center -translate-x-10 group-hover:-translate-x-19 z-0">
          <svg
            className="w-3 h-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 17L17 7M17 7H7M17 7V17"
            />
          </svg>
        </button>
        <button className="px-6 py-2 rounded-full bg-deep-oxblood text-white font-normal text-xs transition-all duration-300 hover:bg-oxblood-mid cursor-pointer h-8 flex items-center z-10">
          Login
        </button>
      </div>
    </header>
  );
}
