"use client";

export default function HeroContent() {
  return (
    <main className="absolute bottom-8 left-8 z-20 max-w-lg">
      <div className="text-left">
        <div
          className="inline-flex items-center px-3 py-1 rounded-full bg-baby-pink-lighter/60 backdrop-blur-sm mb-4 relative border border-baby-pink"
          style={{
            filter: "url(#glass-effect)",
          }}
        >
          <div className="absolute top-0 left-1 right-1 h-px bg-gradient-to-r from-transparent via-baby-pink to-transparent rounded-full" />
          <span className="text-deep-oxblood text-xs font-light relative z-10">
            ✨ New Paper Shaders Experience
          </span>
        </div>

        {/* Main Heading */}
        <h1 className="text-5xl md:text-6xl md:leading-16 tracking-tight font-light text-deep-oxblood mb-4">
          <span className="font-medium italic instrument">Beautiful</span>{" "}
          Shader
          <br />
          <span className="font-light tracking-tight text-deep-oxblood">
            Experiences
          </span>
        </h1>

        {/* Description */}
        <p className="text-xs font-light text-deep-oxblood/70 mb-4 leading-relaxed">
          Create stunning visual experiences with our advanced shader
          technology. Interactive lighting, smooth animations, and beautiful
          effects that respond to your every move.
        </p>

        {/* Buttons */}
        <div className="flex items-center gap-4 flex-wrap">
          <button className="px-8 py-3 rounded-full bg-transparent border border-deep-oxblood/30 text-deep-oxblood font-normal text-xs transition-all duration-200 hover:bg-baby-pink-lighter hover:border-deep-oxblood/50 cursor-pointer">
            Pricing
          </button>
          <button className="px-8 py-3 rounded-full bg-deep-oxblood text-white font-normal text-xs transition-all duration-200 hover:bg-oxblood-mid cursor-pointer">
            Get Started
          </button>
        </div>
      </div>
    </main>
  );
}
